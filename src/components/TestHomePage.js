import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from './Navbar';

function TestHomePage() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [numTweets, setNumTweets] = useState('')

    const handleQueryChange = event => {
      setQuery(event.target.value)
    }

    const handleNumTweetsChange = event => {
      setNumTweets(event.target.value)
    }

    const handleSubmit = event =>{


      //need to change the url
      const url = 'localhost:3000/filler'
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
      alert(`Your state values: \n
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
                  onChange={handleQueryChange}
                  value={query}
                />
                <p>Please enter a number of Tweets up to 5000</p>
                <label className="font-weight-bold"># of Tweets </label>
                <br/>
                <input 
                  type="numTweets"
                  name="numTweets"
                  placeholder="Enter # of Tweets here..."
                  onChange={handleNumTweetsChange}
                  value={numTweets}
                />
                <br />
                <br />
                <button className='btn btn-success font-weight-bold' onClick={() => handleSubmit()}
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