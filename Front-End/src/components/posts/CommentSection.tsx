import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAddComment, usePostComments } from '@/hooks/use-posts-api';
import { Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
}

export function CommentSection({ postId, isOpen }: CommentSectionProps) {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutateAsync: addComment, isLoading: isAddingComment } = useAddComment();
  const { data: commentsData, isLoading: isLoadingComments } = usePostComments(postId, { limit: 10 });

  if (!isOpen) return null;

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await addComment({
        postId,
        data: { content: comment }
      });
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      {/* Comment input */}
      <div className="flex gap-3 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar_url} alt={user?.name || "Your avatar"} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[40px] resize-none text-sm"
            disabled={isAddingComment}
          />
          <Button 
            size="icon" 
            onClick={handleAddComment} 
            disabled={!comment.trim() || isAddingComment}
            className="h-10 w-10"
          >
            {isAddingComment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {isLoadingComments ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : commentsData?.data?.length > 0 ? (
          commentsData.data.map((comment: any) => (
            <div key={comment._id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user_id.avatar_url} alt={comment.user_id.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                  {comment.user_id.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="bg-accent/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user_id.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}