#!/bin/bash
ssh $1 'rm -rf /var/www/ampnet-frontend; mkdir /var/www/ampnet-frontend'
npm run build-prod &&
scp -r dist/ampnet-frontend $1:/var/www/
