import axios from "axios";

const API_KEY = "9ba5e10c43e5353ff57b7e9470d2f1c8";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeatherByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });
  return response.data;
};

export const searchCities = async (query: string) => {

  const response = await axios.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY
      }
    }
  );

  return response.data;
};

export const fetchForecastByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
};

export const fetchForecast = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
};

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });

  return response.data;
};