# Blazor WASM static site — build + nginx
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY SominnercoreNew.csproj ./
RUN dotnet restore SominnercoreNew.csproj
COPY . ./
RUN dotnet publish SominnercoreNew.csproj -c Release -o /app/publish

FROM nginx:alpine AS final
COPY --from=build /app/publish/wwwroot /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
