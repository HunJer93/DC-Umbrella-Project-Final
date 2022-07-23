# This contains unit tests for TwitterScraper.py 
import json
from urllib import response
from pandas import notnull
import pytest
import index


# when a json is passed to clean_query, the Query will be extracted
def test_clean_query():
    test_query = 'The Rock'
    assert index.clean_query(test_query) == 'The Rock'
    
# when a json is passed to clean_query and the query within the json contains a comma, 
# the comma will be removed and an AND will replace it
def test_clean_query_with_commas():
    test_query = 'Michael Bolton, Lonely Island'
    assert index.clean_query(test_query) == 'Michael Bolton AND Lonely Island'
    
# when a json is passed to clean_query and the query within the json contains
# excessive white space, the white space will be trimmed
def test_clean_query_with_whitespace():
    test_query = '    Michael Bolton     , Lonely Island  '

    assert index.clean_query(test_query) == 'Michael Bolton AND Lonely Island'


# when the test_establish_twitter_connection connects, check_api returns true

# local function check_api takes the api credentials and returns if the connection was established
def check_api(api):
    # verify the credentials 
  try:
      api.verify_credentials()
      return True
  except:
      return False

def test_check_api():
    api = index.establish_twitter_connection()
    assert check_api(api) == True

# when establish_twitter_connection runs, it should establish a connection with the Twitter API
def test_check_api_connection(mocker):
    mocker.patch(
        'index.establish_twitter_connection',
        return_value='0x7f7d4f31dca0'
    )
    expected = '0x7f7d4f31dca0'
    actual = index.establish_twitter_connection()
    assert expected == actual
        
# when a payload is sent to the lambda_handler, it processes the payload
def test_lambda_handler():
    # dummy event
    event = {
    "resource": "/",
    "path": "/",
    "httpMethod": "GET",
    "requestContext": {
        "resourcePath": "/",
        "httpMethod": "GET",
        "path": "/Prod/",
    },
    "headers": {
        "accept": "text/html",
        "accept-encoding": "gzip, deflate, br",
        "Host": "xxx.us-east-2.amazonaws.com",
        "User-Agent": "Mozilla/5.0",
    },
    "multiValueHeaders": {
        "accept": [
            "text/html"
        ],
        "accept-encoding": [
            "gzip, deflate, br"
        ],
    },
    "queryStringParameters": {
        "postcode": 12345
        },
    "multiValueQueryStringParameters": "NULL",
    "pathParameters": "NULL",
    "stageVariables": "NULL",
    "body": {
        "Message": {
        'Query': 'Michael Bolton, Lonely Island',
        'Num_Tweets' : 10
    }},
    "isBase64Encoded": "False"
    }
    
    context = " "
    response = 200
    actual = index.lambda_handler(event, context)['ResponseMetadata']['HTTPStatusCode']
    assert  actual == response

