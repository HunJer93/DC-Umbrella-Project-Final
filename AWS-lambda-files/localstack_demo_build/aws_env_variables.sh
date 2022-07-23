#! bin/bash
export AWS_ACCESS_KEY_ID="test"

export AWS_SECRET_ACCESS_KEY="test"

export AWS_DEFAULT_REGION="us-east-1"

aws --endpoint-url=http://localhost:4566 kinesis list-streams