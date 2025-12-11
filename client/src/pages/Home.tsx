import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { api, type Post, type Tag, type Project } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, TrendingUp, Tag as TagIcon, Folder } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsData, tagsData, projectsData] = await Promise.all([
          api.getPosts(),
          api.getTags(),
          api.getProjects(),
        ]);
        setPosts(postsData);
        setTags(tagsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Shuffle posts for "Hot" tab simulation
  const hotPosts = [...posts].sort((a, b) => b.votes - a.votes);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Feed */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Top Questions</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="interesting" className="w-full">
            <TabsList className="w-full sm:w-auto bg-transparent p-0 border-b border-border rounded-none h-auto mb-6">
              <TabsTrigger 
                value="interesting" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Interesting
              </TabsTrigger>
              <TabsTrigger 
                value="hot" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Hot
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Month
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interesting" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No questions yet</div>
              ) : (
                posts.map(post => (
                  <QuestionCard key={post.id} post={post as any} />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="hot" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                hotPosts.map(post => (
                  <QuestionCard key={post.id} post={post as any} />
                ))
              )}
            </TabsContent>

            <TabsContent value="week" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                posts.slice(0, 2).map(post => (
                  <QuestionCard key={post.id} post={post as any} />
                ))
              )}
            </TabsContent>

             <TabsContent value="month" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                posts.slice(2, 4).map(post => (
                  <QuestionCard key={post.id} post={post as any} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Trending Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag.id} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Folder className="w-4 h-4 text-primary" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.slice(0, 3).map(project => (
                <Link key={project.id} href={`/project/${project.id}`} className="flex items-center gap-3 group">
                  <div className={cn("w-2 h-2 rounded-full", project.color)} />
                  <div className="flex-1">
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">
                      {project.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                  </div>
                </Link>
              ))}
              <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground">
                View all projects
              </Button>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Did you know?
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              You can ask questions anonymously if you're feeling shy. Just toggle the "Post Anonymously" switch when creating a question.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
