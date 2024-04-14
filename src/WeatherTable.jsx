import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import countries from "./Countries";
import "./WeatherTable.css";
import { Link } from "react-router-dom";

const WeatherTable = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const containerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const remainingCountries = countries.slice(0, loadedCount);
        const weatherDataPromises = remainingCountries.map((country) =>
          axios.get(
            `http://api.weatherapi.com/v1/current.json?key=00706eaf39324bc4b26232705241104&q=${encodeURIComponent(
              country
            )}&aqi=no`
          )
        );
        const responses = await Promise.all(weatherDataPromises);
        const newData = responses.map((response) => ({
          location: response.data?.location,
          current: response.data?.current,
        }));
        setCountriesData(newData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [loadedCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollHeight - containerRef.current.scrollTop ===
          containerRef.current.clientHeight
      ) {
        if (!loading) {
          setLoadedCount((prevCount) => prevCount + 20);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const queryCountries = countries.filter((country) =>
          country.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        const weatherDataPromises = queryCountries.map((country) =>
          axios.get(
            `http://api.weatherapi.com/v1/current.json?key=00706eaf39324bc4b26232705241104&q=${encodeURIComponent(
              country
            )}&aqi=no`
          )
        );
        const responses = await Promise.all(weatherDataPromises);
        const newData = responses.map((response) => ({
          location: response.data?.location,
          current: response.data?.current,
        }));
        setCountriesData(newData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery]);

  const handleChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filteredCountries = countries.filter((country) =>
      country.toLowerCase().startsWith(query.toLowerCase())
    );
    setSuggestions(filteredCountries);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = () => {
    if (!sortColumn) return countriesData;

    return countriesData.slice().sort((a, b) => {
      const columnA = getColumnValue(a, sortColumn);
      const columnB = getColumnValue(b, sortColumn);

      if (sortDirection === "asc") {
        if (columnA < columnB) return -1;
        if (columnA > columnB) return 1;
        return 0;
      } else {
        if (columnA < columnB) return 1;
        if (columnA > columnB) return -1;
        return 0;
      }
    });
  };

  const getColumnValue = (item, column) => {
    switch (column) {
      case "country":
        return item.location.country;
      case "temp_c":
        return item.current.temp_c;
      case "text":
        return item.current.condition.text;
      case "humidity":
        return item.current.humidity;
      default:
        return null;
    }
  };


  return (
    <>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchQuery}
        onChange={handleChange}
        list="countryList"
      />
      <datalist id="countryList">
        {suggestions.map((country, index) => (
          <option key={index} value={country} />
        ))}
      </datalist>

      <div ref={containerRef} style={{ overflowY: "scroll", height: "90vh" }}>
        <table>
          <thead>
            <tr>
              <th style={{cursor:"default"}}>Sr. No.</th>
              <th onClick={() => handleSort("country")}>Country Name</th>
              <th onClick={() => handleSort("temp_c")}>
                Temperature (°C)
              </th>
              <th onClick={() => handleSort("text")}>
                Weather
              </th>
              <th onClick={() => handleSort("humidity")}>Humidity</th>
            </tr>
          </thead>
          <tbody>
            {sortedData().map((countryData, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <Link to={"/" + countryData.location?.country}>
                    {countryData.location?.country}
                  </Link>
                </td>
                <td>{countryData.current?.temp_c}</td>
                <td>{countryData.current?.condition?.text}</td>
                <td>{countryData.current?.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default WeatherTable;
