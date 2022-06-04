import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions,Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { MaterialIcons,Ionicons,Entypo,FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import RNImageToPdf from 'react-native-image-to-pdf';
import SavePDF from './SavePDF';

const { height, width } = Dimensions.get('window');


export default function CameraComp({switchToBarCode}) {

  const [hasPermission, setHasPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasgalleryPermission, setHasgalleryPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [recording, setRecording] = useState(false);

  const ref = useRef(null)

  const flipOnclick = () => {
    !recording && setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front: Camera.Constants.Type.back);
  }

  const record = async () => {
      try{
        if( hasAudioPermission == true ){
          console.log("recording clicked",recording)
          if(!recording){
            setRecording(true);
            const video = await ref.current.recordAsync();
            console.log(video.uri); 
            const save=await MediaLibrary.createAssetAsync(video.uri);
            console.log("video recorded",recording);
          }else{
            //console.log("stopvideo recording",recording);
            ref.current.stopRecording();
            setRecording(false);

            //setCapturedVideo(video)
            //console.log("stopvideo recording",recording);  
          }
        }
      }catch(err){
         console.log(err);
      } 
      
  }

  const takePhoto = async () => {
    try{
      if(!ref.current || recording){
        console.log("break or recording");
        return;
      }
      let photo = await ref.current.takePictureAsync({skipProcessing: false});
      if (type === Camera.Constants.Type.front) {
        console.log("front camera capturing")
        photo = await manipulateAsync(
            photo.localUri || photo.uri,
            [
                { rotate: 180 },
                { flip: FlipType.Vertical},
              
            ],
            { format: SaveFormat.JPEG }
        );
      }
      setPreviewVisible(true);
      setCapturedImage(photo);
      console.log("taken photo");
    }catch(err){
      console.log("err front camera",err.message)
    }
    
 }
 const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  console.log(result);

  if (!result.cancelled) {
    setCapturedImage(result.uri);
  }
};

 const CameraPreview = ({photo}) => {
  //console.log('photo taken');
  return (
    <View style={styles.cameraPrev}>
      <Image source={{uri: photo && photo.uri}} style={styles.image }/>
      <View style={styles.btnAlign}>
          <TouchableOpacity  onPress={discardImage}>
              <MaterialIcons name="delete" size={50} color="black" />          
          </TouchableOpacity>
          <TouchableOpacity  onPress={saveImage}>
              <Ionicons name="save" size={50} color="black" />
          </TouchableOpacity>

      </View>
    </View>
  )
}

 const discardImage = () => {
  console.log("discard")
  setPreviewVisible(false);
  setCapturedImage(null);  

 }

 const ChooseImage = () => {
  console.log("Choosing")
  //setPreviewVisible(false);
  //setCapturedImage(null);
  pickImage()
  console.log("Picked")
  myAsyncPDFFunction()
 }

 const myAsyncPDFFunction = async () => {
  try { 
    const result = await RNImageToPdf.convertSingle(capturedImage);
    console.log(result);
     const options = {
          imagePaths: 'Phone/DCIM/3fb1f679-2af0-436e-8e8b-ef3967aa234f.jpg',
          name: 'PDFName',
          // maxSize: { // optional maximum image dimension - larger images will be resized
          //     width: 900,
          //     height: Math.round(deviceHeight() / deviceWidth() * 900),
          // },
          quality: .7, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      console.log("pdf created");
      //console.log(pdf.filePath);
  } catch(e) {
      console.log(e);
  }
}

 const saveImage = async () => {
  try{
    if( hasgalleryPermission ){
      const asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
      console.log("saved");
      setPreviewVisible(false);
      setCapturedImage(null); 
    }
  }catch(err){
    console.log("err save",err.message)
  }
 
 }

  useEffect(() => {
    (async () => {
      try{
      const { status } = await Camera.requestCameraPermissionsAsync();
      const microphone = await Camera.requestMicrophonePermissionsAsync();
      const appGalleryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      setHasAudioPermission(microphone.status === 'granted');
      setHasgalleryPermission(appGalleryPermission.status === 'granted')
    
    }catch(err){
      console.log("use error",err.message);
    }
    })();
  }, []);



  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera and adjust your phone settings</Text>;
  }
  return (
    <View style={styles.container}>
      {previewVisible? <CameraPreview photo={capturedImage} />
      :<Camera style={styles.camera} type={type} ref={ref}  ratio={"16:9"}>
        <View> 
            <View style={styles.iconsAlign}>
              <TouchableOpacity  onPress={flipOnclick}>
                  <MaterialIcons name="flip-camera-ios" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto}>
                  <Entypo name="camera" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity  onPress={ChooseImage}>
              <Feather name="upload" size={50} color="black" />
            </TouchableOpacity>
              <TouchableOpacity onPress={record} >
                  <Entypo name={!recording?"video-camera":"controller-stop"} size={50} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.scannerPos}>
              <TouchableOpacity  onPress={() => {switchToBarCode()}}>
                  <MaterialIcons name="qr-code-scanner" size={50} color="black" />          
              </TouchableOpacity>
            </View>
        </View>
        
        
      </Camera>}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width, 
    height: height
  },
  camera: {
    //flex: 1,
  },
  image :{
    position: 'absolute',
    resizeMode: 'contain',
    width: width, 
    height: height
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  takePhoto: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#14274e',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom:10
  },

  cameraPrev :{
    backgroundColor: 'transparent',
    flex: 1,
    //width: '100%',
    //height: '100%'
  },
  btnAlign: {
    marginTop: height-30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconsAlign: {
    marginTop: height-30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  scannerPos: {
    position: "absolute",
    right : 30,
    top : 30
  }


});