import React, { Component } from 'react';



export class Homepage extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         query: '',
         numTweets: '',
         message: ''
      }
    }

    //sets the query when the state changes 
    handleQueryEntry = event => {
      this.setState({
        query: event.target.value
      })
    }

    //sets the numTweets when the state changes
    handleNumTweetsChange = event => {
      this.setState({
        numTweets: event.target.value
      })
    }

        //sets the numTweets when the state changes
    handleMessage = event => {
      this.setState({
        message: event.target.value
      })
    }

    handleSubmitPayload = async (e) => {
      alert(`for testing. The query is ${this.state.query} and the number of tweets is ${this.state.numTweets}`)
      e.preventDefault();
      try {
        let res = await fetch("http://localhost:4566", {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            query: this.state.query,
            numTweets: this.state.numTweets
          }),
        });
        let resJson = await res.json();
        if (res.status === 200) {
          this.handleNumTweetsChange();
          this.handleQueryEntry();
          this.handleMessage("Payload Created Successfully");
        } else {
          this.handleMessage("Some error occured");
        }
      } catch (err) {
        console.log(err);
      }
    };
  render() {
      const { query, numTweets } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
          <h1>Poll The Room</h1>
          <p>
            Welcome to Poll the Room! Find out what people are saying about a subject or hashtag on Twitter.
          </p>
          <div>
          <p>
            Enter your query below. Please keep your query under 500 words or else we can't process it!
          </p>
              <label>Twitter Query: </label>
              <input
              type='text'
              value={query}
              onChange={this.handleQueryEntry} />
          </div>
          <p>
              Please enter a number of tweets up to 5000
          </p>
          <div>
              <label>Number of Tweets: </label>
              <input 
              type='text'
              value={numTweets}
              onChange={this.handleNumTweetsChange}/>
          </div>
          <button 
            type='submit'
            title="send payload and load GraphPage"
            onClick={() =>{
              this.handleSubmitPayload();
              this.props.navigation.navigate("GraphPage")
            }}>
              Start Search
          </button>

      </form>
    )
  }
}

export default Homepage