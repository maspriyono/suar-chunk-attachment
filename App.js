import Expo, {Permissions} from 'expo';
import React from 'react';
import { StyleSheet, Button, View, Image, CameraRoll, Text } from 'react-native';
import firebase from './config/firebase';

export default class App extends React.Component {

  state = {
    imageUri: null,
    fileUri: null,
    downloadURL: null
  }

  _selectImage = async () => {
    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);

    if (status === 'granted') {

      const {cancelled, uri} = await Expo.ImagePicker.launchImageLibraryAsync();

      if (!cancelled) {
        this.setState({ imageUri: uri, fileUri: null });
      }
    }
  }

  _camera = async () => {
    const cameraRollPermissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(cameraRollPermissions);

    if (status === 'granted') {

      const cameraPermissions = Permissions.CAMERA;
      const { status } = await Permissions.askAsync(cameraPermissions);

      if (status === 'granted') {
        const {cancelled, uri} = await Expo.ImagePicker.launchCameraAsync({});

        if (!cancelled) {
          this.setState({ imageUri: uri, fileUri: null });
        }
      }
    }
  }

  _selectFile = async () => {
    const {cancelled, uri} = await Expo.DocumentPicker.getDocumentAsync({});

    if (!cancelled) {
      this.setState({fileUri: uri});
    }
  }

  _upload = async () => {
    const uri = this.state.imageUri ? this.state.imageUri : this.state.fileUri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = Date.now().toString();
    const ref = firebase
      .storage()
      .ref()
      .child(filename);
    const snapshot = await ref.put(blob);

    this.setState({downloadURL: snapshot.downloadURL})
  }

  renderImage = () => {
    const width = 200;
    const height = 200;

    if (this.state.imageUri && this.state.fileUri == null) {
      return (<Image style={{width, height}} source={{uri: this.state.imageUri}}/>);
    } else if (this.state.fileUri) {
      return (
        <View>
          <Image style={{width, height}} source={{uri: "https://cdn3.iconfinder.com/data/icons/brands-applications/512/File-256.png"}}/>
          <Text style={{alignItems: 'center', justifyContent: 'center'}}>{this.state.fileUri}</Text>
        </View>
      );
    } else {
      return (<View style={{width, height, backgroundColor: '#000'}}></View>);
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          {this.renderImage()}
        </View>
        <View>
          <Button onPress={()=>this._selectImage()} title="Image Picker"/>
          <Button onPress={()=>this._camera()} title="Camera"/>
          <Button onPress={()=>this._selectFile()} title="File Picker"/>
          
          {(this.state.imageUri || this.state.fileUri) &&
            <Button onPress={()=>this._upload()} title="Upload"/>
          }

          {this.state.downloadURL &&
            <Text style={{alignItems: 'center', justifyContent: 'center'}}>{this.state.downloadURL}</Text>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
