#!/bin/bash
echo 'k9B3aaeF' | scp ./nginx.conf root@ampnet.io:/etc/nginx/nginx.conf &&
echo 'k9B3aaeF' | ssh root@ampnet.io 'nginx -s reload'