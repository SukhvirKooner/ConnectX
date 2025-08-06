import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search } from "lucide-react";

const conversations = [
  {
    id: 1,
    user: { name: "Sarah Johnson", avatar: "/placeholder-avatar.jpg" },
    lastMessage: "Thanks for the connection! Looking forward to collaborating.",
    timestamp: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    user: { name: "Mike Chen", avatar: "/placeholder-avatar.jpg" },
    lastMessage: "Great post about React patterns!",
    timestamp: "1 day ago",
    unread: false
  },
  {
    id: 3,
    user: { name: "Emily Davis", avatar: "/placeholder-avatar.jpg" },
    lastMessage: "Would love to discuss the job opportunity.",
    timestamp: "2 days ago",
    unread: true
  }
];

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi! Thanks for connecting. I saw your post about TypeScript and found it really insightful.",
    timestamp: "3:45 PM",
    isOwn: false
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you! I'm glad you found it helpful. TypeScript has really transformed how I approach development.",
    timestamp: "3:47 PM",
    isOwn: true
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "Absolutely! I've been thinking about implementing it in our current project. Would love to hear more about your experience.",
    timestamp: "3:50 PM",
    isOwn: false
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Conversations List */}
      <Card className="shadow-card border border-border">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-smooth ${
                    selectedConversation.id === conversation.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {conversation.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground truncate">
                          {conversation.user.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm truncate mt-1 ${
                        conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="lg:col-span-2">
        <Card className="shadow-card border border-border h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {selectedConversation.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-foreground">{selectedConversation.user.name}</h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Handle send message
                    setNewMessage("");
                  }
                }}
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}