using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevFlowApi.Data;
using DevFlowApi.Models;

namespace DevFlowApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PostsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetPosts()
    {
        var posts = await _context.Posts
            .Include(p => p.Project)
            .Include(p => p.Author)
            .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
            .Include(p => p.Answers)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Content,
                AuthorId = p.AuthorId,
                p.ProjectId,
                Tags = p.PostTags.Select(pt => pt.TagId).ToList(),
                p.CreatedAt,
                p.Votes,
                p.Views,
                Answers = p.Answers.Count,
                p.IsAnonymous
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetPost(int id)
    {
        var post = await _context.Posts
            .Include(p => p.Project)
            .Include(p => p.Author)
            .Include(p => p.PostTags)
                .ThenInclude(pt => pt.Tag)
            .Include(p => p.Answers)
                .ThenInclude(a => a.Author)
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Content,
                AuthorId = p.AuthorId,
                p.ProjectId,
                Tags = p.PostTags.Select(pt => pt.TagId).ToList(),
                p.CreatedAt,
                p.Votes,
                p.Views,
                p.IsAnonymous,
                Answers = p.Answers.Select(a => new
                {
                    a.Id,
                    a.PostId,
                    a.Content,
                    a.AuthorId,
                    a.CreatedAt,
                    a.Votes,
                    a.IsAccepted
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (post == null)
        {
            return NotFound();
        }

        // Increment view count
        var postEntity = await _context.Posts.FindAsync(id);
        if (postEntity != null)
        {
            postEntity.Views++;
            await _context.SaveChangesAsync();
        }

        return Ok(post);
    }

    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost(CreatePostDto dto)
    {
        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            AuthorId = dto.IsAnonymous ? null : dto.AuthorId,
            ProjectId = dto.ProjectId,
            CreatedAt = DateTime.UtcNow,
            Votes = 0,
            Views = 0,
            IsAnonymous = dto.IsAnonymous,
            Project = null!
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        // Add tags
        foreach (var tagId in dto.Tags)
        {
            _context.PostTags.Add(new PostTag
            {
                PostId = post.Id,
                TagId = tagId,
                Post = null!,
                Tag = null!
            });
        }
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
    }

    [HttpPost("{id}/vote")]
    public async Task<IActionResult> VotePost(int id, [FromBody] VoteDto vote)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null)
        {
            return NotFound();
        }

        post.Votes += vote.Direction; // 1 for upvote, -1 for downvote
        await _context.SaveChangesAsync();

        return Ok(new { votes = post.Votes });
    }
}

public record CreatePostDto(
    string Title,
    string Content,
    int? AuthorId,
    int ProjectId,
    List<int> Tags,
    bool IsAnonymous
);

public record VoteDto(int Direction);
