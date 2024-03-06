using Microsoft.EntityFrameworkCore;
using System.Configuration;
using System.Text.Json.Serialization;
using Transportadora.Model.Interfaces;
using Transportadora.Model.Models;
using Transportadora.Model.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddTransient<IDistancia, RepositoryDistancia>();
builder.Services.AddTransient<IEntrada, RepositoryEntrada>();
builder.Services.AddTransient<IEndereco, RepositoryEndereco>();
builder.Services.AddTransient<IPickUp, RepositoryPickUp>();
builder.Services.AddTransient<IUnidades, RepositoryUnidades>();


var provider = builder.Services.BuildServiceProvider();

var configuration = provider.GetRequiredService<IConfiguration>();

string ConnectionString = configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TRANSPORTADORAContext>(options => options.UseSqlServer(ConnectionString));
builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseCors(builder => builder
.AllowAnyHeader()
.AllowAnyMethod()
.SetIsOriginAllowed((host) => true)
.AllowCredentials());

//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
