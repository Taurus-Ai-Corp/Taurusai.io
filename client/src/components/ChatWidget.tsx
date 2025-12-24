import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useRealtimeChat, ChatMessage } from '@/hooks/useRealtimeChat';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ChatWidgetProps {
  productSlug?: string;
}

export function ChatWidget({ productSlug }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId] = useState(() => `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [userName] = useState(() => `Visitor ${Math.floor(Math.random() * 1000)}`);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage: sendRealtimeMessage } = useRealtimeChat(roomId || '');
  const sendAiMessage = trpc.aiChat.sendMessage.useMutation();
  const escalate = trpc.aiChat.escalateToHuman.useMutation();

  // Create chat room on open
  useEffect(() => {
    if (isOpen && !roomId) {
      createChatRoom();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createChatRoom = async () => {
    if (!isSupabaseAvailable() || !supabase) {
      console.warn('Supabase is not available. Chat functionality is disabled.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          type: 'support',
          status: 'active',
          name: `Chat with ${userName}`
        })
        .select()
        .single();

      if (error) throw error;

      setRoomId(data.id);

      // Add participant
      if (!supabase) return;
      await supabase.from('chat_participants').insert({
        room_id: data.id,
        user_id: userId,
        user_name: userName
      });

      // Send welcome message
      if (!supabase) return;
      await supabase.from('chat_messages').insert({
        room_id: data.id,
        sender_id: 'ai-assistant',
        sender_name: 'AI Assistant',
        content: 'Hello! I\'m here to help you learn about Taurus AI\'s products and services. How can I assist you today?',
        message_type: 'ai'
      });
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !roomId) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsAiTyping(true);

    try {
      // Build conversation history
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.message_type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // Send message and get AI response
      await sendAiMessage.mutateAsync({
        roomId,
        message,
        userId,
        userName,
        productSlug,
        conversationHistory
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleEscalate = async () => {
    if (!roomId) return;

    try {
      await escalate.mutateAsync({
        roomId,
        reason: 'User requested human support'
      });
    } catch (error) {
      console.error('Failed to escalate:', error);
    }
  };

  const getMessageIcon = (msg: ChatMessage) => {
    if (msg.message_type === 'ai') return <Bot className="w-4 h-4 text-cyan-500" />;
    if (msg.message_type === 'human') return <User className="w-4 h-4 text-blue-500" />;
    if (msg.message_type === 'system') return null;
    return <User className="w-4 h-4 text-gray-500" />;
  };

  const getMessageStyle = (msg: ChatMessage) => {
    if (msg.message_type === 'system') {
      return 'bg-gray-100 text-gray-600 text-sm italic text-center';
    }
    if (msg.sender_id === userId) {
      return 'bg-cyan-500 text-white ml-auto';
    }
    return 'bg-gray-100 text-gray-900';
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Taurus AI Support</h3>
                <p className="text-xs text-white/80">AI-powered assistance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.sender_id === userId ? 'flex-row-reverse' : ''
                }`}
              >
                {msg.message_type !== 'system' && (
                  <div className="flex-shrink-0 mt-1">
                    {getMessageIcon(msg)}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${getMessageStyle(msg)}`}
                >
                  {msg.message_type !== 'system' && (
                    <p className="text-xs opacity-70 mb-1">{msg.sender_name}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-cyan-500 mt-1" />
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Escalate Button */}
          <div className="px-4 py-2 border-t border-gray-200">
            <button
              onClick={handleEscalate}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
            >
              Need to speak with a human? Click here
            </button>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isAiTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isAiTyping}
                size="icon"
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                {isAiTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
