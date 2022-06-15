import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from './Navbar';

function TestHomePage() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [numTweets, setNumTweets] = useState('')
    const [error, setError] = useState(false)
    const [errorQuery, setErrorQuery] = useState(false)
    const isButtonEnabled = query.length > 0 && numTweets.length > 0 && !error && parseInt(numTweets) <= 30;


    //font change for error handling
    function style(error) {
      if (error) {
        return {
          backgroundColor: "rgba(255, 0, 0, 0.5)" 
          // Or any other style you prefer
        };
      }
    }

    const ref = useRef();

    const handleQueryChange = event => {
      setQuery(event.target.value)
    }

    const handleNumTweetsChange = event => {
      const newValueIsValid = !event.target.validity.patternMismatch;
      if (error){
        if (newValueIsValid){
          setError(false)
        }
      }
      setNumTweets(event.target.value)
    }

    //blur for numTweet input
    const handleBlur = (event) => {
      if (!error){
        if (event.target.validity.patternMismatch) {
          ref.current.focus();
          setError(true);
          //clear value of numTweet
          setNumTweets("")
        }
      }    
    };

    //blur for Query input
    const handleQueryBlur = (event) => {
      if (!errorQuery){
        if (query.length < 0) {
          ref.current.focus();
          setErrorQuery(true);
        }
      }    
    };

    const handleSubmit = event =>{


      //need to change the url
      const url = 'https://aijt73z8w9.execute-api.us-east-1.amazonaws.com/v1'
      const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, numTweets })
      };

      fetch(url, payload)
        .then(Response = console.log('Submitted successfully'))
        .catch(error => console.log('Form submit error', error))

      //used to navigate pages
      navigate('/graphPage')
    
      //handle the payload
      console.log(`Twitter Query being processed: \n
              query: ${query} \n
              numTweets: ${numTweets}`)
    }
  return (
    <>
    <Navbar />
    <div className="jumbotron text-center">
      {/* start of create query */}
    <hr className="my-4" />
          <h2 className='display-5'>Create Your Query Here</h2>
          <form onSubmit={handleSubmit}>
            <p className='font-weight-light'>
                Enter your query here. Please keep your query under 500 words or else it can't be processed!
                <br />
                <label className="font-weight-bold">Query </label>
                <br/>
                <input 
                  type="query"
                  name="query"
                  placeholder="Enter your search here..."
                  onBlur={handleQueryBlur}
                  onChange={handleQueryChange}
                  pattern="."
                  ref={ref}
                  style={style(errorQuery)}
                  value={query}
                />
                {/* display error banner */}
                {errorQuery && (<p role="alert" style={{ color: "rgb(255, 0, 0)" }}>Please do not leave query field blank</p>)}
                <p>Please enter a number of Tweets up to 30</p>
                <label className="font-weight-bold"># of Tweets </label>
                <br/>
                <input 
                  type="numTweets"
                  name="numTweets"
                  inputMode="decimal"
                  placeholder="Enter # of Tweets here..."
                  onBlur={handleBlur}
                  onChange={handleNumTweetsChange}
                  pattern="[-]?[0-9]*[.,]?[0-9]+" //regex for input validation
                  ref={ref}
                  style={style(error)}
                  value={numTweets}
                />
                {/* display error banner */}
                {error && (<p role="alert" style={{ color: "rgb(255, 0, 0)" }}>Please make sure you've entered a <em>number</em> between 1 and 30</p>)}
                <br />
                <br />
                <button className='btn btn-success font-weight-bold' disabled={!isButtonEnabled} onClick={() => handleSubmit()}
                        >Start Search
                </button>
            </p>
          </form> 
          {/* end of create query */}
    <div id="accordion">
      <div className="card">
        <div className="card-header" id="headingOne">
          <h5 className="mb-0">
            <button className="btn btn-outline-info btn-lg btn-block" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
              How Does it Work?
            </button>
          </h5>
        </div>
        <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
          <div className="card-body">
            <p className="lead">
                Welcome to Poll the Room! Please enter the Twitter query you would like sentiment analysis on. 
                If you have multiple queries or hashtags you would like to research, please separate them with a 
                comma. 
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>  
    </>  
  )
}

export default TestHomePage