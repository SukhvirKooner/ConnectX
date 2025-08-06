import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Bookmark, ExternalLink } from "lucide-react";
import { JobApplicationModal } from "@/components/jobs/JobApplicationModal";
import { PostJobModal } from "@/components/jobs/PostJobModal";
import { useToast } from "@/hooks/use-toast";

const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "2 days ago",
    description: "We're looking for a senior frontend developer to join our growing team...",
    salary: "$120k - $150k"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    posted: "1 week ago",
    description: "Lead product strategy and development for our innovative platform...",
    salary: "$100k - $130k"
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Contract",
    posted: "3 days ago",
    description: "Create beautiful and intuitive user experiences for our clients...",
    salary: "$80k - $100k"
  }
];

export default function JobsPage() {
  const [applicationModal, setApplicationModal] = useState<{
    isOpen: boolean;
    jobTitle: string;
    company: string;
  }>({ isOpen: false, jobTitle: '', company: '' });
  const [postJobModal, setPostJobModal] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const { toast } = useToast();

  const handleApply = (jobTitle: string, company: string) => {
    setApplicationModal({ isOpen: true, jobTitle, company });
  };

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast({ title: "Job unsaved" });
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast({ title: "Job saved!" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Job Opportunities</h1>
        <Button 
          onClick={() => setPostJobModal(true)}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          Post a Job
        </Button>
      </div>

      <div className="grid gap-6">
        {jobListings.map((job) => (
          <Card key={job.id} className="shadow-card border border-border transition-smooth hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                    {job.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{job.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSaveJob(job.id)}
                  className={`${
                    savedJobs.includes(job.id) 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="secondary">{job.type}</Badge>
                  <Badge variant="outline">{job.salary}</Badge>
                </div>
                <p className="text-foreground leading-relaxed">{job.description}</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleApply(job.title, job.company)}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground"
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <JobApplicationModal
        isOpen={applicationModal.isOpen}
        onClose={() => setApplicationModal({ isOpen: false, jobTitle: '', company: '' })}
        jobTitle={applicationModal.jobTitle}
        company={applicationModal.company}
      />

      <PostJobModal
        isOpen={postJobModal}
        onClose={() => setPostJobModal(false)}
      />
    </div>
  );
}