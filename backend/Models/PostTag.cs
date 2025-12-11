namespace DevFlowApi.Models;

public class PostTag
{
    public int PostId { get; set; }
    public int TagId { get; set; }
    
    public required Post Post { get; set; }
    public required Tag Tag { get; set; }
}
