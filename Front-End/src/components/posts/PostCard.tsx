import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ThumbsUp
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { postService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  author: {
    name: string;
    avatar?: string;
    title: string;
    company: string;
  };
  content: string;
  timestamp: string;
  image_url?: string;
  likes: number;
  comments: number;
  shares: number;
}

export function PostCard({ author, content, timestamp, image_url, likes, comments, shares, id }: PostCardProps & { id?: string }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  // Fetch post details including liked status when component mounts
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (id) {
        try {
          const postData = await postService.getPostById(id);
          setIsLiked(postData.isLiked);
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      }
    };
    
    fetchPostDetails();
  }, [id]);

  const handleLike = async () => {
    if (!id) {
      // If no ID is provided, use the mock behavior
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      return;
    }
    
    try {
      setIsLoading(true);
      // Optimistically update UI
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      // Then make the API call
      const response = await postService.toggleLike(id);
      // Update with actual server response
      setIsLiked(response.isLiked);
      setLikesCount(response.likesCount);
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameClick = () => {
    navigate('/profile');
  };

  return (
    <Card className="shadow-card border border-border transition-smooth hover:shadow-elegant">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-border">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 
                className="font-semibold text-foreground hover:text-primary cursor-pointer transition-smooth"
                onClick={handleUsernameClick}
              >
                {author.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {author.title} at {author.company}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {timestamp}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Hide this post</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
          
          {/* Post Image */}
          {image_url && (
            <div className="mt-3 rounded-md overflow-hidden">
              <img 
                src={image_url} 
                alt="Post image" 
                className="max-w-full object-contain bg-accent/20 rounded-md" 
              />
            </div>
          )}
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between py-2 border-y border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {likesCount} likes
            </span>
            <span>{comments} comments</span>
            <span>{shares} reposts</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth ${
                isLiked ? 'text-primary bg-primary/10' : ''
              }`}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              Like
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
              onClick={() => {
                // TODO: Implement repost functionality
                console.log("Repost clicked");
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Repost
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className={`text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth ${
              isSaved ? 'text-primary bg-primary/10' : ''
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {/* Comment Section */}
         {id && <CommentSection postId={id} isOpen={showComments} />}
      </CardContent>
    </Card>
  );
}