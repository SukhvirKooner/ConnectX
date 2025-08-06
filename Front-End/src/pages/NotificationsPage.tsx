import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, UserPlus, Briefcase } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "like",
    user: { name: "Sarah Johnson", avatar: "/placeholder-avatar.jpg" },
    message: "liked your post",
    time: "5 minutes ago",
    unread: true
  },
  {
    id: 2,
    type: "comment",
    user: { name: "Mike Chen", avatar: "/placeholder-avatar.jpg" },
    message: "commented on your post",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 3,
    type: "connection",
    user: { name: "Emily Davis", avatar: "/placeholder-avatar.jpg" },
    message: "wants to connect with you",
    time: "2 hours ago",
    unread: false
  },
  {
    id: 4,
    type: "job",
    user: { name: "TechCorp Inc.", avatar: "/placeholder-avatar.jpg" },
    message: "posted a new job that matches your profile",
    time: "1 day ago",
    unread: false
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case "like": return Heart;
    case "comment": return MessageCircle;
    case "connection": return UserPlus;
    case "job": return Briefcase;
    default: return Heart;
  }
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);
          return (
            <Card key={notification.id} className={`shadow-card border transition-smooth hover:shadow-elegant ${
              notification.unread ? 'border-primary/20 bg-primary/5' : 'border-border'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {notification.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{notification.user.name}</span>{' '}
                        {notification.message}
                      </p>
                      {notification.unread && (
                        <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}