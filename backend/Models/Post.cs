namespace DevFlowApi.Models;

public class Post
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public int? AuthorId { get; set; } // Nullable for anonymous posts
    public int ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Votes { get; set; }
    public int Views { get; set; }
    public bool IsAnonymous { get; set; }
    
    public User? Author { get; set; }
    public required Project Project { get; set; }
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
}
