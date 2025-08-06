import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ReactNode, useEffect } from "react";
import { keepAliveService } from "@/services";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Initialize keep-alive service to prevent Render from sleeping
  useEffect(() => {
    // Check if keep-alive service should be enabled based on user preference
    const isKeepAliveEnabled = localStorage.getItem('keepAliveEnabled') === 'true';
    
    if (isKeepAliveEnabled) {
      // Start the keep-alive service with a 5-minute interval
      keepAliveService.start();
      console.log('Keep-alive service started on application load');
    } else {
      // If this is the first time the app is loaded, enable keep-alive by default
      if (localStorage.getItem('keepAliveEnabled') === null) {
        localStorage.setItem('keepAliveEnabled', 'true');
        keepAliveService.start();
        console.log('Keep-alive service enabled by default');
      }
    }
    
    // Clean up the interval when the component unmounts
    return () => {
      if (isKeepAliveEnabled) {
        keepAliveService.stop();
      }
    };
  }, []);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-14 flex items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center px-4">
              <SidebarTrigger className="transition-smooth" />
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-foreground">For You</h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}