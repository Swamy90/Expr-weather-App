import React from "react";
import SkeletonContent from "react-native-skeleton-content";
import { View } from "react-native";

export default function WeatherSkeleton() {
  return (
    <View style={{ padding: 20 }}>
      <SkeletonContent
        containerStyle={{ flex: 1 }}
        isLoading={true}
        layout={[
          { key: "city", width: 200, height: 30, marginBottom: 20 },
          { key: "icon", width: 120, height: 120, alignSelf: "center", marginBottom: 20 },
          { key: "temp", width: 150, height: 60, alignSelf: "center", marginBottom: 20 },
          { key: "forecast", width: "100%", height: 80 }
        ]}
      />
    </View>
  );
}