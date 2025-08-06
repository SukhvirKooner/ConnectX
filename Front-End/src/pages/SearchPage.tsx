import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, FileText, Briefcase } from "lucide-react";

const searchResults = {
  people: [
    {
      id: 1,
      name: "John Smith",
      title: "Software Engineer",
      company: "Google",
      avatar: "/placeholder-avatar.jpg",
      connections: "2nd"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      title: "Product Manager",
      company: "Microsoft",
      avatar: "/placeholder-avatar.jpg",
      connections: "1st"
    }
  ],
  posts: [
    {
      id: 1,
      author: "Mike Chen",
      content: "Excited to share my thoughts on the future of AI...",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "Emily Davis",
      content: "Just completed an amazing project with my team...",
      timestamp: "1 day ago"
    }
  ],
  jobs: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote"
    }
  ]
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for people, posts, or jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="space-y-4">
          {searchResults.people.map((person) => (
            <Card key={person.id} className="shadow-card border border-border transition-smooth hover:shadow-elegant">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">
                        {person.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {person.title} at {person.company}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {person.connections} connection
                      </Badge>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {searchResults.posts.map((post) => (
            <Card key={post.id} className="shadow-card border border-border transition-smooth hover:shadow-elegant">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{post.author}</h3>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{post.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {searchResults.jobs.map((job) => (
            <Card key={job.id} className="shadow-card border border-border transition-smooth hover:shadow-elegant">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-xs text-muted-foreground">{job.location}</p>
                  </div>
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}