import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Smile, MapPin, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreatePost } from "@/hooks/use-posts-api";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface CreatePostData {
  content: string;
  image?: File | null;
}

export function PostComposer() {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Use the create post mutation hook
  const createPostMutation = useCreatePost();
  const { mutate: createPost, status } = createPostMutation;
  const isLoading = status === 'pending';

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({ 
        title: "Photo selected", 
        description: `Selected: ${file.name}` 
      });
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = () => {
    if (!content.trim()) {
      toast({
        title: "Post cannot be empty",
        description: "Please write something to share with your network.",
        variant: "destructive",
      });
      return;
    }

    // Create post data object
    const postData = {
      content,
      image: selectedImage
    };

    // Call the create post mutation
    createPost(postData as CreatePostData, {
      onSuccess: () => {
        // Reset form
        setContent("");
        setSelectedImage(null);
        setImagePreview(null);
        
        // Invalidate and refetch posts query to show the new post
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
      onError: (error) => {
        console.error('Error creating post:', error);
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Card className="shadow-card border border-border w-full max-w-2xl mx-auto md:rounded-lg md:my-6 md:px-0 px-2 py-2">
      <CardContent className="p-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <Avatar className="h-12 w-12 mx-auto sm:mx-0">
            <AvatarImage src={user?.avatar_url} alt={user?.name || "Your avatar"} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full">
            <Textarea
              placeholder="What's on your mind? Share your thoughts with your professional network..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-0 pr-4 text-base placeholder:text-muted-foreground focus-visible:ring-0 bg-transparent w-full"
              disabled={isLoading}
            />
            {imagePreview && (
              <div className="relative mt-3 rounded-md overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Selected image" 
                  className="max-h-48 max-w-full object-contain bg-accent/20 rounded-md" 
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 hover:bg-background text-foreground"
                  onClick={handleRemoveImage}
                >
                  ✕
                </Button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-border gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Photo
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      Mood
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 h-80 overflow-y-auto p-0">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) => {
                        setContent(prev => prev + ' ' + (emoji.native || ''));
                      }}
                      theme="auto"
                    />
                  </PopoverContent>
                </Popover>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
                  onClick={() => {
                    const events = ['📅 Meeting', '🎪 Conference', '🍕 Team Lunch', '🎓 Workshop', '🚀 Product Launch'];
                    const randomEvent = events[Math.floor(Math.random() * events.length)];
                    setContent(prev => prev + ` Attending: ${randomEvent}`);
                    toast({ title: "Event added", description: `Added event: ${randomEvent}` });
                  }}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Event
                </Button>
              </div>
              <Button 
                onClick={handlePost}
                disabled={!content.trim() || isLoading}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-6 transition-smooth shadow-elegant disabled:shadow-none disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}