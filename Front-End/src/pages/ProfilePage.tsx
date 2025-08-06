import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/posts/PostCard";
import { MapPin, Calendar, Edit, Mail, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService, skillService, postService, authService } from "@/services";
import { format } from "date-fns";

interface Skill {
  id: string;
  name: string;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    company?: string;
  };
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authUser) {
        setError("User not found.");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current user profile from /api/auth/me endpoint
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        
        // Fetch user skills
        const skillsResponse = await skillService.getUserSkills(currentUser._id);
        setUserSkills(skillsResponse?.items || []);
        
        // Fetch user posts directly using the new API endpoint
        const postsResponse = await postService.getPostsByUserId(currentUser._id, { limit: 5 });
        setUserPosts(postsResponse?.items || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [authUser]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Format join date
  // const joinDate = user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently';

  return (
    <div className="mx-auto max-w-2xl mt-8">
      {/* Profile Header */}
      <Card className="shadow-card border border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-border">
              <AvatarImage alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    {user.title} {user.company && `at ${user.company}`}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {/* Joined {joinDate} */}
                    </span>
                  </div>
                  <p className="text-sm text-primary font-medium mt-2">
                    {/* {user.connections || 0} connections */}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed mt-4">{user.bio || 'No bio provided yet.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="shadow-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {userSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {skill.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skills added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Posts Section */}
      <Card className="shadow-card border border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard 
                key={post.id} 
                author={{
                  name: post.author.name,
                  avatar: post.author.avatar,
                  title: post.author.title || '',
                  company: post.author.company || ''
                }}
                content={post.content}
                image_url={post.image}
                timestamp={format(new Date(post.createdAt), 'PPp')}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No posts yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}