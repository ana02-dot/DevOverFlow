import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MOCK_PROJECTS, MOCK_TAGS } from "@/lib/mockData";
import { HelpCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Ask() {
  const [_, setLocation] = useLocation();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Ask a public question</h1>
          <p className="text-muted-foreground">
            Be specific and imagine you're asking a question to another person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">Title</Label>
                  <p className="text-xs text-muted-foreground">
                    Be specific and imagine you're asking a question to another person.
                  </p>
                  <Input id="title" placeholder="e.g. Is there an R function for finding the index of an element in a vector?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project" className="font-semibold">Project</Label>
                  <p className="text-xs text-muted-foreground">
                    Which project does this relate to?
                  </p>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PROJECTS.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${project.color}`} />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body" className="font-semibold">Body</Label>
                  <p className="text-xs text-muted-foreground">
                    Include all the information someone would need to answer your question.
                  </p>
                  <Textarea 
                    id="body" 
                    className="min-h-[300px] font-mono text-sm" 
                    placeholder="Explain your problem..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-semibold">Tags</Label>
                  <p className="text-xs text-muted-foreground">
                    Add up to 5 tags to describe what your question is about.
                  </p>
                  <Input id="tags" placeholder="e.g. (react typescript-4.0 json)" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {MOCK_TAGS.slice(0, 3).map(tag => (
                      <span key={tag.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded border border-secondary-foreground/10">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymous" className="text-base font-semibold">Post Anonymously</Label>
                    <p className="text-sm text-muted-foreground">
                      Your name and avatar will be hidden from other users. Admins can still see who posted.
                    </p>
                  </div>
                  <Switch id="anonymous" />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 pt-4">
              <Button size="lg" onClick={() => setLocation("/")}>Post your question</Button>
              <Link href="/">
                <Button variant="ghost" size="lg" className="text-destructive hover:text-destructive hover:bg-destructive/10">Discard draft</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6 hidden lg:block">
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Writing a good question
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p>You’re ready to ask a programming-related question and this form will help guide you through the process.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Summarize your problem in a one-line title.</li>
                  <li>Describe your problem in more detail.</li>
                  <li>Describe what you tried and what you expected to happen.</li>
                  <li>Add “tags” which help surface your question to members of the community.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
