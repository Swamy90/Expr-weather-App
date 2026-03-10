import React from "react";
import { FlatList, View, Text, StyleSheet, Image } from "react-native";
import dayjs from "dayjs";
import "dayjs/locale/hi";
import { useTranslation } from "react-i18next";

export default function ForecastList({ data }: any) {
  const { i18n } = useTranslation();
  dayjs.locale(i18n.language);
  const renderItem = ({ item }: any) => {


    const day = dayjs(item.dt_txt).format("ddd");
    const icon = item.weather[0].icon;

    return (
      <View style={styles.card}>

        <Text style={styles.day}>
          {day}
        </Text>

        <Image
          style={styles.icon}
          source={{
            uri: `https://openweathermap.org/img/wn/${icon}@2x.png`
          }}
        />

        <Text style={styles.temp}>
          {Math.round(item.main.temp)}°
        </Text>

      </View>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}
    />
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    paddingTop: 5,
    borderRadius: 15,
    alignItems: "center",
    marginRight: 15,
    width: 80,

  },

  day: {
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  
  },

  icon: {
    width: 20,
    height: 20
  },

  temp: {
    color: "#000",
    fontSize: 14,
    textAlign: "center"
  }

});