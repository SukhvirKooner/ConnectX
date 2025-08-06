import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
}

export function JobApplicationModal({ isOpen, onClose, jobTitle, company }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolio: '',
    experience: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate application submission
    toast({
      title: "Application Submitted!",
      description: `Your application for ${jobTitle} at ${company} has been submitted successfully.`
    });
    
    setFormData({ coverLetter: '', portfolio: '', experience: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <p className="text-muted-foreground">{company}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
              placeholder="Why are you interested in this position?"
              rows={4}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
            <Input
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
              placeholder="https://your-portfolio.com"
            />
          </div>
          
          <div>
            <Label htmlFor="experience">Relevant Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Briefly describe your relevant experience..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}