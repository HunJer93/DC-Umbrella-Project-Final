import React from 'react';
import { Outlet,Link, useNavigate } from "react-router-dom";
import './App.css';
import Homepage from './components/TestHomePage';
import GraphPage from './components/GraphPage';
import Navbar from './components/Navbar';
import TestHomePage from './components/TestHomePage';

function App() {
  const navigate = useNavigate()
  return (
    <div>
      <Navbar />
      <div>
        <img src={require('./images/Poll_Logo.gif')} width={400} height={400} />
      </div>
      <br/>
      <button className="btn btn-success" onClick={() => navigate('/homepage')}>
            Start A Query
      </button>
    </div>
  );
}

export default App;
