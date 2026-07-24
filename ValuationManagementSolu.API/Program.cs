using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using System.Text;
using ValuationManagementSolu.Application.IServices;
using ValuationManagementSolu.Application.Repository;
using ValuationManagementSolu.Application.Services;
using ValuationManagementSolu.Domain;
using ValuationManagementSolu.Infrastructure.BackgroundServices;
using ValuationManagementSolu.Infrastructure.Configuration;
using ValuationManagementSolu.Infrastructure.Context;
using ValuationManagementSolu.Infrastructure.Repository;
using ValuationManagementSolu.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// 1. Configure Connection String & DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Configure Identity Store
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 3. Configure CORS for React Client Integration
// 1. Fetch the origins array from appsettings.json
var allowedOrigins = builder.Configuration
    .GetSection("CorsSettings:AllowedOrigins")
    .Get<string[]>();

// 2. Inject it into your Policy registration
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactAppPolicy", policy =>
    {
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            // Fallback default or safety net if section is missing
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

// 4. Configure JWT Token Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Register Data Repository Engine Layer
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IRmDashboardService, RmDashboardService>();
builder.Services.AddScoped<IBmDashboardService, BmDashboardService>();
builder.Services.AddScoped<ICmDashboardService, CmDashboardService>();
builder.Services.AddScoped<ICmsDashboardService, CmsDashboardService>();
builder.Services.AddScoped<IValuerDashboardService, ValuerDashboardService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IAuditDashboardService, AuditDashboardService>();
builder.Services.AddScoped<IValuerService, ValuerService>();
builder.Services.AddScoped<IValuationReportService, ValuationReportService>();
builder.Services.AddScoped<IValuationReportDashboardService, ValuationReportDashboardService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IPaymentDashboardService, PaymentDashboardService>();
builder.Services.AddScoped<ICmActionService, CmActionService>();
builder.Services.AddScoped<ICmsActionService, CmsActionService>();
builder.Services.AddScoped<IEventPublisher, DbEventPublisher>();
builder.Services.AddHostedService<NotificationEventDispatcher>();
// Register your notification email system engine
builder.Services.AddScoped<INotificationEmailService, NotificationEmailService>();
// Bind setting sections
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

// Register Application Business Flow Logic Services
builder.Services.AddScoped<IFacilityService, FacilityService>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Valuation Management API", Version = "v1" });

    // Define the Bearer Security Scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token in this exact format: Bearer {your_token_here}"
    });

    // modern requirement configuration layout
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        // Using an instantiated empty List<string>() matches the target dictionary value exactly
        { new OpenApiSecuritySchemeReference("Bearer", document), new List<string>() }
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Valuation Management API V1");
    // This ensures typing http://localhost:5051 takes you directly to the UI
    c.RoutePrefix = string.Empty;
});
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI(c =>
//    {
//        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Valuation Management API V1");
//        // This ensures typing http://localhost:5051 takes you directly to the UI
//        c.RoutePrefix = string.Empty;
//    });
//}

app.UseSerilogRequestLogging();
app.UseCors("ReactAppPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// ... [Your existing middleware configurations like app.UseAuthorization(), app.MapControllers(), etc.]

// Create an isolated dependency injection scope to resolve Identity managers securely
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        // Execute seeding operation asynchronously 
        await ValuationManagementSolu.Infrastructure.Context.DataSeeder.SeedRolesAndAdminAsync(roleManager, userManager);

        Log.Information("Institutional system roles and admin user seeded into DB successfully.");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while seeding the application database roles.");
    }
}

app.Run();