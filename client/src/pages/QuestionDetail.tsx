import { Layout } from "@/components/Layout";
import { MOCK_POSTS, MOCK_USERS, MOCK_PROJECTS, MOCK_TAGS, MOCK_ANSWERS } from "@/lib/mockData";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Flag, 
  Check,
  User as UserIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import NotFound from "./not-found";

export default function QuestionDetail() {
  const [match, params] = useRoute("/question/:id");
  const post = MOCK_POSTS.find(p => p.id === params?.id);

  if (!post) return <NotFound />;

  const project = MOCK_PROJECTS.find(p => p.id === post.projectId);
  const author = post.authorId ? MOCK_USERS.find(u => u.id === post.authorId) : null;
  const answers = MOCK_ANSWERS.filter(a => a.postId === post.id);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Question Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/" className="hover:underline">
                Questions
              </Link>
              <span>/</span>
              <span>{post.id}</span>
            </div>

            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm pb-4 border-b border-border">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Asked</span>
                <span className="text-foreground font-medium">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Viewed</span>
                <span className="text-foreground font-medium">{post.views} times</span>
              </div>
              {project && (
                <Badge variant="outline" className="rounded-full py-0.5 px-2.5 bg-transparent gap-1.5 border-muted-foreground/30">
                  <span className={cn("w-1.5 h-1.5 rounded-full", project.color)} />
                  {project.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Question Body */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                <ArrowBigUp className="w-8 h-8 text-muted-foreground hover:text-primary" />
              </Button>
              <span className="font-bold text-lg text-foreground">{post.votes}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                <ArrowBigDown className="w-8 h-8 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                {post.tags.map(tagId => {
                  const tag = MOCK_TAGS.find(t => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <Badge key={tagId} variant="secondary" className="bg-secondary/50 hover:bg-secondary">
                      #{tag.name}
                    </Badge>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-8">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2 h-8">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2 h-8">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg min-w-[200px] border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">asked {formatDistanceToNow(new Date(post.createdAt))} ago</div>
                  <div className="flex items-center gap-2">
                    {post.isAnonymous ? (
                      <>
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                           <UserIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium italic text-muted-foreground">Anonymous</span>
                      </>
                    ) : (
                      <>
                        <Avatar className="w-8 h-8 rounded">
                          <AvatarImage src={author?.avatar} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium text-primary hover:underline cursor-pointer">
                          {author?.name || "Unknown User"}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Answers Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{answers.length} Answers</h2>

            {answers.map(answer => {
              const answerAuthor = MOCK_USERS.find(u => u.id === answer.authorId);
              return (
                <div key={answer.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                      <ArrowBigUp className="w-8 h-8 text-muted-foreground hover:text-primary" />
                    </Button>
                    <span className="font-bold text-lg text-foreground">{answer.votes}</span>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                      <ArrowBigDown className="w-8 h-8 text-muted-foreground hover:text-destructive" />
                    </Button>
                    {answer.isAccepted && (
                      <div className="mt-2 text-emerald-500">
                        <Check className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 py-1">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{answer.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                       <div className="flex gap-2">
                         <Button variant="ghost" size="sm" className="text-muted-foreground h-8">Share</Button>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-muted-foreground">answered {formatDistanceToNow(new Date(answer.createdAt))} ago</span>
                         <Avatar className="w-6 h-6 ml-2">
                           <AvatarImage src={answerAuthor?.avatar} />
                           <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <span className="text-sm text-foreground hover:text-primary cursor-pointer">
                           {answerAuthor?.name}
                         </span>
                       </div>
                    </div>
                    <Separator className="mt-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your Answer */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Your Answer</h3>
            <Textarea 
              placeholder="Write your answer here... (Markdown supported)" 
              className="min-h-[200px] font-mono text-sm"
            />
            <Button>Post Answer</Button>
          </div>
        </div>

        {/* Right Sidebar - Context */}
        <div className="space-y-6">
           <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
             <h3 className="font-semibold text-sm mb-4">Related Questions</h3>
             <div className="space-y-3">
               {MOCK_POSTS.filter(p => p.id !== post.id).slice(0, 3).map(p => (
                 <Link 
                   key={p.id} 
                   href={`/question/${p.id}`}
                   className="block text-sm text-foreground hover:text-primary leading-snug mb-1"
                 >
                   {p.title}
                 </Link>
               ))}
             </div>
           </div>

           <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
             <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider text-xs">Project</h3>
             {project && (
                <div className="flex items-center gap-3">
                   <div className={cn("w-3 h-3 rounded-full", project.color)} />
                   <div>
                     <div className="font-medium">{project.name}</div>
                     <div className="text-xs text-muted-foreground">{project.description}</div>
                   </div>
                </div>
             )}
           </div>
        </div>
      </div>
    </Layout>
  );
}
