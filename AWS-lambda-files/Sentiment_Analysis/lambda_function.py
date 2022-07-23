import json
import re
from regex import D
from textblob import TextBlob
import json
import pandas as pd
import boto3
import logging
import os

# global constants
SQS_URL = os.environ["sqs_url"]
DYNAMO_URL = os.environ["dynamodb_url"]
dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('poll-the-room-2')

# sqs client (endpoint over ride for local host)
SQS = boto3.client('sqs', endpoint_url=SQS_URL)
# logger (and configuration)
LOGGER = logging.getLogger()
logging.basicConfig(level=logging.INFO, format='%(asctime)s: %(levelname)s: %(message)s')


# handle the import json from SQS
def lambda_handler(event, context):
  
  # event and error logging
  print('## ENVIRONMENT VARIABLES')
  print("event:")
  print(event)

  # unpackage message payload and get the body
  body_string = event['Records'][0]['body']

  # created because the actual value of the payload body is a string but the damn test won't let me pass a string, so I have to convert the event to a string, then back to a json just for the test
  # just... fantastic
  if isinstance(body_string, str) != True:
    body_string = json.dumps(body_string)

  body = json.loads(body_string)

  print('body loaded into json')
  print(body)


  # get the query id from the body by popping the first value
  user_query_id = str(body.pop(0))

  print('###########Query ID###########')
  print(user_query_id)

  print('########### Message Payload accessed ############')
  print(body)

  text = []
  rt_count = []
  favorite = []

  # cycle each tweet in the body
  for tweet in body:

    text.append(tweet["text"])
    rt_count.append(tweet['retweet_count'])
    favorite.append(tweet['favorite_count'])

  

  # create data structure
  d = {'Text': text, 'Re-Tweet Count': rt_count, 'Favorite Count': favorite}
  
  # create the data frame from the data structure
  data_frame = pd.DataFrame(data = d)
  
  # clean the tweets from the column 'Tweets
  data_frame['Text'] = data_frame['Text'].apply(textScrubber)

  # create two columns for subjectivity and polarity
  data_frame['Subjectivity'] = data_frame['Text'].apply(getSubjectivity)
  data_frame['Polarity'] = data_frame['Text'].apply(getPolarity)

  # create a new column for the analysis. This will be done in the database for the project. 
  data_frame['Analysis'] = data_frame['Polarity'].apply(getAnalysis)

  
  # send the data frame to export to dynamo
  export_to_dynamo(user_query_id, data_frame)
  return "I think that worked!"

# export_to_dynamo exports the data frame created to a dynamo DB
def export_to_dynamo(user_query_id, data_frame):

  payload = {}
  query_id = 1
  # for each record within the data frame, load the payload
  for record in data_frame.itertuples(index=True, name=None):

    # load the dataframe value into the analysis dict
    payload['user_query_id'] = str(user_query_id) # unique identifier so the user's values can be found
    payload['query_id'] = query_id # identifier that keeps track of each tweet in the query
    payload['Text']={'S': record[1]} # was 0
    payload['Re_Tweet_Count']={'N': str(record[2])} # was 1
    payload['Favorite_Count']={'N': str(record[3])} # was 2
    payload['Subjectivity']={'N': str(record[4])} # was 3
    payload['Polarity']={'N': str(record[5])} # was 4
    payload['Analysis']={'S': str(record[6])} # was 5
    
    # increment the query_id for each tweet in the query
    query_id = query_id + 1

    # upload the payload to dynamodb
    try:
      # log payload 
      print('############### SENT PAYLOAD ##################')
      print(payload)

      table.put_item(Item=payload)
    except Exception as e:
      LOGGER.error(e)
      
# clean the raw tweet info using a text scrubber method
def textScrubber(text):
  # use a regular expression to look for @ mentions 
  text = re.sub(r'@[A-Za-z0-9:]+', '', text)
  text = re.sub(r'#', '', text) #removing the '#' from the tweet
  text = re.sub(r'RT[\s]+', '', text) #removes any retweets 
  text = re.sub(r'https?:\/\/\S+', '', text) # remove any hyper link. \ escapes the / used in the hyper link, and S+ is looking for any white space after the //.
  text = re.sub(r'\n', ' ', text) # removes next lines
  
  # clean up the white space
  text = text.strip()
  return text

# Create a function to get the subjectivity (gets positive/negative words from text) using TextBlob
# in the project, this will be the sentiment analysis lambda expression
def getSubjectivity(text):
  return TextBlob(text).sentiment.subjectivity

# Create a function to get the polarity (how positive or negative the text is)
def getPolarity(text):
  return TextBlob(text).sentiment.polarity

# Create a function to compute the negative, neutral, and positive analysis of the words within the tweets
# getAnalysis takes a score and returns if it is a negative sentiment, positive, or neutral
def getAnalysis(score):
  if score < 0:
    return 'Negative'
  elif score == 0:
    return 'Neutral'
  else: 
    return 'Positive'
  

  