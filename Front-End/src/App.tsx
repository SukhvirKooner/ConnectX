import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuthModal } from "@/context/AuthModalContext";
import Index from "./pages/Index";
import NetworkPage from "./pages/NetworkPage";
import JobsPage from "./pages/JobsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import SavedPage from "./pages/SavedPage";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthModalOpen, hideAuthModal } = useAuthModal();
  
  return (
    <>
      <AuthGuard>
                <Routes>
                  <Route path="/" element={
                    <AppLayout>
                      <Index />
                    </AppLayout>
                  } />
                  <Route path="/network" element={
                    <AppLayout>
                      <NetworkPage />
                    </AppLayout>
                  } />
                  <Route path="/jobs" element={
                    <AppLayout>
                      <JobsPage />
                    </AppLayout>
                  } />
                  <Route path="/messages" element={
                    <AppLayout>
                      <MessagesPage />
                    </AppLayout>
                  } />
                  <Route path="/notifications" element={
                    <AppLayout>
                      <NotificationsPage />
                    </AppLayout>
                  } />
                  <Route path="/search" element={
                    <AppLayout>
                      <SearchPage />
                    </AppLayout>
                  } />
                  <Route path="/profile" element={
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  } />
                  <Route path="/saved" element={
                    <AppLayout>
                      <SavedPage />
                    </AppLayout>
                  } />
                  <Route path="/settings" element={
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthGuard>
            <AuthModal isOpen={isAuthModalOpen} onClose={hideAuthModal} />
          </>
        );
      }

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AuthModalProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthModalProvider>
        </AuthProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
