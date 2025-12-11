import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { MOCK_POSTS, MOCK_PROJECTS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Filter, Folder } from "lucide-react";
import { useRoute, Link } from "wouter";
import NotFound from "./not-found";
import { cn } from "@/lib/utils";

export default function ProjectDetail() {
  const [match, params] = useRoute("/project/:id");
  const project = MOCK_PROJECTS.find(p => p.id === params?.id);

  if (!project) return <NotFound />;

  const projectPosts = MOCK_POSTS.filter(p => p.projectId === project.id);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Project Header */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm relative overflow-hidden">
          <div className={cn("absolute top-0 left-0 w-full h-1", project.color)} />
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md", project.color)}>
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                  {project.description}
                </p>
              </div>
            </div>
            <Link href="/ask">
              <Button>Ask in {project.name}</Button>
            </Link>
          </div>
          
          <div className="flex gap-6 mt-6 pt-6 border-t border-border">
             <div className="flex flex-col">
               <span className="text-2xl font-bold">{projectPosts.length}</span>
               <span className="text-xs text-muted-foreground uppercase tracking-wider">Questions</span>
             </div>
             <div className="flex flex-col">
               <span className="text-2xl font-bold">12</span>
               <span className="text-xs text-muted-foreground uppercase tracking-wider">Members</span>
             </div>
             <div className="flex flex-col">
               <span className="text-2xl font-bold">98%</span>
               <span className="text-xs text-muted-foreground uppercase tracking-wider">Answer Rate</span>
             </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold">Recent Questions</h2>
             <Button variant="outline" size="sm" className="gap-2">
               <Filter className="w-4 h-4" />
               Filter
             </Button>
           </div>

           <div className="space-y-4">
             {projectPosts.length > 0 ? (
               projectPosts.map(post => (
                 <QuestionCard key={post.id} post={post} />
               ))
             ) : (
               <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                 No questions found for this project yet.
               </div>
             )}
           </div>
        </div>
      </div>
    </Layout>
  );
}
