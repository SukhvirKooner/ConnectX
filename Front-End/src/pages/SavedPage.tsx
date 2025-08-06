import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCard } from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const savedPosts = [
  {
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder-avatar.jpg",
      title: "Product Manager",
      company: "Microsoft"
    },
    content: "Just launched our new feature! It took months of planning and collaboration, but seeing it come to life makes it all worth it. Huge thanks to the entire team! 🎉",
    timestamp: "1 day ago",
    likes: 127,
    comments: 23,
    shares: 15
  },
  {
    author: {
      name: "Mike Chen",
      avatar: "/placeholder-avatar.jpg",
      title: "UX Designer",
      company: "Airbnb"
    },
    content: "Design thinking isn't just about making things look pretty. It's about understanding user needs and creating solutions that truly make a difference. #UXDesign #ProductDesign",
    timestamp: "3 days ago",
    likes: 89,
    comments: 12,
    shares: 7
  }
];

const savedJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    savedDate: "2 days ago"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$100k - $130k",
    savedDate: "1 week ago"
  }
];

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Saved Items</h1>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Saved Posts
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Saved Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {savedPosts.map((post, index) => (
            <div key={index} className="relative">
              <PostCard {...post} />
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="sm" className="text-primary bg-primary/10">
                  <Bookmark className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="shadow-card border border-border transition-smooth hover:shadow-elegant">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer text-lg">
                      {job.title}
                    </h3>
                    <p className="text-muted-foreground mt-1">{job.company}</p>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                    <p className="text-sm font-medium text-primary mt-2">{job.salary}</p>
                    <p className="text-xs text-muted-foreground mt-2">Saved {job.savedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      View Details
                    </Button>
                    <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}