import boto3
# create database if it doesn't already exist
def create_sentiment_table(dynamodb=None):
  if not dynamodb:
    dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:4566')
    
  table = dynamodb.create_table(
    TableName='SentimentAnalysis',
    KeySchema=[
      {
        'AttributeName': 'query_subject',
        'KeyType': 'HASH'
      },
      {
        'AttributeName': 'query_id',
        'KeyType': 'RANGE'
      }
      
    ],
    AttributeDefinitions=[
                {
            'AttributeName': 'query_subject',
            'AttributeType': 'S'
        },
        {
            'AttributeName': 'query_id',
            'AttributeType': 'N'
        }

    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
  )
  # wait until the table exists 
  table.meta.client.get_waiter('table_exists').wait(TableName='SentimentAnalysis')
  assert table.table_status == 'ACTIVE'
  return table

if __name__ == '__main__':
    sentiment_table = create_sentiment_table()
    # print the table status
    print("Status:", sentiment_table.table_status)
