using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WineStore1.Api.Data.Context;

namespace WineStore1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly WineStoreContext _db;
    private readonly IConfiguration _cfg;
    private readonly SymmetricSecurityKey _signingKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiresMinutes;

    public record LoginRequest(string Email, string Password);

    public AuthController(WineStoreContext db, IConfiguration cfg)
    {
        _db = db; _cfg = cfg;
        var jwt = _cfg.GetSection("Jwt");
        var key = jwt["Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
        _issuer = jwt["Issuer"] ?? "WineStore";
        _audience = jwt["Audience"] ?? "WineStoreClient";
        _expiresMinutes = int.TryParse(jwt["ExpiresMinutes"], out var m) ? m : 120;
        _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });

        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null) return Unauthorized(new { message = "Invalid credentials." });

        // PLAIN password check (bez hash-a)
        if (!string.Equals(user.PasswordHash, req.Password))
            return Unauthorized(new { message = "Invalid credentials." });

        var role = string.IsNullOrWhiteSpace(user.Role) ? "Customer" : user.Role;
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, role),
            new Claim("name", $"{user.FirstName} {user.LastName}".Trim())
        };

        var creds = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_expiresMinutes);
        var token = new JwtSecurityToken(_issuer, _audience, claims, expires: expires, signingCredentials: creds);
        var jwtString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new
        {
            userId = user.UserId,
            email = user.Email,
            name = $"{user.FirstName} {user.LastName}".Trim(),
            role = role,
            token = jwtString,
            expiresAt = expires.ToString("o")
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var name = User.FindFirst("name")?.Value;
        return Ok(new { userId = id, email, role, name });
    }
}
