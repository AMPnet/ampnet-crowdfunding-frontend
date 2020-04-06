#!/bin/bash
ssh $1 'rm -rf /var/www/ampnet-frontend; mkdir /var/www/ampnet-frontend' 
ng build --prod --extract-css=false &&
scp -r dist/ampnet-frontend $1:/var/www/