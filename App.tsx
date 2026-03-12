import React from "react";
import "./src/i18n";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import HomeScreen from "./src/screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "./src/i18n";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true)
export default function App() {
  React.useEffect(() => {

    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");

      if (savedLang) {
        i18n.changeLanguage(savedLang);
      }
    };

    loadLanguage();

  }, []);
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    </SafeAreaProvider>

  );
}
