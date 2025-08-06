import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const trendingTopics = [
  { name: "Artificial Intelligence", posts: "12.5K posts" },
  { name: "Remote Work", posts: "8.3K posts" },
  { name: "Startup Culture", posts: "6.7K posts" },
  { name: "Web Development", posts: "15.2K posts" },
  { name: "Data Science", posts: "9.1K posts" }
];

const peopleYouMayKnow = [
  {
    name: "Alex Thompson",
    title: "Frontend Developer at Microsoft",
    avatar: "",
    mutualConnections: 12
  },
  {
    name: "Lisa Wang",
    title: "Product Designer at Google",
    avatar: "",
    mutualConnections: 8
  },
  {
    name: "James Miller",
    title: "DevOps Engineer at AWS",
    avatar: "",
    mutualConnections: 15
  }
];

const suggestedJobs = [
  {
    title: "Senior React Developer",
    company: "TechStart Inc.",
    location: "San Francisco, CA",
    type: "Full-time"
  },
  {
    title: "UX Designer",
    company: "Design Co.",
    location: "New York, NY",
    type: "Remote"
  },
  {
    title: "Product Manager",
    company: "InnovateLab",
    location: "Austin, TX",
    type: "Hybrid"
  }
];

export function RightSidebar() {
  const [connectedPeople, setConnectedPeople] = useState<string[]>([]);
  const { toast } = useToast();

  const handleConnect = (personName: string) => {
    if (connectedPeople.includes(personName)) {
      setConnectedPeople(prev => prev.filter(name => name !== personName));
      toast({ 
        title: "Connection Removed", 
        description: `You are no longer connected to ${personName}` 
      });
    } else {
      setConnectedPeople(prev => [...prev, personName]);
      toast({ 
        title: "Connected!", 
        description: `You are now connected to ${personName}` 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card className="shadow-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex justify-between items-center group cursor-pointer">
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-smooth">
                    #{topic.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{topic.posts}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* People You May Know */}
      <Card className="shadow-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            People you may know
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {peopleYouMayKnow.map((person, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate hover:text-primary cursor-pointer transition-smooth">
                    {person.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{person.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {person.mutualConnections} mutual connections
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant={connectedPeople.includes(person.name) ? "default" : "outline"}
                  className="h-8 px-3"
                  onClick={() => handleConnect(person.name)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {connectedPeople.includes(person.name) ? 'Connected' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Jobs */}
      <Card className="shadow-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Suggested for you</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {suggestedJobs.map((job, index) => (
              <div key={index} className="group cursor-pointer">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                  {job.title}
                </h4>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <p className="text-xs text-muted-foreground">{job.location}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {job.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}