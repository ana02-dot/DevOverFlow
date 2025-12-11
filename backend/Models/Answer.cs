namespace DevFlowApi.Models;

public class Answer
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public required string Content { get; set; }
    public int AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Votes { get; set; }
    public bool IsAccepted { get; set; }
    
    public required Post Post { get; set; }
    public required User Author { get; set; }
}
