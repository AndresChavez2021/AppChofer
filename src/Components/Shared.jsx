import React from "react";
import { ActivityIndicator, View,StyleSheet } from "react-native";
import { Text } from "react-native-elements";


export const ErrorText = ({ error }) => {
  return <Text style={styles.errorText}>{error}</Text>;
};

export const ActivityLoader=()=>{
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center",position:"absolute"}}>
      <ActivityIndicator color="#f29866" size="large"/>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    marginBottom: 8,
    color:"#dd3333",
    // fontFamily: "$400Regular",
    fontSize: 15,
  },
});
