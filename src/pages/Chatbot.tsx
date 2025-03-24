
import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hello! I\'m your AI Agricultural Assistant. How can I help you today?'}
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: message };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Mock API response - In a real app, this would call an actual API
    setTimeout(() => {
      const mockResponses = [
        "Based on your region's climate, rice and wheat would be suitable crops for the upcoming season.",
        "For organic pest control, neem oil extract is effective against most common agricultural pests.",
        "The optimal time for fertilizing your crops depends on the growth stage. For seedlings, apply after 2-3 weeks.",
        "Your soil appears to have adequate nitrogen levels, but may benefit from phosphorus supplementation.",
        "To improve soil health naturally, consider crop rotation and adding organic compost to your fields."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      setConversation(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsLoading(false);
      setMessage("");
    }, 1000);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col h-[80vh]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Agri Assistant</h1>
          <p className="text-muted-foreground">Ask questions in your local language and get expert advice</p>
        </div>
        
        <div className="flex-grow overflow-y-auto mb-4 glass-card p-4 rounded-lg">
          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground ml-12' 
                      : 'bg-muted text-muted-foreground mr-12'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center mb-1">
                      <Bot size={16} className="mr-1" />
                      <span className="font-semibold text-sm">AI Assistant</span>
                    </div>
                  )}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg p-3 max-w-[80%] mr-12">
                  <div className="flex items-center mb-1">
                    <Bot size={16} className="mr-1" />
                    <span className="font-semibold text-sm">AI Assistant</span>
                  </div>
                  <p className="animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me about farming, crops, soil health..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            <Send size={18} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
