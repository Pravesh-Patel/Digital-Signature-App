import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import React, {useRef, useState} from 'react';
import SignatureScreen from 'react-native-signature-canvas';
import DropDownPicker from 'react-native-dropdown-picker';

const Siganature = () => {
  const ref = useRef();
  const [signature, setSignature] = useState(null);

  const [penColor, setPenColor] = useState('blue');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('blue');
  const [items, setItems] = useState([
    {label: 'Black', value: 'black'},
    {label: 'Red', value: 'red'},
    {label: 'Blue', value: 'blue'},
    {label: 'Green', value: 'green'},
  ]);

  const handleSignature = signature => {
    setSignature(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };

  const requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs access to Storage data.',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const saveSignature = async () => {
    if (Platform.OS === 'android') {
      const granted = await requestExternalStoragePermission();
      if (!granted) {
        return;
      }
    }

    const path = `${RNFS.PicturesDirectoryPath}/signature.png`;
    RNFS.writeFile(
      path,
      signature.replace('data:image/png;base64,', ''),
      'base64',
    )
      .then(() => {
        console.log(`Signature saved to ${path}`);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 20, color: '#000', marginLeft: 20}}>
          QuickSign
        </Text>
      </View>
      <View style={styles.parentView}>
        <View style={styles.childView}>
          <Text style={styles.label}>Pen Color</Text>
          <DropDownPicker
            style={styles.dropDown}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={value => setPenColor(value)}
          />
        </View>
      </View>

      <View style={styles.signPad}>
        <SignatureScreen
          ref={ref}
          penColor={penColor}
          backgroundColor="white"
          onOK={handleSignature}
          onEmpty={handleEmpty}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Save"
        />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={[styles.btnBottom, {backgroundColor: 'red'}]}
          onPress={() => {
            handleClear();
          }}>
          <Text style={{color: '#fff'}}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnBottom, {backgroundColor: 'green'}]}
          onPress={() => {
            handleConfirm();
            saveSignature();
          }}>
          <Text style={{color: '#fff'}}>Save & Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Siganature;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
  },
  parentView: {
    flexDirection: 'row',
    marginTop: 150,
    padding: 10,
    marginBottom: 80,
  },
  childView: {
    flex: 1,
    height: 30,
    width: '33%',
    margin: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  signPad: {
    width: '93%',
    height: 250,
    borderWidth: 1,
    bottom: 40,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 120,
    padding: 10,
    marginBottom: 10,
    bottom: 155,
  },
  btnBottom: {
    flex: 1,
    height: 30,
    width: '33%',
    borderWidth: 0,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    color: '#000',
    paddingBottom: 5,
    fontWeight: '450',
    paddingLeft: 5,
  },
  dropDown: {
    borderRadius: 0,
    height: 38,
  },
});
