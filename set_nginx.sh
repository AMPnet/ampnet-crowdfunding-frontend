#!/bin/bash
echo "Passing new Nginx configuration to server \n" &&
echo 'k9B3aaeF' | scp ./nginx.conf root@ampnet.io:/etc/nginx/nginx.conf &&
echo "Successfully passed new nginx configuration \n" &&
echo "Reloading nginx \n" &&
echo 'k9B3aaeF' | ssh root@ampnet.io 'nginx -s reload' &&
echo "Successfully reloaded new config \n"