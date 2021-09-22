import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class NomorMeja extends React.Component {
  constructor(props) {
    super(props)
    this.nomorMejaClick = this.nomorMejaClick.bind(this);
    this.state = {
      nomormeja: []
    }
  }
  nomorMejaClick(nilai) {
    this.props.showPay(nilai);
  }
  getMeja() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/nomormeja')
      .then(response => response.json())
      .then(res => {
        this.setState({
          nomormeja: res
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
  componentDidMount() {
    this.getMeja();
  }
  render() {
    return(
      <View>
        <Text style={styles.headerTextBold}>Pilih nomor meja untuk melakukan pembayaran</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          {this.state.nomormeja.map((item, i) => {
            return(
              <View key={i}>
                {item.ketersediaan_meja == 'aktif' ?
                  <View>
                    <TouchableOpacity
                      style={styles.nomorActive}
                      onPress={() => this.nomorMejaClick(item)}
                    >
                    <Text style={styles.nomorTextBoldWhite}>{item.nomor_meja}</Text>
                    </TouchableOpacity>
                    <Text style={styles.nomorBodyTextBoldActive}>{this.capitalizeFirstLetter(item.ketersediaan_meja)}</Text>
                  </View>
                : item.ketersediaan_meja == 'kosong' ?
                  <View>
                    <TouchableOpacity
                      style={styles.nomorAvail}
                      onPress={() => {
                        ToastAndroid.show("Tidak terdapat pesanan dalam nomor meja ini!", ToastAndroid.SHORT);
                      }}
                    >
                    <Text style={styles.nomorTextBoldWhite}>{item.nomor_meja}</Text>
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>{this.capitalizeFirstLetter(item.ketersediaan_meja)}</Text>
                  </View>
                : item.ketersediaan_meja == 'tidak aktif' ?
                  <View>
                    <TouchableOpacity disabled={true} style={styles.nomorNon}>
                    <Text style={styles.nomorTextBoldWhite}>{item.nomor_meja}</Text>
                    </TouchableOpacity>
                    <Text style={styles.nomorBodyTextBoldNon}>{this.capitalizeFirstLetter(item.ketersediaan_meja)}</Text>
                  </View>
                : null
                }
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default NomorMeja;
