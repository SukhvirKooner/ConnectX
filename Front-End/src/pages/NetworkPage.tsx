import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, UserCheck, Clock } from "lucide-react";

const connections = [
  {
    name: "Sarah Chen",
    title: "Senior Software Engineer at TechCorp",
    avatar: "",
    mutualConnections: 23,
    skills: ["React", "TypeScript", "Node.js"]
  },
  {
    name: "Marcus Johnson", 
    title: "Product Manager at InnovateLab",
    avatar: "",
    mutualConnections: 17,
    skills: ["Product Strategy", "Agile", "Analytics"]
  },
  {
    name: "Emily Rodriguez",
    title: "UX Designer at DesignStudio", 
    avatar: "",
    mutualConnections: 31,
    skills: ["Figma", "User Research", "Prototyping"]
  }
];

const suggestions = [
  {
    name: "Alex Thompson",
    title: "Frontend Developer at Microsoft",
    avatar: "",
    mutualConnections: 12,
    reason: "Works at Microsoft"
  },
  {
    name: "Lisa Wang",
    title: "Product Designer at Google",
    avatar: "",
    mutualConnections: 8,
    reason: "You have 8 mutual connections"
  },
  {
    name: "James Miller",
    title: "DevOps Engineer at AWS",
    avatar: "",
    mutualConnections: 15,
    reason: "Studied at Stanford University"
  }
];

const pendingRequests = [
  {
    name: "John Doe",
    title: "Software Developer at StartupXYZ",
    avatar: "",
    message: "Hi! I'd love to connect and discuss opportunities in tech."
  },
  {
    name: "Jane Smith",
    title: "Data Scientist at BigCorp",
    avatar: "",
    message: "Found your profile through mutual connections. Let's connect!"
  }
];

export default function NetworkPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">My Network</h1>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6">
          <Card className="shadow-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-success" />
                Your Connections ({connections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection, index) => (
                  <Card key={index} className="border border-border hover:shadow-elegant transition-smooth">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={connection.avatar} alt={connection.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {connection.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate hover:text-primary cursor-pointer transition-smooth">
                            {connection.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{connection.title}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {connection.mutualConnections} mutual connections
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {connection.skills.slice(0, 2).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {connection.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{connection.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Message
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <Card className="shadow-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                People you may know
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="border border-border hover:shadow-elegant transition-smooth">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {suggestion.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate hover:text-primary cursor-pointer transition-smooth">
                            {suggestion.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{suggestion.title}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{suggestion.reason}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card className="shadow-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Requests ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request, index) => (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.avatar} alt={request.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {request.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer transition-smooth">
                            {request.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{request.title}</p>
                          <p className="text-sm text-foreground mb-3 italic">"{request.message}"</p>
                          <div className="flex gap-2">
                            <Button size="sm">Accept</Button>
                            <Button variant="outline" size="sm">Decline</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}