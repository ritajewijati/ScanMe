import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,Linking,TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarCodeComp from "./components/barCodeComp";
import CameraComp from "./components/cameraCom";
import ImagePickerExample from "./components/ImagePickerExample";

export default function App() {
  const [flag, setFlag] = useState(true);
  
  const switchToBarCode = () => { 
    console.log("switch to barCode");
    setFlag(false); 
  };
  const switchToCameraCode = () => { 
    console.log("camera app");
    setFlag(true); 
  }
  // Return the View
  return (
    <View style={styles.container}>
      {flag? <CameraComp switchToBarCode={switchToBarCode}  /> : <ImagePickerExample switchToCameraCode={switchToCameraCode}/>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#fff'
  }, btn : {
    marginBottom : 20,
  }
});


