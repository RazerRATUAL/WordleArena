using System.Text;
using BackendLeaderboard.Models;
using BackendLeaderboard.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context (SQLite)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=leaderboard.db";
builder.Services.AddDbContext<LeaderboardDbContext>(options =>
    options.UseSqlite(connectionString)
);

// Register Services
builder.Services.AddScoped<IJwtService, JwtService>();

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "WordleLeaderboardSuperSecretKey2026_MustBeLongEnoughForHMACSHA256!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "WordleApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "WordleClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Wordle Leaderboard API",
        Version = "v1",
        Description = "ASP.NET Core Web API with JWT Authentication, SQLite database, and Leaderboard tracking."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Auto-create database & Seed initial mock players if empty
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LeaderboardDbContext>();
    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
        var sampleUsers = new List<User>
        {
            new User { Username = "WordMaster", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"), Score = 1250, GamesPlayed = 18, GamesWon = 16, CurrentStreak = 6, MaxStreak = 12 },
            new User { Username = "LetterNinja", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"), Score = 980, GamesPlayed = 15, GamesWon = 13, CurrentStreak = 4, MaxStreak = 8 },
            new User { Username = "VowelHunter", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"), Score = 740, GamesPlayed = 12, GamesWon = 10, CurrentStreak = 3, MaxStreak = 5 },
            new User { Username = "PuzzlePro", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"), Score = 520, GamesPlayed = 9, GamesWon = 7, CurrentStreak = 2, MaxStreak = 4 },
            new User { Username = "Brainiac", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass123!"), Score = 350, GamesPlayed = 6, GamesWon = 5, CurrentStreak = 1, MaxStreak = 3 }
        };

        db.Users.AddRange(sampleUsers);
        db.SaveChanges();
    }
}

// HTTP request pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Wordle Leaderboard API v1");
    });
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
