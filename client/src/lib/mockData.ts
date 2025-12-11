import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string | null; // null for anonymous
  projectId: string;
  tags: string[];
  createdAt: string;
  votes: number;
  views: number;
  answers: number;
  isAnonymous: boolean;
}

export interface Answer {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alex Rivera",
    email: "alex@company.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "admin",
  },
  {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah@company.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "user",
  },
  {
    id: "u3",
    name: "Mike Ross",
    email: "mike@company.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    role: "user",
  },
];

export const MOCK_PROJECTS: Project[] = [
  { id: "p1", name: "Helios Core", description: "Main backend infrastructure", color: "bg-indigo-500" },
  { id: "p2", name: "Nebula UI", description: "Frontend component library", color: "bg-pink-500" },
  { id: "p3", name: "Orbit Mobile", description: "React Native mobile app", color: "bg-sky-500" },
  { id: "p4", name: "Vanguard API", description: "Public facing API gateway", color: "bg-emerald-500" },
];

export const MOCK_TAGS: Tag[] = [
  { id: "t1", name: "bug" },
  { id: "t2", name: "feature-request" },
  { id: "t3", name: "deployment" },
  { id: "t4", name: "database" },
  { id: "t5", name: "frontend" },
  { id: "t6", name: "performance" },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "How do I handle optimistic updates in Nebula UI DataGrid?",
    content: "I'm trying to implement row deletion but the UI flickers before the API responds. I'm using React Query for mutation but the cache update seems delayed. Here is my code snippet:\n\n```tsx\nconst mutation = useMutation({\n  onMutate: async (newTodo) => {\n    await queryClient.cancelQueries({ queryKey: ['todos'] })\n    // ...\n  }\n})\n```",
    authorId: "u1",
    projectId: "p2",
    tags: ["t5", "t6"],
    createdAt: "2024-03-10T10:00:00Z",
    votes: 12,
    views: 340,
    answers: 2,
    isAnonymous: false,
  },
  {
    id: "2",
    title: "Database connection pool exhaustion on production",
    content: "We are seeing 500 errors related to max connections during peak hours. Is there a leak in the new worker service?",
    authorId: null, // Anonymous
    projectId: "p1",
    tags: ["t1", "t4", "t6"],
    createdAt: "2024-03-09T14:30:00Z",
    votes: 45,
    views: 1200,
    answers: 1,
    isAnonymous: true,
  },
  {
    id: "3",
    title: "Best practices for versioning Vanguard API endpoints?",
    content: "Should we use URL versioning or header versioning for the v2 release?",
    authorId: "u2",
    projectId: "p4",
    tags: ["t2"],
    createdAt: "2024-03-08T09:15:00Z",
    votes: 8,
    views: 150,
    answers: 0,
    isAnonymous: false,
  },
  {
    id: "4",
    title: "Orbit Mobile crash on Android 14",
    content: "The app crashes immediately on launch on Pixel 8 devices running Android 14 beta.",
    authorId: "u1",
    projectId: "p3",
    tags: ["t1", "t5"],
    createdAt: "2024-03-07T16:45:00Z",
    votes: 23,
    views: 560,
    answers: 0,
    isAnonymous: false,
  },
];

export const MOCK_ANSWERS: Answer[] = [
  {
    id: "a1",
    postId: "1",
    content: "You need to ensure you are returning the previous context in `onMutate` and using it in `onError` to rollback. Also, check if `queryClient.setQueryData` is actually updating the cache synchronously.",
    authorId: "u2",
    createdAt: "2024-03-10T11:00:00Z",
    votes: 5,
    isAccepted: true,
  },
  {
    id: "a2",
    postId: "1",
    content: "Have you tried disabling the refetchOnMount? Sometimes that causes a flicker if the invalidation happens too quickly.",
    authorId: "u3",
    createdAt: "2024-03-10T12:30:00Z",
    votes: 2,
    isAccepted: false,
  },
  {
    id: "a3",
    postId: "2",
    content: "I checked the logs, it seems the `ReportingWorker` isn't releasing connections properly after the nightly batch job. I'll push a hotfix.",
    authorId: "u1",
    createdAt: "2024-03-09T15:00:00Z",
    votes: 10,
    isAccepted: false,
  }
];
