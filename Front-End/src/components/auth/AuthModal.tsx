import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { ProfileSetupForm } from './ProfileSetupForm';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.profile_completed) {
    onClose();
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <LoginForm 
          onToggleMode={() => setIsRegister(!isRegister)}
          isRegister={isRegister}
        />
      </DialogContent>
    </Dialog>
  );
}