import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Redirect } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User, Bot, X } from 'lucide-react';

export default function AdminChats() {
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: activeChats, refetch } = trpc.aiChat.getActiveChats.useQuery(undefined, {
    refetchInterval: 5000 // Poll every 5 seconds
  });

  const { messages } = useRealtimeChat(selectedRoomId || '');
  const takeOver = trpc.aiChat.takeOverChat.useMutation();
  const sendMessage = trpc.aiChat.sendHumanMessage.useMutation();
  const closeChat = trpc.aiChat.closeChat.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user || user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  const selectedChat = activeChats?.find(chat => chat.id === selectedRoomId);

  const handleTakeOver = async () => {
    if (!selectedRoomId) return;
    try {
      await takeOver.mutateAsync({ roomId: selectedRoomId });
      refetch();
    } catch (error) {
      console.error('Failed to take over chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedRoomId) return;

    try {
      await sendMessage.mutateAsync({
        roomId: selectedRoomId,
        message: inputMessage.trim()
      });
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleCloseChat = async () => {
    if (!selectedRoomId) return;
    try {
      await closeChat.mutateAsync({ roomId: selectedRoomId });
      setSelectedRoomId(null);
      refetch();
    } catch (error) {
      console.error('Failed to close chat:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active (AI)</Badge>;
      case 'escalated':
        return <Badge className="bg-yellow-500">Escalated</Badge>;
      case 'human':
        return <Badge className="bg-blue-500">Human Support</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Live Chat Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <Card className="col-span-1 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Active Chats ({activeChats?.length || 0})</h2>
            <div className="space-y-2">
              {activeChats?.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedRoomId(chat.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedRoomId === chat.id
                      ? 'bg-cyan-50 border-cyan-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{chat.name || 'Anonymous'}</span>
                    {getStatusBadge(chat.status)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {chat.chat_messages?.[chat.chat_messages.length - 1]?.content?.substring(0, 50) || 'No messages'}...
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(chat.updated_at).toLocaleTimeString()}
                  </div>
                </button>
              ))}

              {(!activeChats || activeChats.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active chats</p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <Card className="col-span-2 flex flex-col">
            {selectedRoomId && selectedChat ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedChat.name || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.status === 'human' ? 'You are handling this chat' : 'AI is handling this chat'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {selectedChat.status !== 'human' && (
                      <Button onClick={handleTakeOver} size="sm" variant="outline">
                        Take Over
                      </Button>
                    )}
                    <Button onClick={handleCloseChat} size="sm" variant="outline">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2 ${
                        msg.message_type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {msg.message_type === 'ai' && <Bot className="w-4 h-4 text-cyan-500" />}
                        {msg.message_type === 'human' && <User className="w-4 h-4 text-blue-500" />}
                        {msg.message_type === 'user' && <User className="w-4 h-4 text-gray-500" />}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.message_type === 'system'
                            ? 'bg-gray-100 text-gray-600 text-sm italic text-center'
                            : msg.message_type === 'user'
                            ? 'bg-gray-100 text-gray-900'
                            : msg.message_type === 'ai'
                            ? 'bg-cyan-50 text-gray-900'
                            : 'bg-blue-50 text-gray-900'
                        }`}
                      >
                        <p className="text-xs opacity-70 mb-1">{msg.sender_name}</p>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.metadata?.confidence && (
                          <p className="text-xs text-gray-500 mt-1">
                            Confidence: {(msg.metadata.confidence * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input (only if human mode) */}
                {selectedChat.status === 'human' && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a chat to view messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
