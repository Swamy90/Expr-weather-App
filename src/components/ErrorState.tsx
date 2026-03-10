import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useTranslation } from "react-i18next";


export default function ErrorState({ message, retry }: any) {
  const { t } = useTranslation();
  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
      {t("Oh_no")}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
        <Text style={styles.buttonText}>{t("enable_location")}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    marginTop: 60
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "white"
  },

  message: {
    marginTop: 10,
    color: "white",
    textAlign: "center"
  },

  button: {
    marginTop: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },

  buttonText: {
    fontWeight: "600"
  },

  settingsButton: {
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 8,
    marginTop: 50,
    width: 160,
    alignItems: "center"
  },

});