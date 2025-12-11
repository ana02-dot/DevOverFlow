using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevFlowApi.Data;
using DevFlowApi.Models;

namespace DevFlowApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnswersController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnswersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Answer>> CreateAnswer(CreateAnswerDto dto)
    {
        var answer = new Answer
        {
            PostId = dto.PostId,
            Content = dto.Content,
            AuthorId = dto.AuthorId,
            CreatedAt = DateTime.UtcNow,
            Votes = 0,
            IsAccepted = false,
            Post = null!,
            Author = null!
        };

        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAnswer), new { id = answer.Id }, answer);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Answer>> GetAnswer(int id)
    {
        var answer = await _context.Answers.FindAsync(id);

        if (answer == null)
        {
            return NotFound();
        }

        return answer;
    }

    [HttpPost("{id}/vote")]
    public async Task<IActionResult> VoteAnswer(int id, [FromBody] VoteDto vote)
    {
        var answer = await _context.Answers.FindAsync(id);
        if (answer == null)
        {
            return NotFound();
        }

        answer.Votes += vote.Direction;
        await _context.SaveChangesAsync();

        return Ok(new { votes = answer.Votes });
    }

    [HttpPost("{id}/accept")]
    public async Task<IActionResult> AcceptAnswer(int id)
    {
        var answer = await _context.Answers.FindAsync(id);
        if (answer == null)
        {
            return NotFound();
        }

        // Unaccept all other answers for this post
        var postAnswers = await _context.Answers
            .Where(a => a.PostId == answer.PostId)
            .ToListAsync();

        foreach (var a in postAnswers)
        {
            a.IsAccepted = false;
        }

        answer.IsAccepted = true;
        await _context.SaveChangesAsync();

        return Ok();
    }
}

public record CreateAnswerDto(int PostId, string Content, int AuthorId);
