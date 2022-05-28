import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../App.css";
import Navbar from './Navbar';

function GraphPage() {
    //change these to sentiment payload values below
    const [totalReactPackages, setTotalReactPackages] = useState(null);
    //uncomment these when ready to use AWS and values

    // const [payloadText, setPayloadText] = useState(null);
    // const [payloadRetweetCount, setPayloadRetweetCount] = useState(null);
    // const [payloadFavoriteCount, setPayloadFavoriteCount] = useState(null);
    // const [payloadSubjectivity, setPayloadSubjectivity] = useState(null);
    // const [payloadPolarity, setPayloadPolarity] = useState(null);
    // const [payloadAnalysis, setPayloadAnalysis] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        //will need to change the address to database API Gateway address
        fetch('https://api.npms.io/v2/search?q=react')
            .then(async response => {
                const data = await response.json()

                //check for http response error
                if (!response.ok){
                    //get error message from body or default to response statusText
                    //Promise.reject defaults to catch block
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }

                //setTotalReactPackages if data is valid (might need to change for API Gateway)
                setTotalReactPackages(data.total);
                
                //uncomment these when ready for AWS API Gateway payload
                // setPayloadText(data.text);
                // setPayloadRetweetCount(data.retweetCount);
                // setPayloadFavoriteCount(data.favoriteCount);
                // setPayloadSubjectivity(data.subjectivity);
                // setPayloadPolarity(data.polarity);
                // setPayloadAnalysis(data.analysis);
            })
            //catches network error
            .catch(error =>{
                setErrorMessage(error.toString());
                console.error('There was an error!', error);
            });
    
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);
  return (
    <>
    <Navbar />
        <div className='card'>
            <h1>Search Results</h1>
            <div>Total react packages {totalReactPackages}</div>
            <ul className="list-group list-group-flush">
                <li className='list-group-item'>
                    Sentiment Analysis
                </li>
                <li className='list-group-item'>
                    Sentiment with Retweet Weight
                </li>
                <li className='list-group-item'>
                    Wordcloud
                </li>
            </ul>
        </div>
        <button className="btn btn-success" onClick={() => navigate('/')}>
            Return Home
        </button> |{" "}
        <button className="btn btn-success" onClick={() => navigate('/homepage')}>
            Start Another Query
        </button>
    </>
  )
}

export default GraphPage