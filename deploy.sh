#!/bin/bash
ng build --prod --extract-css=false &&
scp -r dist/ampnet-frontend root@ampnet.io:/var/www/