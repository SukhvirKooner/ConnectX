import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from './LoginForm';
import { ProfileSetupForm } from './ProfileSetupForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Allow home page access without authentication
  const isHomePage = location.pathname === '/';
  const requiresAuth = !isHomePage;

  if (requiresAuth && !isAuthenticated) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <LoginForm 
            onToggleMode={() => setIsRegister(!isRegister)}
            isRegister={isRegister}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // We no longer force the profile completion dialog
  // User can complete their profile later if they want
  // if (isAuthenticated && user && !user.profileCompleted) {
  //   return (
  //     <Dialog open={true} onOpenChange={() => {}}>
  //       <DialogContent className="max-w-md">
  //         <ProfileSetupForm />
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }

  return <>{children}</>;
}