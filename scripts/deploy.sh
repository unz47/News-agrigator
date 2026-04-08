#!/bin/bash
set -e
cd "$(dirname "$0")/.."

npm install --silent
npm run build

export AWS_REGION=ap-northeast-1
aws s3 sync out/ s3://daily-news-collector-149101264858 --delete --region ap-northeast-1
aws cloudfront create-invalidation --distribution-id EQZQXK83G1TPE --paths "/*" --region us-east-1
