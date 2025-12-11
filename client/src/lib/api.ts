// Use relative path for API requests - the dev server proxies to the .NET backend
const API_BASE_URL = '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error ${response.status}: ${errorText}`);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  // Projects
  async getProjects() {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: number) {
    return this.request<Project>(`/projects/${id}`);
  }

  // Posts
  async getPosts(projectId?: number) {
    const query = projectId ? `?projectId=${projectId}` : '';
    return this.request<Post[]>(`/posts${query}`);
  }

  async getPost(id: number) {
    return this.request<PostDetail>(`/posts/${id}`);
  }

  async createPost(data: CreatePostDto) {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async votePost(id: number, direction: number) {
    return this.request(`/posts/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ direction }),
    });
  }

  async incrementViews(id: number) {
    return this.request(`/posts/${id}/view`, {
      method: 'POST',
    });
  }

  // Answers
  async getAnswers(postId: number) {
    return this.request<Answer[]>(`/answers?postId=${postId}`);
  }

  async createAnswer(data: CreateAnswerDto) {
    return this.request<Answer>('/answers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async voteAnswer(id: number, direction: number) {
    return this.request(`/answers/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ direction }),
    });
  }

  async acceptAnswer(id: number) {
    return this.request(`/answers/${id}/accept`, {
      method: 'POST',
    });
  }

  // Tags
  async getTags() {
    return this.request<Tag[]>('/tags');
  }

  // Users
  async getUsers() {
    return this.request<User[]>('/users');
  }

  async getUser(id: number) {
    return this.request<User>(`/users/${id}`);
  }
}

// Types matching the .NET backend models
export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  posts?: Post[];
}

export interface Post {
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
}

export interface PostDetail extends Post {
  answersList: Answer[];
  author?: User;
  project?: Project;
}

export interface Answer {
  id: number;
  postId: number;
  content: string;
  authorId: number;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
  author?: User;
}

export interface Tag {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  authorId?: number;
  projectId: number;
  tags: number[];
  isAnonymous: boolean;
}

export interface CreateAnswerDto {
  postId: number;
  content: string;
  authorId: number;
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
