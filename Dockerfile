# Stage 1: Build the application using SDK image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy all project files to restore dependencies
COPY ["ValuationManagementSolu.API/ValuationManagementSolu.API.csproj", "ValuationManagementSolu.API/"]
COPY ["ValuationManagementSolu.Application/ValuationManagementSolu.Application.csproj", "ValuationManagementSolu.Application/"]
COPY ["ValuationManagementSolu.Infrastructure/ValuationManagementSolu.Infrastructure.csproj", "ValuationManagementSolu.Infrastructure/"]
COPY ["ValuationManagementSolu.Domain/ValuationManagementSolu.Domain.csproj", "ValuationManagementSolu.Domain/"]

RUN dotnet restore "ValuationManagementSolu.API/ValuationManagementSolu.API.csproj"

# Copy everything else and build the release asset
COPY . .
WORKDIR "/src/ValuationManagementSolu.API"
RUN dotnet publish "ValuationManagementSolu.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Run the application using ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render dynamically injects a PORT environment variable, ASP.NET needs to listen to it
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "ValuationManagementSolu.API.dll"]