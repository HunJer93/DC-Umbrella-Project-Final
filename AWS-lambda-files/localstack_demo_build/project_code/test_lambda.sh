#!/bin/bash
echo 'sending test payload'

aws --endpoint-url http://localhost:4566 lambda invoke \
    --function-name test-lambda \
    --payload fileb://test-lambda-payload.json output.txt