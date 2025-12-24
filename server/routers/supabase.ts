import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { semanticSearch, storeDocument, updateDocument, deleteDocument } from "../ai/semanticSearch";
import { supabaseAdmin } from "../supabase";

export const supabaseRouter = router({
  // Semantic Search
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      productSlug: z.string().optional(),
      matchThreshold: z.number().min(0).max(1).optional(),
      matchCount: z.number().min(1).max(50).optional(),
    }))
    .mutation(async ({ input }) => {
      return await semanticSearch(input.query, {
        productSlug: input.productSlug,
        matchThreshold: input.matchThreshold,
        matchCount: input.matchCount,
      });
    }),

  // Store Document
  storeDocument: protectedProcedure
    .input(z.object({
      content: z.string().min(1),
      metadata: z.record(z.string(), z.any()).optional(),
      productSlug: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const documentId = await storeDocument(
        input.content,
        input.metadata,
        input.productSlug
      );
      return { id: documentId };
    }),

  // Update Document
  updateDocument: protectedProcedure
    .input(z.object({
      documentId: z.string(),
      content: z.string().min(1),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      await updateDocument(
        input.documentId,
        input.content,
        input.metadata
      );
      return { success: true };
    }),

  // Delete Document
  deleteDocument: protectedProcedure
    .input(z.object({
      documentId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await deleteDocument(input.documentId);
      return { success: true };
    }),

  // Create Chat Room
  createChatRoom: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      type: z.enum(['direct', 'group', 'support']).default('support'),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdmin
        .from('chat_rooms')
        .insert({
          name: input.name,
          type: input.type,
          created_by: ctx.user.openId,
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create chat room: ${error.message}`);

      // Add creator as participant
      await supabaseAdmin.from('chat_participants').insert({
        room_id: data.id,
        user_id: ctx.user.openId,
        user_name: ctx.user.name,
      });

      return data;
    }),

  // Get User's Chat Rooms
  getChatRooms: protectedProcedure
    .query(async ({ ctx }) => {
      const { data, error } = await supabaseAdmin
        .from('chat_participants')
        .select('room_id, chat_rooms(*)')
        .eq('user_id', ctx.user.openId);

      if (error) throw new Error(`Failed to fetch chat rooms: ${error.message}`);

      return data.map(p => p.chat_rooms);
    }),

  // Send Notification
  sendNotification: protectedProcedure
    .input(z.object({
      userId: z.string(),
      title: z.string(),
      body: z.string(),
      type: z.enum(['info', 'success', 'warning', 'error', 'message']).default('info'),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: input.userId,
          title: input.title,
          body: input.body,
          type: input.type,
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to send notification: ${error.message}`);

      return data;
    }),
});
