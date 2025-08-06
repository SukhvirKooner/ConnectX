import { 
  Home, 
  Users, 
  MessageSquare, 
  Bell, 
  Briefcase, 
  Search,
  User,
  Bookmark,
  Settings,
  LogOut,
  LogIn
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { FiHexagon } from 'react-icons/fi';

const mainNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Network", url: "/network", icon: Users },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  // { title: "Messaging", url: "/messages", icon: MessageSquare },
  // { title: "Notifications", url: "/notifications", icon: Bell, badge: "20+" },
  { title: "Search", url: "/search", icon: Search },
];

const profileItems = [
  { title: "Profile", url: "/profile", icon: User, requiresAuth: true },
  { title: "Saved", url: "/saved", icon: Bookmark, requiresAuth: true },
  { title: "Settings", url: "/settings", icon: Settings, requiresAuth: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { logout, isAuthenticated, user } = useAuth();
  const { showAuthModal } = useAuthModal();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium shadow-glow" 
      : "hover:bg-accent text-muted-foreground hover:text-accent-foreground";
  };

  return (
    <Sidebar className="border-r border-border transition-smooth" collapsible="icon">
      <SidebarContent className="p-4">
        {/* ConnectX Logo and Name */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center mb-8' : 'gap-2 mb-6 px-2'}`}>
          <FiHexagon className="h-8 w-8 text-primary" />
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight text-primary">ConnectX</span>
          )}
        </div>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center p-3 rounded-lg transition-smooth group relative`}
                      onClick={(e) => {
                        if (!isAuthenticated && item.url !== '/') {
                          e.preventDefault();
                          showAuthModal();
                        }
                      }}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="ml-3 flex items-center justify-between w-full">
                          <span className="text-sm font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                      {isCollapsed && item.badge && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile Section */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {profileItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center p-3 rounded-lg transition-smooth`}
                      onClick={(e) => {
                        if (!isAuthenticated && item.requiresAuth) {
                          e.preventDefault();
                          showAuthModal();
                        }
                        
                        // If clicking on profile, we'll load the latest user data from API
                        // The actual data loading happens in the ProfilePage component
                      }}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Conditional Login/Signup or Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {isAuthenticated ? (
                    <button 
                      onClick={logout}
                      className="flex items-center p-3 rounded-lg transition-smooth hover:bg-destructive/10 text-destructive hover:text-destructive w-full"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </button>
                  ) : (
                    <button 
                      onClick={showAuthModal}
                      className="flex items-center p-3 rounded-lg transition-smooth hover:bg-primary/10 text-primary hover:text-primary w-full"
                    >
                      <LogIn className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3 text-sm font-medium">Login/Signup</span>}
                    </button>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}