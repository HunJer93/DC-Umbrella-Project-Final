# Welcome to my Umbrella Project! 

## Project Purpose
This project was my Umbrella Project through the [Develop Carolina](https://www.developcarolina.org/) fellowship program that began January 10th, 2022 and concluded June 27th, 2022. The purpose of the project was for me to better understand full-stack development and to learn more about AWS web services. 

## Project Build Overview
The purpose of the project was to create a Twitter web scraper that would return sentiment analysis on a search query topic. The project is live [here](http://poll-the-room-frontend.s3-website-us-east-1.amazonaws.com/) and is hosted on AWS. The project consists of a Twitter scraper lambda that is responsible for querying Twitter's API based upon the search word or phrase, and a sentiment analysis lambda that is responsible for processing the sentiment analysis. The lambdas communicate to each other with an SNS/SQS messaging system that takes the payload from the scraper lambda and sends it to the sentiment lambda. The query analysis is stored in a DynamoDB where it is retrieved using APIGateway. The front-end of the site is a React website that stored in an S3 bucket. 

## Lambda Explanation
The lambda logic for the project is stored in [AWS-lambda-files](https://github.com/HunJer93/HunJer93.github.io/tree/main/AWS-lambda-files) and runs off of Python. I decided on Python for the build because the Python libraries that handle Twitter scraping and sentiment analysis were easy to use and took care a lot of the leg work in the project. The main logic for both lambdas is lambda_function.py in each respective folder. Most of the other folders in each directory are packages that needed to be converted to binary and compressed in order to be uploaded to AWS. The heavy lifting for the scraper lambda is done using [Tweepy](https://www.tweepy.org/) for scraping Twitter. The sentiment analysis library I utilized was [TextBlob](https://textblob.readthedocs.io/en/dev/quickstart.html). I also used [Pandas](https://pandas.pydata.org/) to store the data into data frames to help make manipulating and exporting the data into JSON payloads easier. The last folder titled [localstack_demo_build](https://github.com/HunJer93/HunJer93.github.io/tree/main/AWS-lambda-files/localstack_demo_build) exists more for a record of a localstack build I tested out in my local environment before I was ready to commit to AWS. The folder has no practical use in this project, but I thought it would be good to save the skeletons of the past 😄.

## Front-end Explanation
The front-end of the project is housed in [src](https://github.com/HunJer93/HunJer93.github.io/tree/main/src) and is built in React. The main logo is a Gif that I designed for fun. The site is simple with a landing page, an input page, and a graph page. The graph page utilizes an open-source chart library [Apex Charts](https://apexcharts.com/) for the positive, negative, and neutral sentiment. 

## Quirks 🐛 
Because of the time-out constraints of AWS Lambdas, the project can only process 30 tweets at a time. To compensate for this, the front-end has error handling for any input that is not valid or over 30. When using the project for the first time, there is occasionally a loading issue where the get request to APIGateway doesn't process before the page loads due to a cold start of the lambda functions. This leads to a bug where the graphs appearing without any information on it. On a page refresh, the graphs will load properly and the site will preform as normal.

Thank you for viewing my site and I hope you like it! 
