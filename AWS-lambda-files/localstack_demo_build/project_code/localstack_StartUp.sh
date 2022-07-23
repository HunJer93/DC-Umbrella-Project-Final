#!/bin/bash
echo "Configuring localstack components... Please hold."
set -x
#creation of resources using cloud templates
# set up SQS for scraper lambda
# aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name test-queue

# # set up SQS for sentiment analysis lambda
# aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name sentiment-analysis-queue

# # display queues
# aws --endpoint-url=http://localhost:4566 sqs list-queues

aws --endpoint-url=http://localhost:4566 --region=us-east-1 cloudformation create-stack \
    --template-body file://local-cloud-cft.json \
    --stack-name umbrella-project

aws --endpoint-url=http://localhost:4566 --region=us-east-1 cloudformation wait stack-create-complete \
    --stack-name umbrella-project

# run create_table.py
python3 create_table.py

# create Test Lambda Function
# aws --endpoint-url=http://localhost:4566 \
# lambda create-function --function-name test-lambda \
# --zip-file fileb://test-lambda.zip \
# --handler index.lambda_handler --runtime python3.8 \
# --role arn:aws:iam::000000000000:role/lambda-role 

# create TwitterScraper Lambda Function
# aws --endpoint-url=http://localhost:4566 \
# lambda create-function --function-name twitter-scraper \
# --zip-file fileb://twitter-scraper.zip \
# --handler index.lambda_handler --runtime python3.8 \
# --role arn:aws:iam::000000000000:role/lambda-role 

# set up REST API
output = $(aws apigateway create-rest-api --name 'Umbrella API' --region us-east-1)
echo $output

# bind twitter-scraper-queue SQS to TwitterScraper Lambda
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping --function-name twitter-scraper --batch-size 1 --event-source-arn arn:aws:sqs:us-east-1:000000000000:twitter-scraper-queue

# create SentimentAnalysis Lambda Function
# aws --endpoint-url=http://localhost:4566 \
# lambda create-function --function-name sentiment-analysis \
# --zip-file fileb://sentiment-analysis.zip \
# --handler index.lambda_handler --runtime python3.8 \
# --role arn:aws:iam::000000000000:role/lambda-role

# bind sentiment-analysis-queue SQS to sentiment-analysis Lambda
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping --function-name sentiment-analysis --batch-size 1 --event-source-arn arn:aws:sqs:us-east-1:000000000000:sentiment-analysis-queue

# manually send a message to the twitter-scraper-queue
aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url  http://localhost:4566/000000000000/twitter-scraper-queue --message-body 'this is a message test for scraper'

# manually send a payload to the twitter-scraper-queue
aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url  http://localhost:4566/000000000000/twitter-scraper-queue --message-body '{"Query": "Michael Bolton, Lonely Island","Num_Tweets" : 10}'



set +x

