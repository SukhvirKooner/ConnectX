import { useState } from "react";
import { PostCard } from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/use-posts-api";
import { format } from "date-fns";

interface PostAuthor {
  name: string;
  avatar_url?: string;
  title?: string;
  company?: string;
}

interface Post {
  _id: string;
  user_id: PostAuthor;
  content: string;
  image_url?: string;
  createdAt: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
  nextPage?: number;
  prevPage?: number;
}

interface PostsResponse {
  data: Post[];
  pagination: PaginationData;
}

export function PostFeed() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Fetch posts from the API
  const { data , isLoading, isError } = usePosts<PostsResponse>({ page, limit });
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Failed to load posts. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  // If no posts are available
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No posts available. Be the first to share something!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {data.data.map((post: Post) => (
        <PostCard
          key={post._id}
          id={post._id}
          author={{
            name: post.user_id.name,
            avatar: post.user_id.avatar_url,
            title: post.user_id.title || "",
            company: post.user_id.company || ""
          }}
          content={post.content}
          image_url={post.image_url}
          timestamp={post.createdAt ? format(new Date(post.createdAt), 'PPp') : "Recently"}
          likes={post.likes_count}
          comments={post.comments_count}
          shares={post.shares_count}
        />
      ))}
      
      {/* Pagination controls */}
      {data.pagination && data.pagination.hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-smooth"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}