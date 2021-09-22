import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ToastAndroid,
} from 'react-native';
import NumberFormat from 'react-number-format';
import CurrencyInput from 'react-native-currency-input';
import RadioForm from 'react-native-simple-radio-button';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class HidanganKopiSpesial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Current
      minimalhidangan: [],
      layananmaksimal: 0,
      fitur_kopigratis: [],
      hidanganVisible: false,
      kopiGratisVisible: false,
      // Input
      hargahidangan: 0,
      hargahidanganbefore: 0,
    };
  }
  monitorKopiGratis() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/kopi/get')
      .then(response => response.json())
      .then(res => {
        this.setState({
          fitur_kopigratis: res[0],
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  monitorNominalHidangan() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/getHidanganNominal')
      .then(response => response.json())
      .then(res => {
        this.setState({
          minimalhidangan: res[0]
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  applyHidangan() {
    if (this.state.hargahidangan == 0) {
      ToastAndroid.show(
        'Nominal total pembayaran untuk hidangan kopi spesial belum dimasukkan!',
        ToastAndroid.SHORT,
      );
    } else if (this.state.hargahidangan == null) {
      ToastAndroid.show(
        'Nominal total pembayaran untuk hidangan kopi spesial belum dimasukkan!',
        ToastAndroid.SHORT,
      );
    } else {
      this.setHidanganVisible(true);
    }
  }
  changeHidanganStatus(value) {
    fetch(CONSTANT.BASE_URL+ '/changeHidanganStatus', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: value
      })
    }) 
  }
  changeKopiStatus(value) {
    fetch(CONSTANT.BASE_URL+ '/kopi/changeKopiStatus', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: value
      })
    }) 
  }
  applyHidanganDone() {
    fetch(CONSTANT.BASE_URL+ '/editHidangan', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jumlah: this.state.hargahidangan
      })
    })
    ToastAndroid.show(
      'Nominal total pembayaran baru atau pengaturan untuk hidangan kopi spesial telah ditetapkan!',
      ToastAndroid.SHORT,
    );
    this.textInputBayar.clear();
    this.setState({
      hargahidangan: 0
    })
  }
  applyKopiGratis() {
    if (this.state.layananmaksimal == null) {
      ToastAndroid.show(
        'Jumlah layanan maksimal untuk layanan kopi gratis belum dimasukkan!',
        ToastAndroid.SHORT,
      );
    } else {
      this.setKopiGratisVisible(true);
    }
  }
  applyKopiGratisDone() {
    fetch(CONSTANT.BASE_URL+ '/kopi/changeKopiJumlah', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jumlah: this.state.layananmaksimal
      })
    })
    this.textInput.clear();
    ToastAndroid.show(
      'Jumlah layanan maksimal baru untuk layanan kopi gratis telah ditetapkan!',
      ToastAndroid.SHORT,
    );
  }
  setHidanganVisible = visible => {
    this.setState({hidanganVisible: visible});
  };
  setKopiGratisVisible = visible => {
    this.setState({kopiGratisVisible: visible});
  };
  componentDidMount() {
    // ###<TODO>###
    // KAMU HARUS FETCH DATABASE DARI ENDPOINT UNTUK KOPI GRATIS
    this.monitorNominalHidangan();
    this.monitorKopiGratis();
  }
  render() {
    const radio_props = [
      {label: 'Aktif', value: 'aktif'},
      {label: 'Tidak Aktif', value: 'tidak aktif'},
    ];
    const {hidanganVisible, kopiGratisVisible} = this.state;
    return (
      <View>
        {/* Hidangan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={hidanganVisible}
          onRequestClose={() => {
            this.setHidanganVisible(!hidanganVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>
                Konfirmasi Hidangan Kopi Spesial
              </Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                <Text>
                  Apakah Anda yakin untuk menetapkan nominal total pembayaran
                  sebanyak
                </Text>
                <NumberFormat
                  renderText={value => (
                    <Text style={styles.bodyTextBold}> {value}</Text>
                  )}
                  value={this.state.hargahidangan}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp'}
                />
                <Text>?</Text>
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setHidanganVisible(!hidanganVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    TIDAK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => this.setHidanganVisible(!hidanganVisible)}
                  onPressOut={() => this.applyHidanganDone()}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    IYA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Hidangan */}
        {/* Kopi Gratis */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={kopiGratisVisible}
          onRequestClose={() => {
            this.setKopiGratisVisible(!kopiGratisVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>
                Konfirmasi Layanan Kopi Gratis
              </Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                <Text>
                  Apakah Anda yakin untuk menetapkan batas layanan kopi gratis
                  per hari sebanyak
                </Text>
                <Text style={styles.bodyTextBold}>
                  {' '}
                  {this.state.layananmaksimal}
                </Text>
                <Text>?</Text>
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setKopiGratisVisible(!kopiGratisVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    TIDAK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.buttonSpaceLeft]}
                  onPress={() => this.setKopiGratisVisible(!kopiGratisVisible)}
                  onPressOut={() => this.applyKopiGratisDone()}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    IYA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Gratis */}
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.contSplitFivty}>
              <Text style={styles.headerTextBold}>Hidangan Kopi Spesial</Text>
              <View style={styles.horizontalLine}></View>
              {/* Setting */}
              <View style={styles.marginTopTwenty}>
                <Text style={styles.bodyTextBold}>Status</Text>
                <View style={styles.marginTopTwenty}>
                  {this.state.minimalhidangan.status_fitur == 'aktif' ?
                    <RadioForm
                      radio_props={radio_props}
                      initial={0}
                      onPress={value => {
                        this.changeHidanganStatus(value);
                      }}
                      buttonColor={'#000000'}
                      selectedButtonColor={'#000000'}
                      labelStyle={styles.bodyText}
                      buttonSize={20}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    />
                    : this.state.minimalhidangan.status_fitur == 'tidak aktif' ?
                    <RadioForm
                      radio_props={radio_props}
                      initial={1}
                      onPress={value => {
                        this.changeHidanganStatus(value);
                      }}
                      buttonColor={'#000000'}
                      selectedButtonColor={'#000000'}
                      labelStyle={styles.bodyText}
                      buttonSize={20}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    />
                    : null }
                </View>
              </View>
              <View style={styles.marginTopTwenty}>
                <Text style={styles.bodyTextBold}>
                  Minimal Total Pembayaran Sekarang
                </Text>
                <CurrencyInput
                  editable={false}
                  value={this.state.minimalhidangan.minimal_total}
                  prefix="Rp"
                  delimiter=","
                  precision={0}
                  style={[styles.inputForm, styles.disabledForm]}
                />
              </View>
              <View style={styles.marginTopTwenty}>
                <Text style={styles.bodyTextBold}>
                  Ubah Minimal Total Pembayaran
                </Text>
                {this.state.minimalhidangan.status_fitur == 'aktif' ? (
                  <CurrencyInput
                    ref={input => {
                      this.textInputBayar = input;
                    }}
                    value={this.state.hargahidangan}
                    prefix="Rp"
                    delimiter=","
                    precision={0}
                    style={styles.inputForm}
                    onChangeText={formattedValue => {
                      this.setState({
                        hargahidanganbefore: Math.round(
                          formattedValue
                            .split(',')
                            .join('')
                            .split('Rp')
                            .join(''),
                        ),
                      });
                    }}
                    onChangeValue={value => {
                      this.setState({
                        hargahidangan: value,
                      });
                    }}
                  />
                ) : (
                  <CurrencyInput
                    editable={false}
                    value={this.state.hargahidangan}
                    prefix="Rp"
                    delimiter=","
                    precision={0}
                    style={[styles.inputForm, styles.disabledForm]}
                    onChangeText={formattedValue => {
                      this.setState({
                        hargahidanganbefore: Math.round(
                          formattedValue
                            .split(',')
                            .join('')
                            .split('Rp')
                            .join(''),
                        ),
                      });
                    }}
                    onChangeValue={value => {
                      this.setState({
                        hargahidangan: value,
                      });
                    }}
                  />
                )}
              </View>
              <View style={styles.marginTopTwenty}>
                {this.state.minimalhidangan.status_fitur == 'aktif' ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      this.applyHidangan();
                    }}>
                    <Text style={styles.buttonText}>SIMPAN</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.greyButton} disabled={true}>
                    <Text style={styles.buttonText}>SIMPAN</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Setting */}
            </View>
            <View style={styles.contSplitFivty}>
              <Text style={styles.headerTextBold}>Kopi Gratis Per Hari</Text>
              <View style={styles.horizontalLine}></View>
              {/* Setting */}
              <View style={styles.marginTopTwenty}>
                <Text style={styles.bodyTextBold}>Status</Text>
                <View style={styles.marginTopTwenty}>
                  {this.state.fitur_kopigratis.status_fitur == 'aktif' ?
                    <RadioForm
                      radio_props={radio_props}
                      initial={0}
                      onPress={value => {
                        this.changeKopiStatus(value);
                      }}
                      buttonColor={'#000000'}
                      selectedButtonColor={'#000000'}
                      labelStyle={styles.bodyText}
                      buttonSize={20}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    />
                    : this.state.fitur_kopigratis.status_fitur == 'tidak aktif' ?
                    <RadioForm
                      radio_props={radio_props}
                      initial={1}
                      onPress={value => {
                        this.changeKopiStatus(value);
                      }}
                      buttonColor={'#000000'}
                      selectedButtonColor={'#000000'}
                      labelStyle={styles.bodyText}
                      buttonSize={20}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    />
                  : null }
                </View>
              </View>
              <View style={styles.marginTopTwenty}>
                <Text style={styles.bodyTextBold}>
                  Layanan Kopi Gratis Maksimal Per Hari Sekarang
                </Text>
                <CurrencyInput
                  editable={false}
                  value={this.state.fitur_kopigratis.layanan_maksimal}
                  precision={0}
                  style={[styles.inputForm, styles.disabledForm]}
                />
              </View>
              <View style={styles.marginTopTwenty}>
                <Text style={styles.bodyTextBold}>
                  Ubah Layanan Kopi Gratis Maksimal Per Hari
                </Text>
                {this.state.fitur_kopigratis.status_fitur == 'aktif' ? (
                  <TextInput
                    ref={input => {
                      this.textInput = input;
                    }}
                    keyboardType="numeric"
                    onChangeText={value => {
                      this.setState({
                        layananmaksimal: value,
                      });
                    }}
                    placeholder="Layanan Maksimal Per Hari"
                    style={styles.inputForm}
                  />
                ) : (
                  <TextInput
                    editable={false}
                    placeholder="Layanan Maksimal Per Hari"
                    style={[styles.inputForm, styles.disabledForm]}
                  />
                )}
              </View>
              <View style={styles.marginTopTwenty}>
                {this.state.fitur_kopigratis.status_fitur == 'aktif' ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.applyKopiGratis()}>
                    <Text style={styles.buttonText}>SIMPAN</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity disabled={true} style={styles.greyButton}>
                    <Text style={styles.buttonText}>SIMPAN</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Setting */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default HidanganKopiSpesial;
