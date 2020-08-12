## Production build testing

This is procedure to test production build locally while using remote backend. In short, we 
generate production build in `dist/ampnet-frontend` directory and serve it through
NGINX proxy which redirects backend API routes to production remote backend (api.ampnet.io).
 
### Setup

Generate production build:
```
ng build --prod
```
This command will generate static files to `dist/ampnet-frontend` directory.

Run this command to serve these files on http://localhost:8080
```
npm run start-prod-build
```
