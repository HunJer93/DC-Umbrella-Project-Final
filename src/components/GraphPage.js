import { useNavigate, useParams, useSearchParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../App.css";
import Navbar from './Navbar';
import Chart from "react-apexcharts";

function GraphPage() {
 
  const [searchParams, setSearchParams] = useSearchParams()
  const [userQueryId, setUserQueryId] = useState(searchParams.get('userQueryId'));


  //change these to sentiment payload values below
  const [positiveSentiment, setPositiveSentiment] = useState([]);
  const [negativeSentiment, setNegativeSentiment] = useState([]);
  const [neutralSentiment, setNeutralSentiment] = useState([]);
  const [totalTweets, setTotalTweets] = useState([]);

  const [sentimentChart, setSentimentChart] = useState();
  const [weightedSentimentChart, setWeightedSentimentChart] = useState();
  

  const [errorMessage, setErrorMessage] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate()

    useEffect(() =>{
      setWeightedSentimentChart({
        series: [calculateSentiment(positiveSentiment), calculateSentiment(negativeSentiment), calculateSentiment(neutralSentiment)],
        options: {
          colors:[ "#0fc2f5", "#f72014", "#c7cdcf"],
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Positive', 'Negative', 'Neutral'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }})

        setSentimentChart({
          options: {
              colors:[ "#0fc2f5", "#f72014", "#c7cdcf"],
              chart: {
                id: "sentiment-analysis-graph"
              },
              xaxis: {
                categories: ["Total Sentiment"]
              }
            },
            series: [
              {
                name: "Positive Sentiment",
                data: [positiveSentiment.length]
              },
              {
                  name: "Negative Sentiment",
                  data: [negativeSentiment.length]
              },
              {
                  name: "Neutral Sentiment",
                  data: [neutralSentiment.length]
              }
            ]
          })
       }, [positiveSentiment, negativeSentiment, neutralSentiment]);

    // get query info from DB and update the graphs with the query info
    useEffect(() => {
      if(!userQueryId){
        return
      }
        // GET request using fetch inside useEffect React hook
        //setTimeout used to allow time for AWS to process the query
      setTimeout(() => {fetch(`https://aijt73z8w9.execute-api.us-east-1.amazonaws.com/v1/${userQueryId}`)
            .then(async response => {
                const data = await response.json()

                //check for http response error
                if (!response.ok){
                    //get error message from body or default to response statusText
                    //Promise.reject defaults to catch block
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }

                const count = data.Count

                // unpack each Item in data
                for(let i = 0; i < count; i++){

                  //drill down for item values
                  let sentiment = data.Items[i].Analysis.M.S.S
                  let subjectivity = parseInt(data.Items[i].Subjectivity.M.N.S) 
                  let favoriteCount = parseInt(data.Items[i].Favorite_Count.M.N.S)
                  let polarity = parseInt(data.Items[i].Polarity.M.N.S)
                  let retweetCount = parseInt(data.Items[i].Re_Tweet_Count.M.N.S)
                  let text = data.Items[i].Text.M.S.S

                  //create map for item
                  let item = {}
                  item["sentiment"] = sentiment;
                  item["subjectivity"] = subjectivity;
                  item["favoriteCount"] = favoriteCount;
                  item["polarity"] = polarity;
                  item['retweetCount'] = retweetCount;
                  item['text'] = text

                  // load total tweets
                  setTotalTweets(prevTotalTweets => [...prevTotalTweets, item]);
                  //check the sentiment and load arrays
                  if(sentiment === 'Positive'){
                    setPositiveSentiment(prevPositiveSentiment => [...prevPositiveSentiment, item])
                  } else if(sentiment === 'Negative'){
                    setNegativeSentiment(prevNegativeSentiment => [...prevNegativeSentiment, item])
                  } else{
                    setNeutralSentiment(prevNeutralSentiment =>[...prevNeutralSentiment, item])
                  }
                }
              // update graphs
              setWeightedSentimentChart({
                series: [calculateSentiment(positiveSentiment), calculateSentiment(negativeSentiment), calculateSentiment(neutralSentiment)],
                options: {
                  colors:[ "#0fc2f5", "#f72014", "#c7cdcf"],
                  chart: {
                    width: 380,
                    type: 'pie',
                  },
                  labels: ['Positive', 'Negative', 'Neutral'],
                  responsive: [{
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200
                      },
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }]
                }})

                setSentimentChart({
                  options: {
                      colors:[ "#0fc2f5", "#f72014", "#c7cdcf"],
                      chart: {
                        id: "sentiment-analysis-graph"
                      },
                      xaxis: {
                        categories: ["Total Sentiment"]
                      }
                    },
                    series: [
                      {
                        name: "Positive Sentiment",
                        data: [positiveSentiment.length]
                      },
                      {
                          name: "Negative Sentiment",
                          data: [negativeSentiment.length]
                      },
                      {
                          name: "Neutral Sentiment",
                          data: [neutralSentiment.length]
                      }
                    ]
                  })
                    // set the page loading to false
                    setPageLoading(false);})
            //catches network error
            .catch(error =>{
                setErrorMessage(error.toString());
                console.error('There was an error!', error);
            }); }, 7000);

    
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, [userQueryId]);

    function calculateSentiment(sentimentArray){
      let total = 0;
      if(sentimentArray.length > 0){
        for(let i=0; i < sentimentArray.length; i++){
          total +=  sentimentArray[i].retweetCount
        }
      }

      return total
    }

    function WhatPeopleSaid(props){
      const sentiment = props.sentiment      
      const items = sentiment.map((item, index) =>
      <div key={index} className="container">
        <p className="list-group row text-primary">{item.text}</p>
        <br/>
            <div className="row">
              <li className="list-group-item col">Favorite Count: {item.favoriteCount}</li>
              <li className="list-group-item col">Re-Tweet Count: {item.retweetCount}</li>
            </div>
            <div className="row">
              <li className="list-group-item col">Subjectivity: {item.subjectivity}</li>
              <li className="list-group-item col">Polarity: {item.polarity}</li>
            </div>
            <br/>
      </div>);
      return <ul>{items}</ul>

    }

  return (
    <>
    <Navbar />
    {pageLoading && <div>
      <img src={require('../images/Poll_Logo.gif')} width={400} height={400} />
      <h1>Loading, please wait...</h1>
      </div>}
        {!pageLoading && <div>
          <h1>Search Results</h1>
        <ul className="list-group list-group-flush">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-row">
            <li className='list-group-item p-2'>
                <div className="col-4" >
                <h3>Sentiment Analysis</h3>
                  { sentimentChart && <Chart
                        options={sentimentChart.options}
                        series={sentimentChart.series}
                        type="bar"
                        width="500"
                    />}
                </div>
            </li>
            <li className='list-group-item p-2'>
                <div className="col-4">
                <h3 className="">Weighted Sentiment Analysis</h3>
                    { weightedSentimentChart && <Chart
                        options={weightedSentimentChart.options}
                        series={weightedSentimentChart.series}
                        type="pie"
                        width="500"
                    />}
                </div>
            </li>
            </div>
          </div>
        </ul>    
        <button className="btn btn-success" onClick={() => navigate('/')}>
            Return Home
        </button> |{" "}
        <button className="btn btn-success" onClick={() => navigate('/homepage')}>
            Start Another Query
        </button>      
          <div className="container">
            <br/>
            <h3>What People Said</h3>
            <br />
            <div>
            <h2 className="text-success">Positive Sentiment</h2>
              <div className="col">
                <WhatPeopleSaid sentiment={positiveSentiment} /> 
              </div>
              <h2 className="text-danger">Negative Sentiment</h2>
              <div className="list-group-item d-flex justify-content-center">
                <WhatPeopleSaid sentiment={negativeSentiment} /> 
              </div>
              <h2 className="text-secondary">Neutral Sentiment</h2>
              <div className="list-group-item d-flex justify-content-center">
                <WhatPeopleSaid sentiment={neutralSentiment} /> 
              </div>
            </div>

          </div>
        </div>}
        </>
  )
}

export default GraphPage