import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";
import { searchCities } from "../api/weatherApi";
import { useTranslation } from "react-i18next";

export default function SearchBar({ onSearch, onSelectCity, clearTrigger }: any) {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (text: string) => {
    setCity(text);

    if (text.length > 2) {
      const cities = await searchCities(text);
      setSuggestions(cities);
    } else {
      setSuggestions([]);
    }
  };

  React.useEffect(() => {
    if (clearTrigger) {
      setCity("");
    }
  }, [clearTrigger]);

  return (
    <>

      <View style={styles.container}>
        <TextInput
          value={city}
          placeholder={t("search_city")}
          placeholderTextColor="#999"
          onChangeText={handleChange}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}

          onPress={() => onSearch(city)}
        >
          <Text style={styles.buttonText}>{t("search_txt")}</Text>
        </TouchableOpacity>


      </View>
      {
        suggestions.map((item: any) => (
          <TouchableOpacity style={styles.suggestionList}
            key={item.lat}
            onPress={() => {
              setCity(item.name);
              setSuggestions([]);
              onSelectCity(item);  
            }}
          >
            <Text style={{ color: "#000", fontSize: 12, padding: 5 }}>
              {item.name}, {item.country}
            </Text>
          </TouchableOpacity>
        ))
      }
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexWrap: 'wrap'
    // zIndex: 100
  },
  container: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20
  },

  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginRight: 10
  },

  button: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10
  },

  buttonText: {
    color: "white",
    fontWeight: "600"
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200
  },

  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  itemText: {
    fontSize: 16
  },
  suggestionList: {
    backgroundColor: '#fff',

  }

});