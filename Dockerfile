# Blazor WASM static site — build + nginx (Render-ready)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY SominnercoreNew.csproj ./
RUN dotnet restore SominnercoreNew.csproj
COPY . ./
RUN dotnet publish SominnercoreNew.csproj -c Release -o /app/publish

FROM nginx:alpine AS final
# Render injects PORT (often 10000); default 80 for local docker run
ENV PORT=80
COPY --from=build /app/publish/wwwroot /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
# nginx image runs envsubst on /etc/nginx/templates/*.template → conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
