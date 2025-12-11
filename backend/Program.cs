using Microsoft.EntityFrameworkCore;
using DevFlowApi.Data;
using DevFlowApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Get database connection string from environment variable
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
if (string.IsNullOrEmpty(databaseUrl))
{
    throw new InvalidOperationException("DATABASE_URL environment variable is not set");
}

// Parse PostgreSQL URL and convert to Npgsql connection string format
var connectionString = ConvertPostgresUrl(databaseUrl);

static string ConvertPostgresUrl(string url)
{
    try
    {
        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':');
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";
        
        // Parse query string for SSL mode
        var sslMode = "Prefer";
        if (!string.IsNullOrEmpty(uri.Query))
        {
            var queryParts = uri.Query.TrimStart('?').Split('&');
            foreach (var part in queryParts)
            {
                var keyValue = part.Split('=');
                if (keyValue.Length == 2 && keyValue[0] == "sslmode")
                {
                    sslMode = keyValue[1];
                    break;
                }
            }
        }
        
        return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode={sslMode}";
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException($"Failed to parse DATABASE_URL: {ex.Message}", ex);
    }
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL with Entity Framework Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure CORS to allow frontend on port 5000
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5000", "http://0.0.0.0:5000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Create database schema and seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
    
    // Seed initial data if database is empty
    if (!dbContext.Users.Any())
    {
        // Seed Users
        var users = new List<User>
        {
            new User { Name = "Alex Rivera", Email = "alex@company.com", Avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", Role = "admin" },
            new User { Name = "Sarah Chen", Email = "sarah@company.com", Avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", Role = "user" },
            new User { Name = "Mike Ross", Email = "mike@company.com", Avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", Role = "user" }
        };
        dbContext.Users.AddRange(users);
        dbContext.SaveChanges();
        
        // Seed Projects
        var projects = new List<Project>
        {
            new Project { Name = "Helios Core", Description = "Main backend infrastructure", Color = "bg-indigo-500" },
            new Project { Name = "Nebula UI", Description = "Frontend component library", Color = "bg-pink-500" },
            new Project { Name = "Orbit Mobile", Description = "React Native mobile app", Color = "bg-sky-500" },
            new Project { Name = "Vanguard API", Description = "Public facing API gateway", Color = "bg-emerald-500" }
        };
        dbContext.Projects.AddRange(projects);
        dbContext.SaveChanges();
        
        // Seed Tags
        var tags = new List<Tag>
        {
            new Tag { Name = "bug" },
            new Tag { Name = "feature-request" },
            new Tag { Name = "deployment" },
            new Tag { Name = "database" },
            new Tag { Name = "frontend" },
            new Tag { Name = "performance" }
        };
        dbContext.Tags.AddRange(tags);
        dbContext.SaveChanges();
        
        // Seed Posts
        var posts = new List<Post>
        {
            new Post
            {
                Title = "How do I handle optimistic updates in Nebula UI DataGrid?",
                Content = "I'm trying to implement row deletion but the UI flickers before the API responds. I'm using React Query for mutation but the cache update seems delayed. Here is my code snippet:\n\n```tsx\nconst mutation = useMutation({\n  onMutate: async (newTodo) => {\n    await queryClient.cancelQueries({ queryKey: ['todos'] })\n    // ...\n  }\n})\n```",
                AuthorId = 1,
                ProjectId = 2,
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                Votes = 12,
                Views = 340,
                IsAnonymous = false,
                Project = null!
            },
            new Post
            {
                Title = "Database connection pool exhaustion on production",
                Content = "We are seeing 500 errors related to max connections during peak hours. Is there a leak in the new worker service?",
                AuthorId = null,
                ProjectId = 1,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                Votes = 45,
                Views = 1200,
                IsAnonymous = true,
                Project = null!
            },
            new Post
            {
                Title = "Best practices for versioning Vanguard API endpoints?",
                Content = "Should we use URL versioning or header versioning for the v2 release?",
                AuthorId = 2,
                ProjectId = 4,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                Votes = 8,
                Views = 150,
                IsAnonymous = false,
                Project = null!
            },
            new Post
            {
                Title = "Orbit Mobile crash on Android 14",
                Content = "The app crashes immediately on launch on Pixel 8 devices running Android 14 beta.",
                AuthorId = 1,
                ProjectId = 3,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                Votes = 23,
                Views = 560,
                IsAnonymous = false,
                Project = null!
            }
        };
        dbContext.Posts.AddRange(posts);
        dbContext.SaveChanges();
        
        // Seed Post Tags
        var postTags = new List<PostTag>
        {
            new PostTag { PostId = 1, TagId = 5, Post = null!, Tag = null! },
            new PostTag { PostId = 1, TagId = 6, Post = null!, Tag = null! },
            new PostTag { PostId = 2, TagId = 1, Post = null!, Tag = null! },
            new PostTag { PostId = 2, TagId = 4, Post = null!, Tag = null! },
            new PostTag { PostId = 2, TagId = 6, Post = null!, Tag = null! },
            new PostTag { PostId = 3, TagId = 2, Post = null!, Tag = null! },
            new PostTag { PostId = 4, TagId = 1, Post = null!, Tag = null! },
            new PostTag { PostId = 4, TagId = 5, Post = null!, Tag = null! }
        };
        dbContext.PostTags.AddRange(postTags);
        dbContext.SaveChanges();
        
        // Seed Answers
        var answers = new List<Answer>
        {
            new Answer
            {
                PostId = 1,
                Content = "You need to ensure you are returning the previous context in `onMutate` and using it in `onError` to rollback. Also, check if `queryClient.setQueryData` is actually updating the cache synchronously.",
                AuthorId = 2,
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                Votes = 5,
                IsAccepted = true,
                Post = null!,
                Author = null!
            },
            new Answer
            {
                PostId = 1,
                Content = "Have you tried disabling the refetchOnMount? Sometimes that causes a flicker if the invalidation happens too quickly.",
                AuthorId = 3,
                CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                Votes = 2,
                IsAccepted = false,
                Post = null!,
                Author = null!
            },
            new Answer
            {
                PostId = 2,
                Content = "I checked the logs, it seems the `ReportingWorker` isn't releasing connections properly after the nightly batch job. I'll push a hotfix.",
                AuthorId = 1,
                CreatedAt = DateTime.UtcNow.AddHours(-12),
                Votes = 10,
                IsAccepted = false,
                Post = null!,
                Author = null!
            }
        };
        dbContext.Answers.AddRange(answers);
        dbContext.SaveChanges();
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.MapControllers();

// Configure to run on port 5001
app.Run("http://0.0.0.0:5001");
