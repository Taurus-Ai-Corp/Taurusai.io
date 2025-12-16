import { Router, Request, Response } from 'express';
import { constructWebhookEvent } from './stripe';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const webhookRouter = Router();

webhookRouter.post('/webhook', async (req: Request, res: Response) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }
  
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({ error: 'No signature provided' });
  }
  
  const event = constructWebhookEvent(req.body, signature, webhookSecret);
  
  if (!event) {
    return res.status(400).json({ error: 'Invalid signature' });
  }
  
  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);
  
  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.user_id || session.client_reference_id;
        
        if (userId && session.customer) {
          const db = await getDb();
          if (db) {
            await db.update(users)
              .set({ stripeCustomerId: session.customer })
              .where(eq(users.id, parseInt(userId)));
          }
        }
        console.log(`[Webhook] Checkout completed for user ${userId}`);
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        console.log(`[Webhook] Subscription ${event.type}: ${subscription.id}`);
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object as any;
        console.log(`[Webhook] Invoice paid: ${invoice.id}`);
        break;
      }
      
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default webhookRouter;
