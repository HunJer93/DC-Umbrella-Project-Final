import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import './index.css';
import App from './App';
import TestHomePage from './components/TestHomePage';
import GraphPage from './components/GraphPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
        <Route path="homepage" element={<TestHomePage />} />
        <Route path="graphPage" element={<GraphPage />} />
        <Route
        index
        element={<App /> } />
        <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>Oops! Something went wrong. There's nothing here!</p>
        </main>
      }
    />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
