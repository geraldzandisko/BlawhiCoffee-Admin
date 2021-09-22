import React from 'react';
import {View, Text, TouchableOpacity, Modal, ToastAndroid} from 'react-native';
import {OverlimitTable} from '../components';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import 'moment/locale/id';
import CurrencyInput from 'react-native-currency-input';
import styles from '../styles/Android.style';
import DatePicker from 'react-native-date-picker';
import {TextInput} from 'react-native-gesture-handler';
import CONSTANT from '../assets/constant';

class PengaturanPengeluaran extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musimanVisible: false,
      dateSelected: new Date(),
      dateApplied: new Date(),
      musimanbefore: 0,
      musiman: 0,
      pengaturan_pengeluaran: []
    };
  }
  getPengaturan() {
    fetch(CONSTANT.BASE_URL+ '/pengeluaran/details?id_pengaturan=1')
    .then(response => response.json())
    .then(res => {
      this.setState({
        pengaturan_pengeluaran: res[0]
      })
    })
    .catch(error => {
      console.error(error)
    })
  }
  setMusimanVisible = visible => {
    this.setState({musimanVisible: visible});
  };
  applyMusiman() {
      this.setMusimanVisible(true);
  }
  applyMusimanDone() {
    fetch(CONSTANT.BASE_URL+ '/pengeluaran/editPengaturan', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tanggal: this.state.dateApplied,
				nominal: this.state.musiman,
      })
    })
    .then(() => {
      this.getPengaturan();
    })
    ToastAndroid.show(
      'Nominal pengeluaran musiman dan tanggal berlaku telah diperbarui!',
      ToastAndroid.SHORT,
    );
    this.setState({
      musiman: 0
    })
  }
  componentDidMount() {
    this.getPengaturan();
  }
  render() {
    const {musimanVisible} = this.state;
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={musimanVisible}
          onRequestClose={() => {
            this.setMusimanVisible(!musimanVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>
                Konfirmasi Pengaturan Pengeluaran
              </Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                <Text>
                  Apakah Anda yakin untuk menetapkan nominal pengeluaran baru sebanyak
                </Text>
                <NumberFormat
                  renderText={value => (
                    <Text style={styles.bodyTextBold}> {value}</Text>
                  )}
                  value={this.state.musiman}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp'}
                />
                <Text>? Dan akan berlaku mulai tanggal </Text>
                <Text style={styles.bodyTextBold}>
                  {moment(this.state.dateApplied).format('MMMM Do YYYY')}
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
                  onPress={() => this.setMusimanVisible(!musimanVisible)}>
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
                  onPress={() => this.setMusimanVisible(!musimanVisible)}
                  onPressOut={() => this.applyMusimanDone()}>
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
        <View style={styles.viewPadding}>
          <Text style={styles.headerTextBold}>Pengaturan Pengeluaran</Text>
          <View style={styles.horizontalLine}></View>
          <View style={[styles.marginTopTwenty]}>
            <Text style={styles.bodyTextBold}>Pengeluaran Kasir Sekarang</Text>
            <CurrencyInput
              editable={false}
              value={this.state.pengaturan_pengeluaran.maksimal_pengeluaran}
              prefix="Rp"
              delimiter=","
              precision={0}
              style={[styles.inputForm, styles.disabledForm]}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={[styles.marginTopTwenty, {flexGrow: 1, marginRight: 10}]}>
              <Text style={styles.bodyTextBold}>
                Tanggal Nominal Pengeluaran Baru Mulai Berlaku
              </Text>
              <TextInput
                editable={false}
                value={moment(this.state.pengaturan_pengeluaran.tanggal_berlaku).format('MMMM Do YYYY')}
                style={[styles.inputForm, styles.disabledForm]}
              />
            </View>
            <View
              style={[styles.marginTopTwenty, {flexGrow: 1, marginLeft: 10}]}>
              <Text style={styles.bodyTextBold}>Nominal Pengeluaran Baru</Text>
              <CurrencyInput
                editable={false}
                value={this.state.pengaturan_pengeluaran.nominal_baru}
                prefix="Rp"
                delimiter=","
                precision={0}
                style={[styles.inputForm, styles.disabledForm]}
              />
            </View>
          </View>
          <View style={styles.marginTopTwenty}>
            <Text style={styles.bodyTextBold}>
              Ubah Tanggal Nominal Pengeluaran Berlaku
            </Text>
            <View style={{alignItems: 'center'}}>
              <DatePicker
                locale="id_ID"
                minimumDate={this.state.dateSelected}
                mode="date"
                androidVariant="nativeAndroid"
                date={this.state.dateSelected}
                onDateChange={date => {
                  this.setState({
                    dateApplied: date,
                  });
                }}
              />
            </View>
          </View>
          <View style={styles.marginTopTwenty}>
            <Text style={styles.bodyTextBold}>Ubah Nominal Pengeluaran</Text>
            <CurrencyInput
              value={this.state.musiman}
              prefix="Rp"
              delimiter=","
              precision={0}
              style={styles.inputForm}
              onChangeText={formattedValue => {
                this.setState({
                  musimanbefore: Math.round(
                    formattedValue.split(',').join('').split('Rp').join(''),
                  ),
                });
              }}
              onChangeValue={value => {
                this.setState({
                  musiman: value,
                });
              }}
            />
          </View>
          <View style={styles.marginTopTwenty}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => this.applyMusiman()}>
              <Text style={styles.buttonText}>UBAH</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.marginTopTwenty}>
          <View style={styles.viewPaddingLeftRight}>
            <Text style={styles.headerTextBold}>Pengeluaran Overlimit</Text>
            <View style={styles.horizontalLine}></View>
          </View>
          <OverlimitTable />
        </View>
      </View>
    );
  }
}

export default PengaturanPengeluaran;
