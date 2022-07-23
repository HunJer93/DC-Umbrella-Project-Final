# Umbrella Project Twitter Scraper
# Created by Jeremy Hunton
# 2/18/2022

# The purpose of this project is to create the logic for a Twitter Scraper 
# that will take a user argument(s) (later, will be replaced by front-end input)
# and create scrape Tweets based on that query. 

# Import the libraries needed for the project. The scraper will be based around tweepy's library
# The information gathered from tweepy will be stored in a pandas data frame.
# data will be scrubbed using re regular expressions library
import json
import logging
import pandas as pd
import tweepy
import boto3
import os
from uuid import uuid4 as get_random_uuid
from botocore.exceptions import ClientError

# constants
SQS_URL = os.environ["sqs_url"]

# handle the import json from SQS
def lambda_handler(event, context):

    # event and error logging
  print('## ENVIRONMENT VARIABLES')
  print('SQS URL: ' + SQS_URL)
  print('## EVENT')
  print(event)
  
  # process the columns from the API JSON payload and assign to local variables  
  query = event['query']
  num_tweets = int(event['numTweets'])
  user_query_id = str(get_random_uuid())

  print('query id')
  print(user_query_id)
  
  # get the query from the sqs_json, establish the api connection, and get the number of tweets needed from the sqs_json. pass all of this to the create_api_query 
  # to get the dataframe
  scraper_message = json.dumps(create_api_query(clean_query(query), establish_twitter_connection(), num_tweets, user_query_id))

  # error logging 
  print('#################### SCRAPER MESSAGE #######################')
  print(scraper_message)
  
  # ship out with Boto3 
  # get the sqs service resource
  sqs = boto3.client('sqs', endpoint_url=SQS_URL)
  
  # try to create message payload and send payload
  try:
    # create a new message with the scraper_message as the contents, and send it out to sqs
    # log the response
    print('Scraper Message successfully sent!')
    response = sqs.send_message(
      QueueUrl=SQS_URL,
      MessageBody=scraper_message)

  except ClientError as e:
    logging.error(e)
    return None
  
  # RETURN API RESPONSE WITH UUID 
  return {'response': 200, 'user_query_id': user_query_id}

    
# creates connection with twitter API using keys 
def establish_twitter_connection():
  # get the data from the CSV to allow access to Twitter's API
  log = pd.read_csv('TwitterAPIKeys.csv') # read the csv using pandas
  accessToken = log['Access Token'][0]
  accessSecret = log['Access Secret'][0] 
  consumerKey = log['API Key'][0]
  consumerSecret = log['API Key Secret'][0]
  bearerToken = log['Twitter Bearer Token'][0]
  
  # Create authentication for Twitter
  authenticate = tweepy.OAuth1UserHandler(consumerKey, consumerSecret)
  # set the access tokens/secret 
  authenticate.set_access_token(accessToken, accessSecret)
  # create the API using the credentials 
  api = tweepy.API(authenticate, wait_on_rate_limit = True) # set wait on rate to true so rate limit will replenish automatically

  # return the API connection 
  return api


# cleans the text that comes from the query
def clean_query(incomingString):
  
  # take the raw string input and break it up based upon the comma delimiter
  searchVariables = incomingString.split(',')
  
  # clean the variables of white space
  i = 0
  for phrase in searchVariables:
    searchVariables[i] = phrase.strip() # strip any werid characters or spaces 
    i = i + 1
    
  # now that the white space is cleaned up, create the query using the words
  query = ""
  
  for variable in searchVariables:
    # concadinate to query
    query = query + " AND " + variable
    
  # strip the AND from the front of the query
  query = query.strip("AND ")
  
  return query

# create_api_query takes the established twitter api and the query, and returns a dataframe from the results
def create_api_query(query, api, num_tweets, user_query_id):
  i = 0
  # create array to load JSON info and insert user_query_number at the top
  tweetArrayJson = [user_query_id]
  
  #show only English tweets for sentiment analysis
  cursor = tweepy.Cursor(api.search_tweets,q=query,lang='en').items(num_tweets)
  # load the data frame
  for status in cursor:
    # tweetArrayJson.append(status._json)
    tweet = {}
    text = status.text
    favorite_count = status.favorite_count
    retweet_count = status.retweet_count
    tweet = {"text" : text, "favorite_count": favorite_count, "retweet_count": retweet_count}

    tweetArrayJson.append(tweet)



      
  return tweetArrayJson