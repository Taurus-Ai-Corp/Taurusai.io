import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  User,
  Bot,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    content: "Hi! 👋 Welcome to Taurus AI. How can I help you today?",
    sender: "agent",
    timestamp: new Date(),
  },
];

const quickReplies = [
  "Request a demo",
  "Pricing information",
  "Technical support",
  "Talk to sales",
];

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show notification badge after 5 seconds if chat is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setUnreadCount(1);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAgentResponse(content),
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("demo") || lowerMessage.includes("demonstration")) {
      return "I'd be happy to arrange a demo for you! Please visit our demo request page at /demo or share your email and our team will reach out within 24 hours.";
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("pricing") || lowerMessage.includes("cost")) {
      return "Our pricing is customized based on your organization's needs. For enterprise pricing, please contact our sales team at sales@taurus.ai or request a demo to discuss your requirements.";
    }
    if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("issue")) {
      return "For technical support, please email support@taurus.ai or call our 24/7 support line. For urgent issues, our enterprise clients have access to priority support channels.";
    }
    if (lowerMessage.includes("sales") || lowerMessage.includes("contact")) {
      return "I'll connect you with our sales team! You can reach them directly at sales@taurus.ai or call +91 123 456 7890. Would you like me to have someone reach out to you?";
    }
    if (lowerMessage.includes("product") || lowerMessage.includes("bizflow") || lowerMessage.includes("q-grid")) {
      return "We offer four main products: BizFlow™ for workflow automation, Q-Grid™ for quantum-safe security, AssetGrid™ for asset management, and Neovibe™ for analytics. Would you like more details on any specific product?";
    }
    
    return "Thank you for your message! A member of our team will respond shortly. In the meantime, feel free to explore our products at /products or request a demo at /demo.";
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-charcoal text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat with us
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <Card className={`w-[380px] shadow-2xl border-border overflow-hidden ${
          isMinimized ? "h-[60px]" : "h-[520px]"
        } transition-all duration-300`}>
          {/* Header */}
          <CardHeader className="p-4 bg-primary text-white flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Taurus AI Support</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online now
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Content */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(520px-60px)]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.sender === "user"
                            ? "bg-primary/10 text-primary"
                            : "bg-quantum/10 text-quantum"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] ${
                          message.sender === "user" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm ${
                            message.sender === "user"
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          {message.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-quantum/10 text-quantum flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-muted-foreground mb-2">Quick options:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 text-xs bg-muted hover:bg-primary hover:text-white rounded-full transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Powered by Taurus AI
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
