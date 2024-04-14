import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Country.css"; 

function Country() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const country = location.pathname.substring(1); 
    const apiKey = "00706eaf39324bc4b26232705241104";
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
      country
    )}&aqi=no`;

    axios
      .get(apiUrl)
      .then((response) => {
        setWeatherData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [location.pathname]);

  return (
    <div className="country-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : weatherData ? (
        <div className="weather-info">
          <h2 className="location">
            {weatherData.location.name}, {weatherData.location.country}
          </h2>
          <div className="temperature">
            Temperature: {weatherData.current.temp_c}°C
          </div>
          <div className="weather">
            Weather: {weatherData.current.condition.text}
          </div>
          <div className="humidity">
            Humidity: {weatherData.current.humidity}%
          </div>
          <div className="wind-speed">
            Wind Speed: {weatherData.current.wind_kph} km/h
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Country;
