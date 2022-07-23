import index
import unittest
from moto import mock_dynamodb2
import boto3
import pytest
import json
import decimal
    
# when textScrubber is called, people tagged with @ will be removed
def test_textScrubber_remove_at_mention():
    text = '@TestPerson check this out!'
    
    assert index.textScrubber(text) == 'check this out!'
    
# when textScrubber is called, # will be removed 
def test_textScrubber_remove_hashtag():
    text = '@TestPerson check this out! #thisisneat #wow'
    
    assert index.textScrubber(text) == 'check this out! thisisneat wow'
    
# when textScrubber is called, Retweets with RT will be removed
def test_textScrubber_remove_Retweet():
    text = 'RT@TestPerson check this out! #thisisneat #wow'
    
    assert index.textScrubber(text) == 'check this out! thisisneat wow'
    
# when textScrubber is called, any hyperlinks are removed
def test_textScrubber_remove_hyperlink():
    text = 'RT@TestPerson check this out! #thisisneat #wow https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    
    assert index.textScrubber(text) == 'check this out! thisisneat wow'
    
# when a payload is sent to the lambda_handler, it processes the payload (single tweet test)
# only works when localstack is running
def test_lambda_handler():
    # dummy event
    event = {
        "Records": {
           'body': {
               'Message':[{'created_at': 'Fri Apr 22 12:23:24 +0000 2022', 'id': 1517479181310779392, 'id_str': '1517479181310779392', 'text': 'RT @JobPreference: NEED a #JOB?\nSign up now https://t.co/o7lVlsCHXv\nFREE. NO MIDDLEMEN\n#Jobs #AI #DataAnalytics #MachineLearning #Python #J…', 'truncated': False, 'entities': {'hashtags': [{'text': 'JOB', 'indices': [26, 30]}, {'text': 'Jobs', 'indices': [87, 92]}, {'text': 'AI', 'indices': [93, 96]}, {'text': 'DataAnalytics', 'indices': [97, 111]}, {'text': 'MachineLearning', 'indices': [112, 128]}, {'text': 'Python', 'indices': [129, 136]}], 'symbols': [], 'user_mentions': [{'screen_name': 'JobPreference', 'name': 'Job Preference', 'id': 1332714745871421443, 'id_str': '1332714745871421443', 'indices': [3, 17]}], 'urls': [{'url': 'https://t.co/o7lVlsCHXv', 'expanded_url': 'http://www.jobpreference.com', 'display_url': 'jobpreference.com', 'indices': [44, 67]}]}, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'source': '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>', 'in_reply_to_status_id': None, 'in_reply_to_status_id_str': None, 'in_reply_to_user_id': None, 'in_reply_to_user_id_str': None, 'in_reply_to_screen_name': None, 'user': {'id': 1509414295703994368, 'id_str': '1509414295703994368', 'name': 'Amrita Singam', 'screen_name': 'amrita_singam', 'location': '', 'description': '', 'url': None, 'entities': {'description': {'urls': []}}, 'protected': False, 'followers_count': 3, 'friends_count': 0, 'listed_count': 0, 'created_at': 'Thu Mar 31 06:17:27 +0000 2022', 'favourites_count': 49, 'utc_offset': None, 'time_zone': None, 'geo_enabled': False, 'verified': False, 'statuses_count': 96, 'lang': None, 'contributors_enabled': False, 'is_translator': False, 'is_translation_enabled': False, 'profile_background_color': 'F5F8FA', 'profile_background_image_url': None, 'profile_background_image_url_https': None, 'profile_background_tile': False, 'profile_image_url': 'http://pbs.twimg.com/profile_images/1509414553276194816/nSr7FH_R_normal.png', 'profile_image_url_https': 'https://pbs.twimg.com/profile_images/1509414553276194816/nSr7FH_R_normal.png', 'profile_link_color': '1DA1F2', 'profile_sidebar_border_color': 'C0DEED', 'profile_sidebar_fill_color': 'DDEEF6', 'profile_text_color': '333333', 'profile_use_background_image': True, 'has_extended_profile': True, 'default_profile': True, 'default_profile_image': False, 'following': False, 'follow_request_sent': False, 'notifications': False, 'translator_type': 'none', 'withheld_in_countries': []}, 'geo': None, 'coordinates': None, 'place': None, 'contributors': None, 'retweeted_status': {'created_at': 'Fri Apr 22 02:50:00 +0000 2022', 'id': 1517334877661671424, 'id_str': '1517334877661671424', 'text': 'NEED a #JOB?\nSign up now https://t.co/o7lVlsCHXv\nFREE. NO MIDDLEMEN\n#Jobs #AI #DataAnalytics #MachineLearning… https://t.co/E1orP41LFN', 'truncated': True, 'entities': {'hashtags': [{'text': 'JOB', 'indices': [7, 11]}, {'text': 'Jobs', 'indices': [68, 73]}, {'text': 'AI', 'indices': [74, 77]}, {'text': 'DataAnalytics', 'indices': [78, 92]}, {'text': 'MachineLearning', 'indices': [93, 109]}], 'symbols': [], 'user_mentions': [], 'urls': [{'url': 'https://t.co/o7lVlsCHXv', 'expanded_url': 'http://www.jobpreference.com', 'display_url': 'jobpreference.com', 'indices': [25, 48]}, {'url': 'https://t.co/E1orP41LFN', 'expanded_url': 'https://twitter.com/i/web/status/1517334877661671424', 'display_url': 'twitter.com/i/web/status/1…', 'indices': [111, 134]}]}, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'source': '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>', 'in_reply_to_status_id': None, 'in_reply_to_status_id_str': None, 'in_reply_to_user_id': None, 'in_reply_to_user_id_str': None, 'in_reply_to_screen_name': None, 'user': {'id': 1332714745871421443, 'id_str': '1332714745871421443', 'name': 'Job Preference', 'screen_name': 'JobPreference', 'location': '', 'description': "You Don't Need a middleman to find a decent #Job or #Hiring the right #People .\nSign up now for https://t.co/wrZVordoSH\nFREE OF CHARGE", 'url': 'https://t.co/bQv2czzEN6', 'entities': {'url': {'urls': [{'url': 'https://t.co/bQv2czzEN6', 'expanded_url': 'http://www.jobpreference.com', 'display_url': 'jobpreference.com', 'indices': [0, 23]}]}, 'description': {'urls': [{'url': 'https://t.co/wrZVordoSH', 'expanded_url': 'http://jobpreference.com', 'display_url': 'jobpreference.com', 'indices': [96, 119]}]}}, 'protected': False, 'followers_count': 1342, 'friends_count': 604, 'listed_count': 52, 'created_at': 'Sat Nov 28 15:56:01 +0000 2020', 'favourites_count': 11252, 'utc_offset': None, 'time_zone': None, 'geo_enabled': False, 'verified': False, 'statuses_count': 49132, 'lang': None, 'contributors_enabled': False, 'is_translator': False, 'is_translation_enabled': False, 'profile_background_color': 'F5F8FA', 'profile_background_image_url': None, 'profile_background_image_url_https': None, 'profile_background_tile': False, 'profile_image_url': 'http://pbs.twimg.com/profile_images/1426133583824044034/oE8BQ6on_normal.jpg', 'profile_image_url_https': 'https://pbs.twimg.com/profile_images/1426133583824044034/oE8BQ6on_normal.jpg', 'profile_banner_url': 'https://pbs.twimg.com/profile_banners/1332714745871421443/1628851748', 'profile_link_color': '1DA1F2', 'profile_sidebar_border_color': 'C0DEED', 'profile_sidebar_fill_color': 'DDEEF6', 'profile_text_color': '333333', 'profile_use_background_image': True, 'has_extended_profile': False, 'default_profile': True, 'default_profile_image': False, 'following': False, 'follow_request_sent': False, 'notifications': False, 'translator_type': 'none', 'withheld_in_countries': []}, 'geo': None, 'coordinates': None, 'place': None, 'contributors': None, 'is_quote_status': False, 'retweet_count': 23, 'favorite_count': 18, 'favorited': False, 'retweeted': False, 'possibly_sensitive': False, 'lang': 'en'}, 'is_quote_status': False, 'retweet_count': 23, 'favorite_count': 0, 'favorited': False, 'retweeted': False, 'possibly_sensitive': False, 'lang': 'en'}
]           }}}
    
    # create mock post success NOT mock table
    
    # compare mock to actual (demoed out in Colab build)
    mock_analysis = {"Tweet":
        {"Text":"NEED a JOB? Sign up now FREE. NO MIDDLEMEN Jobs AI DataAnalytics MachineLearning Python J\u2026"},
        "Re-Tweet Count":{"0":23},
        "Favorite Count":{"0":0},
        "Subjectivity":{"0":0.8},
        "Polarity":{"0":0.4}}
    
    # convert actual analysis to Decimal for final mocking
    mock_analysis = json.loads(json.dumps(mock_analysis), parse_float=decimal.Decimal)

    
    context = " "
    actual = index.lambda_handler(event, context)
    assert actual == mock_analysis