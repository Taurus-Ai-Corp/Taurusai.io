import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { generateAIChatResponse, shouldEscalateToHuman, ChatContext } from "../ai/chatService";
import { supabaseAdmin } from "../supabase";

export const aiChatRouter = router({
  // Send message and get AI response
  sendMessage: publicProcedure
    .input(z.object({
      roomId: z.string(),
      message: z.string().min(1),
      userId: z.string(),
      userName: z.string(),
      productSlug: z.string().optional(),
      conversationHistory: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string()
      })).optional()
    }))
    .mutation(async ({ input }) => {
      // Store user message
      const { error: userMsgError } = await supabaseAdmin
        .from('chat_messages')
        .insert({
          room_id: input.roomId,
          sender_id: input.userId,
          sender_name: input.userName,
          content: input.message,
          message_type: 'user'
        });

      if (userMsgError) {
        throw new Error(`Failed to store message: ${userMsgError.message}`);
      }

      // Check if room is in human mode
      const { data: room } = await supabaseAdmin
        .from('chat_rooms')
        .select('status, assigned_to')
        .eq('id', input.roomId)
        .single();

      // If room is assigned to human, don't send AI response
      if (room?.status === 'human' || room?.assigned_to) {
        return {
          aiResponse: null,
          escalated: true,
          message: 'Your message has been sent to our support team. They will respond shortly.'
        };
      }

      // Generate AI response
      const aiResponse = await generateAIChatResponse(
        input.message,
        input.conversationHistory || [],
        input.productSlug
      );

      // Check if should escalate
      const shouldEscalate = shouldEscalateToHuman(input.message, aiResponse.confidence);

      if (shouldEscalate) {
        // Update room status to request human support
        await supabaseAdmin
          .from('chat_rooms')
          .update({ status: 'escalated' })
          .eq('id', input.roomId);

        // Send escalation message
        await supabaseAdmin
          .from('chat_messages')
          .insert({
            room_id: input.roomId,
            sender_id: 'system',
            sender_name: 'System',
            content: 'I\'ve notified our support team. A human agent will assist you shortly.',
            message_type: 'system'
          });

        return {
          aiResponse: null,
          escalated: true,
          message: 'Connecting you with a human agent...'
        };
      }

      // Store AI response
      await supabaseAdmin
        .from('chat_messages')
        .insert({
          room_id: input.roomId,
          sender_id: 'ai-assistant',
          sender_name: 'AI Assistant',
          content: aiResponse.message,
          message_type: 'ai',
          metadata: {
            confidence: aiResponse.confidence,
            sources: aiResponse.sources
          }
        });

      return {
        aiResponse: aiResponse.message,
        escalated: false,
        confidence: aiResponse.confidence
      };
    }),

  // Manually escalate to human
  escalateToHuman: publicProcedure
    .input(z.object({
      roomId: z.string(),
      reason: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      // Update room status
      await supabaseAdmin
        .from('chat_rooms')
        .update({ status: 'escalated' })
        .eq('id', input.roomId);

      // Send system message
      await supabaseAdmin
        .from('chat_messages')
        .insert({
          room_id: input.roomId,
          sender_id: 'system',
          sender_name: 'System',
          content: `User requested human support${input.reason ? `: ${input.reason}` : ''}. A support agent will join shortly.`,
          message_type: 'system'
        });

      return { success: true };
    }),

  // Admin: Get all active chats
  getActiveChats: protectedProcedure
    .query(async () => {
      const { data, error } = await supabaseAdmin
        .from('chat_rooms')
        .select(`
          *,
          chat_messages (
            id,
            content,
            sender_name,
            created_at,
            message_type
          )
        `)
        .in('status', ['active', 'escalated'])
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch chats: ${error.message}`);
      }

      return data;
    }),

  // Admin: Take over chat
  takeOverChat: protectedProcedure
    .input(z.object({
      roomId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // Update room to human mode
      await supabaseAdmin
        .from('chat_rooms')
        .update({
          status: 'human',
          assigned_to: ctx.user.openId
        })
        .eq('id', input.roomId);

      // Send system message
      await supabaseAdmin
        .from('chat_messages')
        .insert({
          room_id: input.roomId,
          sender_id: 'system',
          sender_name: 'System',
          content: `${ctx.user.name} has joined the chat.`,
          message_type: 'system'
        });

      return { success: true };
    }),

  // Admin: Send message as human
  sendHumanMessage: protectedProcedure
    .input(z.object({
      roomId: z.string(),
      message: z.string().min(1)
    }))
    .mutation(async ({ input, ctx }) => {
      await supabaseAdmin
        .from('chat_messages')
        .insert({
          room_id: input.roomId,
          sender_id: ctx.user.openId,
          sender_name: ctx.user.name,
          content: input.message,
          message_type: 'human'
        });

      return { success: true };
    }),

  // Admin: Close chat
  closeChat: protectedProcedure
    .input(z.object({
      roomId: z.string()
    }))
    .mutation(async ({ input }) => {
      await supabaseAdmin
        .from('chat_rooms')
        .update({ status: 'closed' })
        .eq('id', input.roomId);

      await supabaseAdmin
        .from('chat_messages')
        .insert({
          room_id: input.roomId,
          sender_id: 'system',
          sender_name: 'System',
          content: 'This chat has been closed. Thank you for contacting Taurus AI!',
          message_type: 'system'
        });

      return { success: true };
    }),
});
