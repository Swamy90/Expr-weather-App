// import * as Location from "expo-location";

// export const getCurrentLocation = async () => {

//   const { status } = await Location.requestForegroundPermissionsAsync();

//   if (status !== "granted") {
//     throw new Error("permission denied");
//   }

//   const enabled = await Location.hasServicesEnabledAsync();

//   if (!enabled) {
//     throw new Error("Location unavailable");
//   }

//   const location = await Location.getCurrentPositionAsync({
//     accuracy: Location.Accuracy.Balanced,
//   });

//   return {
//     latitude: location.coords.latitude,
//     longitude: location.coords.longitude,
//   };
// };


import * as Location from "expo-location";

export const getCurrentLocation = async () => {

  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("PERMISSION_DENIED");
  }

  let location = await Location.getLastKnownPositionAsync();

  if (!location) {
    location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 10000
    });
  }

  if (!location) {
    throw new Error("LOCATION_UNAVAILABLE");
  }

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };

};