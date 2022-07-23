#!/bin/bash
echo 'sending test payload'

aws --endpoint-url http://localhost:4566 lambda invoke \
    --function-name twitter-scraper \
    --payload fileb://test_payload.json \
    ./response.json