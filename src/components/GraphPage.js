import React from 'react'
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from './Navbar';

function GraphPage() {
    const navigate = useNavigate()
  return (
    <>
    <Navbar />
        <div className='card'>
            <h1>Search Results</h1>
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