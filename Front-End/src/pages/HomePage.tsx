import { PostComposer } from "@/components/posts/PostComposer";
import { PostFeed } from "@/components/feed/PostFeed";
import { RightSidebar } from "@/components/sidebar/RightSidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Center Column - Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <PostComposer />
            <PostFeed />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}