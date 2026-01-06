#!/bin/sh

# NextJS does not provide a way to set the keepAliveTimeout
# or headersTimeout attributes on server so we inject our
# desired configuration directly into the node_module. This
# is necessary because the default timeout is 5s which is too
# low for our ALB causing it to send a request to a service at
# the same time that the service closes the connection resulting
# in a 502 error.
#
# https://github.com/vercel/next.js/discussions/19618
# https://www.tessian.com/blog/how-to-fix-http-502-errors/

FILE="node_modules/next/dist/server/lib/start-server.js"
STRING="srv.keepAliveTimeout = 61000; srv.headersTimeout = 62000;"

sed -i "/^srv.on('error',reject)/i $STRING" $FILE

grep -Fxq "$STRING" $FILE
