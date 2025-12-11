import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, ThumbsUp, User as UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

interface QuestionCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    authorId: number | null;
    projectId: number;
    tags: number[];
    createdAt: string;
    votes: number;
    views: number;
    answers: number;
    isAnonymous: boolean;
  };
}

export function QuestionCard({ post }: QuestionCardProps) {
  const [project, setProject] = useState<{name: string; color: string} | null>(null);
  const [tags, setTags] = useState<{id: number; name: string}[]>([]);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [projectData, tagsData] = await Promise.all([
          api.getProject(post.projectId).catch(() => null),
          api.getTags().catch(() => []),
        ]);
        setProject(projectData);
        setTags(tagsData.filter(t => post.tags.includes(t.id)));
      } catch (error) {
        console.error('Failed to fetch question metadata:', error);
      }
    }
    fetchMetadata();
  }, [post.projectId, post.tags]);
  
  return (
    <Card className="hover:border-primary/50 transition-colors group cursor-pointer">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              {project && (
                <Badge variant="outline" className="rounded-full py-0.5 px-2.5 text-xs font-normal bg-transparent gap-1.5 border-muted-foreground/30">
                  <span className={cn("w-1.5 h-1.5 rounded-full", project.color)} />
                  {project.name}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
            <Link href={`/question/${post.id}`}>
              <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.content}
        </p>
        
        <div className="flex gap-2 mt-3 flex-wrap">
          {tags.map(tag => (
            <Badge key={tag.id} variant="secondary" className="text-xs font-normal text-muted-foreground bg-secondary/50 hover:bg-secondary">
              #{tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-border/50 bg-muted/20 mt-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5" />
            {post.votes} votes
          </div>
          <div className={cn("flex items-center gap-1.5", post.answers > 0 && "text-primary")}>
            <MessageSquare className="w-3.5 h-3.5" />
            {post.answers} answers
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            {post.views} views
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {post.isAnonymous ? (
            <>
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="w-3 h-3" />
              </div>
              <span className="italic">Anonymous</span>
            </>
          ) : (
            // In a real app we'd look up the author, but for now we just show "User" if not anon
            // or use the mock data structure better. For this card, I'll simplify.
             <span>User {post.authorId}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
