#!/bin/sh
set -xe
: "${API_URL?Need an api url}"
: "${SCHOOL_ID?Need school id with value all or a specific id comma separated}"

sed -i "s#REPLACE_API_URL#$API_URL#g" /usr/share/nginx/html/chunk-*.js
sed -i "s#REPLACE_SCHOOL_ID#$SCHOOL_ID#g" /usr/share/nginx/html/chunk-*.js

exec "$@"