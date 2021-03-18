## Serving production build

This is procedure to serve production build locally while using remote backend. In short, we 
generate production build in `dist/ampnet-frontend` directory and serve it through
NGINX proxy which redirects backend API routes to production remote backend (staging.ampnet.io). 
 
### Setup

Generate production build:
```
ng build --prod
```

Build Docker image:
```
docker build --no-cache -f prod-build/Dockerfile -t ampnet/ampnet-crowdfunding-frontend:local .
```

Run Docker container:
```
docker run --rm -p 8080:80 -e BACKEND_URL=https://staging.ampnet.io ampnet/ampnet-crowdfunding-frontend:local
```

The application, connected to https://staging.ampnet.io backend, will be served at http://localhost:8080.
