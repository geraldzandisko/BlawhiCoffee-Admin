import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import ToggleButton from 'react-native-toggle-buttons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as RootNavigation from '../../RootNavigation';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      role: '',
      kopiupdate: [],
    };
  }
  
  kopiUpdate() {
		fetch(CONSTANT.BASE_URL+ '/kopi/get')
    .then(response => response.json())
    .then(res => {
      this.setState({
      	kopiupdate: res[0],
      })
    })
    .catch(error => {
      console.error(error)
    })
	}
  loginAuth() {
    if (
      this.state.role == '' &&
      this.state.username == '' &&
      this.state.password == ''
    ) {
      ToastAndroid.show('Data belum dimasukkan!', ToastAndroid.SHORT);
    } else if (
      this.state.role == '' &&
      this.state.username != '' &&
      this.state.password != ''
    ) {
      ToastAndroid.show(
        'Pilih peran sebelum melakukan masuk ke dalam aplikasi!',
        ToastAndroid.SHORT,
      );
    } else if (
      this.state.role != '' &&
      this.state.username == '' &&
      this.state.password != ''
    ) {
      ToastAndroid.show('Username belum dimasukkan!', ToastAndroid.SHORT);
    } else if (
      this.state.role != '' &&
      this.state.username != '' &&
      this.state.password == ''
    ) {
      ToastAndroid.show('Password belum dimasukkan!', ToastAndroid.SHORT);
    } else {
      fetch(CONSTANT.BASE_URL+ '/loginAuth', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          wewenang: this.state.role,
        }),
      })
        .then(response => response.text())
        .then(response => {
          if (response === 'Ada') {
            fetch(CONSTANT.BASE_URL+ '/login', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
            this.textInputUsername.clear();
            this.textInputPassword.clear();
            RootNavigation.navigate('AdminScreen', {
              role: this.state.role,
              namawarung: this.props.namawarung,
              gambarlogo: this.props.gambarlogo
            });
            ToastAndroid.show(
              'Selamat datang di Aplikasi Pihak Warung Kopi!',
              ToastAndroid.SHORT,
            );
          } else {
            ToastAndroid.show(
              'Informasi akun yang Anda masukkan salah!',
              ToastAndroid.SHORT,
            );
          }
        });
    }
  }
  componentDidMount() {
    this.kopiUpdate();
  }
  render() {
    const LoginButton = (
      <TouchableOpacity
        style={{borderWidth: 1, padding: 20, borderRadius: 5, height: 165, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => this.loginAuth()}>
        <MaterialIcons name="arrow-forward" size={32} />
      </TouchableOpacity>
    );
    return (
      <View>
        <Text style={styles.loginTitle}>Selamat Datang!</Text>
        <Text style={[styles.bodyText, styles.TextCenter]}>
          Silahkan login terlebih dahulu.
        </Text>
        <ToggleButton.Group
          color="#FFFFFF"
          colorSelected="#000000"
          buttonStyle={styles.ToggleButtonStyle}
          row
          onValueChange={value => {
            this.setState({
              role: value,
            });
          }}>
          <View style={styles.ToggleButtonLayout}>
            <ToggleButton title="PEMILIK" value={'pemilik'} />
            <ToggleButton title="KASIR" value={'kasir'} />
          </View>
        </ToggleButton.Group>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexGrow: 1}}>
            <TextInput
              ref={input => {
                this.textInputUsername = input;
              }}
              style={styles.loginForm}
              placeholder="NAMA PENGGUNA"
              onChangeText={value => {
                this.setState({username: value});
              }}
            />
            <TextInput
              ref={input => {
                this.textInputPassword = input;
              }}
              style={styles.loginForm}
              placeholder="KATA SANDI"
              secureTextEntry
              onChangeText={value => {
                this.setState({password: value});
              }}
            />
          </View>
          <View style={{marginTop: 30, marginLeft: 20}}>
            <View>{LoginButton}</View>
          </View>
        </View>
      </View>
    );
  }
}

export default LoginForm;
