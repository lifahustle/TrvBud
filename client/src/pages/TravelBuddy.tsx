import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Bot, 
  User, 
  MapPin, 
  Calendar, 
  Plane,
  Hotel,
  Car,
  Clock,
  Loader2,
  Sparkles,
  MessageCircle,
  Globe,
  Star
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

const quickSuggestions = [
  {
    icon: MapPin,
    text: "Best places to visit in Thailand",
    category: "Destinations"
  },
  {
    icon: Hotel,
    text: "Budget hotels in Bali under $50",
    category: "Accommodations"
  },
  {
    icon: Plane,
    text: "Cheap flights to Singapore",
    category: "Flights"
  },
  {
    icon: Car,
    text: "Transportation options in Manila",
    category: "Transport"
  },
  {
    icon: Calendar,
    text: "Best time to visit Vietnam",
    category: "Planning"
  },
  {
    icon: Globe,
    text: "Southeast Asia travel itinerary",
    category: "Itinerary"
  }
];

export default function TravelBuddy() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm Bruce, your TrvBUD AI assistant. I can help you plan your Southeast Asian adventure, find the best deals, recommend destinations, and answer any travel questions you have. What would you like to explore today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
      });
      return response;
    },
    onSuccess: (response) => {
      setIsTyping(false);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.reply,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => prev.map(msg => 
        msg.isTyping ? assistantMessage : msg
      ));
    },
    onError: (error) => {
      setIsTyping(false);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      toast({
        title: "Connection Error",
        description: "Unable to connect to TrvBUD assistant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);
    
    // Send to AI
    chatMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bruce - TrvBUD Assistant
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your AI-powered Southeast Asian travel companion
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Southeast Asia Expert
            </Badge>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Bruce - TrvBUD Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Online • Ready to help</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {message.role === 'user' ? (
                        <AvatarFallback className="bg-gray-100">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Bruce is thinking...</span>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-b bg-gray-50">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Suggestions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSuggestion(suggestion.text)}
                        className="justify-start h-auto p-3 text-left"
                      >
                        <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                          <div className="text-sm">{suggestion.text}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Southeast Asian travel..."
                  className="flex-1 min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || chatMutation.isPending}
                  size="icon"
                  className="h-11 w-11 flex-shrink-0"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Bruce can help with travel planning, recommendations, and Southeast Asian destinations
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center p-4">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-sm mb-1">Destination Expert</h3>
            <p className="text-xs text-muted-foreground">Get insider tips on Southeast Asian destinations</p>
          </Card>
          
          <Card className="text-center p-4">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <h3 className="font-semibold text-sm mb-1">Personalized Recommendations</h3>
            <p className="text-xs text-muted-foreground">Tailored suggestions based on your preferences</p>
          </Card>
          
          <Card className="text-center p-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-sm mb-1">24/7 Available</h3>
            <p className="text-xs text-muted-foreground">Get instant travel assistance anytime</p>
          </Card>
        </div>
      </div>
    </div>
  );
}