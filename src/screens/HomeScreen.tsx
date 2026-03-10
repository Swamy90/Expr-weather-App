import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  AppState,
  Pressable,
  ActivityIndicator,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setWeather, setForecast, setError } from "../features/weather/weatherSlice";
import { fetchWeatherByCity, fetchForecast, fetchForecastByCoords, searchCities, fetchWeatherByCoords } from "../api/weatherApi";
import { getCurrentLocation } from "../hooks/useLocation";

import ForecastList from "../components/ForecastList";
import SearchBar from "../components/SearchBar";
import WeatherSkeleton from "../components/WeatherSkeleton";
import ErrorState from "../components/ErrorState";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import "dayjs/locale/hi";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { weather, forecast, error } = useSelector(
    (state: RootState) => state.weather
  );
  const [clearSearch, setClearSearch] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [locationAllowed, setLocationAllowed] = React.useState(true);
  const [showLangDropdown, setShowLangDropdown] = React.useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    loadWeatherFromLocation();
  }, []);

  useEffect(() => {

    const subscription = AppState.addEventListener("change", state => {

      if (state === "active" && error) {
        loadWeatherFromLocation();
      }

    });

    return () => subscription.remove();

  }, [error]);

  useEffect(() => {
    if (clearSearch) {
      setClearSearch(false);
    }
  }, [clearSearch]);

  const handleRefresh = () => {
    setSuggestions([]);
    loadWeatherFromLocation();
  };

  const loadWeatherFromLocation = async () => {

    try {
      setLoading(true);
      dispatch(setError(null));
      setClearSearch(true);

      const location = await getCurrentLocation();

      if (!location) {
        throw new Error("LOCATION_UNAVAILABLE");
      }

      const weatherData = await fetchWeatherByCoords(
        location.latitude,
        location.longitude
      );

      dispatch(setWeather(weatherData));

      const forecastData = await fetchForecastByCoords(
        location.latitude,
        location.longitude
      );

      const dailyForecast = forecastData.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      dispatch(setForecast(dailyForecast.slice(0, 5)));
      setLoading(false);
    } catch (error: any) {

      setLoading(false);
      if (error.message === "PERMISSION_DENIED") {
        dispatch(setError(t("location_permission_denied_permanently")));
      }

      else if (error.message === "OPEN_SETTINGS") {

       dispatch(setError(t("location_permission_denied_permanently")));

        Linking.openSettings();
      }

      else if (error.message === "LOCATION_UNAVAILABLE") {
        dispatch(setError("Location unavailable. Please enable GPS."));
      }

      else {
        dispatch(setError("Unable to fetch weather data"));
      }

    }

  };


  const handleCityInput = async (city: string) => {

    if (!locationAllowed) {
      dispatch(setError("Please enable location permission to search weather!"));
      return;
    }

    if (!city) {
      setSuggestions([]);
      return;
    }

    try {

      const cities = await searchCities(city);
      setSuggestions(cities);

    } catch {
      setSuggestions([]);
    }

  };

  const handleCitySelect = async (city: any) => {

    try {

      setSuggestions([]);
      dispatch(setError(null));

      const weatherData = await fetchWeatherByCoords(city.lat, city.lon);

      dispatch(setWeather(weatherData));

      const forecastData = await fetchForecastByCoords(city.lat, city.lon);

      const dailyForecast = forecastData.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      dispatch(setForecast(dailyForecast.slice(0, 5)));

    } catch {

      dispatch(setError("Unable to fetch city weather"));

    }

  };

  return (

    <Pressable
      style={{ flex: 1 }}
      onPress={() => setShowLangDropdown(false)}
    >

      {loading ?
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" color="skyblue" />
        </View>

        : <SafeAreaView style={{ flex: 1 }}>
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={[
              styles.container,
              { paddingTop: Platform.OS === 'android' ? insets.top - 20 : insets.top }
            ]}
          >

            <View style={styles.languageContainer}>

              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setShowLangDropdown(!showLangDropdown)}
              >
                <Text style={styles.languageText}>
                  {i18n.language === "en" ? "English " : "हिंदी "}
                </Text>
              </TouchableOpacity>

              {showLangDropdown && (
                <View style={styles.dropdown}>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await AsyncStorage.setItem("appLanguage", "en");
                      i18n.changeLanguage("en");
                      setShowLangDropdown(false);
                    }}
                  >
                    <Text>English</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await AsyncStorage.setItem("appLanguage", "hi");
                      i18n.changeLanguage("hi");
                      setShowLangDropdown(false);
                    }}
                  >
                    <Text>हिंदी</Text>
                  </TouchableOpacity>

                </View>
              )}

            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
            >
              <SearchBar
                onSearch={handleCityInput}
                onSelectCity={handleCitySelect}
                clearTrigger={clearSearch}
              />

              {error && (
                <ErrorState
                  message={error}
                />
              )}


              {weather && !loading && (
                <View style={styles.hero}>

                  <Text style={styles.city}>
                    {weather.name}
                  </Text>

                  <Text style={styles.date}>
                    {dayjs().locale(i18n.language).format("dddd, MMM D")}
                  </Text>

                  <Image
                    style={styles.icon}
                    source={{
                      uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
                    }}
                  />

                  <Text style={styles.temp}>
                    {Math.round(weather.main.temp)}°
                  </Text>

                  <Text style={styles.condition}>
                    {weather.weather[0].description}
                  </Text>

                  <View style={styles.stats}>

                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>
                        {weather.main.humidity}%
                      </Text>
                      <Text style={styles.statLabel}>
                        {t("humidity")}
                      </Text>
                    </View>

                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>
                        {weather.wind.speed}
                      </Text>
                      <Text style={styles.statLabel}>
                        {t("wind")}
                      </Text>
                    </View>

                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>
                        {weather.main.pressure}
                      </Text>
                      <Text style={styles.statLabel}>
                        {t("pressure")}
                      </Text>
                    </View>

                  </View>

                </View>
              )}



              {forecast.length > 0 && (
                <ForecastList data={forecast} />
              )}

              {weather && !loading && <TouchableOpacity
                style={styles.refresh}
                onPress={handleRefresh}
              >
                <Text style={styles.refreshText}>
                  <Text>{t("refresh")}</Text>
                </Text>
              </TouchableOpacity>}

            </ScrollView>
          </LinearGradient>
        </SafeAreaView>}
    </Pressable>




  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20
  },

  hero: {
    alignItems: "center",
    marginTop: 20
  },

  city: {
    fontSize: 34,
    color: "white",
    fontWeight: "600"
  },

  date: {
    color: "white",
    marginBottom: 10
  },

  icon: {
    width: 120,
    height: 120
  },

  temp: {
    fontSize: 90,
    color: "white",
    fontWeight: "200"
  },

  condition: {
    fontSize: 20,
    color: "white",
    textTransform: "capitalize"
  },

  stats: {
    flexDirection: "row",
    marginTop: 30
  },

  statBox: {
    alignItems: "center",
    marginHorizontal: 20
  },

  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "600"
  },

  statLabel: {
    color: "white",
    opacity: 0.8
  },

  refresh: {
    marginTop: 40,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10
  },

  refreshText: {
    fontWeight: "600"
  },
  errorBox: {
    backgroundColor: "rgba(255,0,0,0.3)",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  errorText: {
    color: "white",
    textAlign: "center",
  },
  languageContainer: {
    alignItems: "flex-end",
    position: "relative",
    zIndex: 999
  },

  languageButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },

  languageText: {
    color: "white",
    fontWeight: "600"
  },

  dropdown: {
    position: "absolute",
    top: 35,
    right: 0,
    width: 120,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 6,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center"
  }
});