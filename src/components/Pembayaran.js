import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native';
import {NomorMeja} from '../components';
import CurrencyInput from 'react-native-currency-input';
import moment from 'moment';
import 'moment/locale/id';
import NumberFormat from 'react-number-format';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class Pembayaran extends React.Component {
  constructor(props) {
    super(props);
    this.showPay = this.showPay.bind(this);
    this.state = {
      HeadTable: ['PESANAN', 'HARGA', 'QTY', 'TOTAL HARGA'],

      Pesanan: [
        {
          nomormeja: 1,
          nomorpesanan: 1,
          tanggal: new Date('July 14, 2021 14:13:13'),
        },
      ],
      DataTable : [],
      DataTableHead: [],
      id_meja : '',
      NomorMejaShown: true,
      FinishPay: false,
      konfirmasiVisible: false,
      pembatalanVisible: false,
      // Input
      total: 125000,
      jumlahuang: 0,
      jumlahuangbefore: 0,
      nomormeja: '3',
      keluhan: '',
    };
  }
  selesaikanPesanan(id_meja) {
    let url_tujuan = CONSTANT.BASE_URL+'/pesanan/selesaikan?id_meja=' + id_meja
    console.log('URL TUJUAN ', url_tujuan)
    fetch(url_tujuan, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jumlahuang: this.state.jumlahuang,
        kembalian: this.state.jumlahuang - this.state.DataTableHead.total,
      })
    })
  }
  batalkanPesanan(id_meja) {
    let url_tujuan = CONSTANT.BASE_URL+'/pesanan/batalkan?id_meja=' + id_meja
    console.log('URL TUJUAN ', this.state.keluhan)
    fetch(url_tujuan, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keluhan: this.state.keluhan,
      })
    })
  }
  getDetailPesanan(idMeja) {
    let url_tujuan = CONSTANT.BASE_URL+ '/pesanan/detailPesanan?id='+idMeja
    console.log('URL TUJUAN ', url_tujuan)
    fetch(url_tujuan)
    .then(response => response.json())
    .then(res => {
      console.log('RESULT FETCH ??', res)
      this.setState({
        DataTable : res
      });
    })
    .catch(error => {
      console.error(error)
    })
  }
  getDetailHeadPesanan(idMeja) {
    let url_tujuan = CONSTANT.BASE_URL+ '/pesanan/detailHeadPesanan?id='+idMeja
    console.log('URL TUJUAN ', url_tujuan)
    fetch(url_tujuan)
    .then(response => response.json())
    .then(res => {
      console.log('RESULT FETCH ??', res)
      this.setState({
        DataTableHead : res[0]
      });
    })
    .catch(error => {
      console.error(error)
    })
  }
  setKonfirmasiVisible = visible => {
    this.setState({konfirmasiVisible: visible});
  };
  setPembatalanVisible = visible => {
    this.setState({pembatalanVisible: visible});
  };
  showPay(nilai) {
    this.setState({
      NomorMejaShown: false,
      FinishPay: true,
      id_meja : nilai.id_nomor_meja
    });
    this.getDetailPesanan(nilai.id_nomor_meja);
    this.getDetailHeadPesanan(nilai.id_nomor_meja);
  }
  payConfirm() {
    if (this.state.jumlahuang == 0) {
      ToastAndroid.show(
        'Jumlah uang yang dibayar belum dimasukkan!',
        ToastAndroid.SHORT,
      );
    } else if (this.state.jumlahuang == null) {
      ToastAndroid.show(
        'Jumlah uang yang dibayar belum dimasukkan!',
        ToastAndroid.SHORT,
      );
    } else if (this.state.jumlahuang - this.state.DataTableHead.total < 0) {
      ToastAndroid.show(
        'Jumlah uang yang dibayar kurang dari total harga pesanan!',
        ToastAndroid.SHORT,
      );
    } else if (this.state.jumlahuang - this.state.DataTableHead.total >= 1) {
      this.setKonfirmasiVisible(true);
    } else if (this.state.jumlahuang - this.state.DataTableHead.total == 0) {
      this.setKonfirmasiVisible(true);
    }
  }
  payDone() {
    this.setState({
      NomorMejaShown: true,
      FinishPay: false,
    });
    ToastAndroid.show(
      'Transaksi pembayaran telah diselesaikan.',
      ToastAndroid.SHORT,
    );
    this.selesaikanPesanan(this.state.id_meja);
  }
  batalConfirm() {
    if (this.state.keluhan == '') {
      ToastAndroid.show(
        'Keluhan pembatalan pesanan belum dimasukkan!',
        ToastAndroid.SHORT,
      );
    } else {
      this.batalkanPesanan(this.state.id_meja);
      this.setPembatalanVisible(false);
      ToastAndroid.show(
        'Pembatalan pesanan berhasil dilakukan.',
        ToastAndroid.SHORT,
      );
      this.setState({
        NomorMejaShown: true,
        FinishPay: false,
      });
    }
  }
  batalDone() {}
  render() {
    const printPDF = async () => {
      const receipt = this.state.DataTable.map((data, i) => {
        return `<tr>
					<td>${data.pesanan}</td>
          <td class="textright">Rp${data.harga}</td>
					<td class="textright">${data.qty}</td>
          <td class="textright">Rp${data.harga * data.qty}</td>
					</tr>`
      });
      const results = await RNHTMLtoPDF.convert({
        html: `<html>
				<style>
          .try {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
          }
          .tryme {
            font-size: 2em;
            text-align: center;
          }
          .textright {
            text-align: right;
          }
					table {
            font-size: 1.6em;
						font-family: arial, sans-serif;
						border-collapse: collapse;
						width: 100%;
					}
					td, th {
						text-align: left;
						padding: 8px;
					}
					</style>
          <p class="try">${this.props.namawarung}</p>
          <p class="tryme">Struk Tagihan #${this.state.DataTableHead.idpesanan}</p>
          <p class="tryme">Meja ${this.state.DataTableHead.nomormeja}, Pesanan ${this.state.DataTableHead.nopemesanan}</p>
					<p class="tryme">${moment(this.state.DataTableHead.tanggal).format('MMMM Do YYYY, hh:mm:ss')}</p>
          <hr>
					<table style="width:100%">
						<tr>
							<th>Nama Pesanan</th>
							<th class="textright">Harga</th>
              <th class="textright">QTY</th>
              <th class="textright">Total</th>
						</tr>
						${receipt}
            <tr>
							<td></td>
							<td></td>
              <td></td>
              <td></td>
						</tr>
            <tr>
							<td></td>
							<td></td>
              <td></td>
              <td></td>
						</tr>
            <tr>
							<td></td>
							<td></td>
              <td class="textright"><b>TOTAL HARGA</b></td>
              <td class="textright">Rp${this.state.DataTableHead.total}</td>
						</tr>
					</table>
				</html>`,
        fileName: 'test',
        base64: true,
      });

      await RNPrint.print({filePath: results.filePath});
    };
    const {konfirmasiVisible, pembatalanVisible} = this.state;
    return (
      <View style={styles.viewPadding}>
        {/* Modal */}
        {/* Konfirmasi */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={konfirmasiVisible}
          onRequestClose={() => {
            this.setKonfirmasiVisible(!konfirmasiVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>Konfirmasi Pembayaran</Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                Apakah Anda sudah yakin untuk menyelesaikan pembayaran dan
                mengakhiri pesanan pada meja ini?
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  // onPress={() => this.payDone()}
                  onPress={() =>
                    {
                     
                      this.setKonfirmasiVisible(!konfirmasiVisible)
                    }
                  }>
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
                  onPress={() => this.payDone()}
                  onPressOut={() =>
                    this.setKonfirmasiVisible(!konfirmasiVisible)
                  }>
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
        {/* Konfirmasi */}
        {/* Pembatalan */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={pembatalanVisible}
          onRequestClose={() => {
            this.setPembatalanVisible(!pembatalanVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>Pembatalan Pesanan</Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                Jika Anda yakin untuk membatalkan pesanan, tolong isi keluhan
                pelanggan di bawah ini.
              </Text>
              <TextInput
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                placeholder="Keluhan"
                style={styles.inputForm}
                onChangeText={value => {
                  this.setState({
                    keluhan: value,
                  });
                }}
              />
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setPembatalanVisible(!pembatalanVisible)}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    TUTUP
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, styles.buttonSpaceLeft]}
                  onPress={() => this.batalConfirm()}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    BATALKAN PESANAN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Pembatalan */}
        {/* Modal */}
        <View>
          {this.state.NomorMejaShown == true ? (
            <NomorMeja showPay={this.showPay} />
          ) : null}
        </View>
        {/* Payment */}
        {this.state.FinishPay == true ? (
          <View>
            <View>
              <Text style={styles.headerTextBold}>
                Rincian Pesanan Meja {this.state.DataTableHead.nomormeja}
              </Text>
              <Text style={styles.headerText}>
                Pesanan {this.state.DataTableHead.nopemesanan} (
                {moment(this.state.DataTableHead.tanggal).format('MMMM Do YYYY, HH:mm:ss')})
              </Text>
            </View>
            <View style={styles.horizontalLine}></View>
            {/* Table Header */}
            <View style={[styles.tableHeaderContainer, styles.marginTopTwenty]}>
              {this.state.HeadTable.map((item, i) => {
                return (
                  <View style={styles.tableHeaderBox} key={i}>
                    {item == 'QTY' ? (
                      <Text style={[styles.bodyTextBold, styles.flexEndText]}>
                        {item}
                      </Text>
                    ) : item == 'TOTAL HARGA' ? (
                      <Text style={[styles.bodyTextBold, styles.flexEndText]}>
                        {item}
                      </Text>
                    ) : item == 'HARGA' ? (
                      <Text style={[styles.bodyTextBold, styles.flexEndText]}>
                        {item}
                      </Text>
                    ) : (
                      <Text style={styles.bodyTextBold}>{item}</Text>
                    )}
                  </View>
                );
              })}
            </View>
            {/* Table Header */}
            {/* Table Row */}
            {this.state.DataTable.map((data, i) => {
              return (
                <View
                  key={i}
                  style={[styles.tableRowContainer, styles.marginTopTwenty]}>
                  <View style={styles.tableRowBox}>
                    <View style={styles.tableRowEach}>
                      {data.pesanan == 'Kopi Spesial' ? (
                        <Text style={[styles.bodyText, styles.TextDanger]}>
                          {data.pesanan}
                        </Text>
                      ) : data.pesanan == 'Kopi Gratis' ? (
                        <Text style={[styles.bodyText, styles.TextDanger]}>
                          {data.pesanan}
                        </Text>
                      ) : (
                        <Text style={[styles.bodyText, {color: '#000000'}]}>{data.pesanan}</Text>
                      )}
                    </View>
                    <View style={styles.tableRowEach}>
                      <NumberFormat
                        renderText={value => (
                          <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>
                        )}
                        value={data.harga}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp'}
                      />
                    </View>
                    <View style={styles.tableRowEach}>
                      <Text style={[styles.bodyText, styles.flexEndText]}>
                        {data.qty}
                      </Text>
                    </View>
                    <View style={styles.tableRowEach}>
                      <NumberFormat
                        renderText={value => (
                          <Text
                            style={[
                              styles.bodyText,
                              styles.flexEndText,
                              styles.textGrey,
                            ]}>
                            {value}
                          </Text>
                        )}
                        value={data.harga * data.qty}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp'}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
            {/* Table Row */}
            <View
              style={[styles.horizontalLine, styles.marginTopThirty]}></View>
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.bodyTextBold}>JUMLAH PELANGGAN</Text>
                <View style={styles.marginTopTen}>
                  <Text style={[styles.bodyText, styles.textGrey]}>{this.state.DataTableHead.pelanggan}</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.headerTextBold, styles.flexEndText]}>
                  TOTAL
                </Text>
                <View style={styles.marginTopTen}>
                  <NumberFormat
                    renderText={value => (
                      <Text
                        style={[
                          styles.headerTextBold,
                          styles.textGrey,
                          styles.flexEndText,
                        ]}>
                        {value}
                      </Text>
                    )}
                    value={this.state.DataTableHead.total}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp'}
                  />
                </View>
              </View>
            </View>
            <View
              style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
              <View style={styles.formbuttonFortyFive}>
                <Text style={styles.bodyTextBold}>
                  Jumlah Uang Yang Dibayar
                </Text>
                <CurrencyInput
                  value={this.state.jumlahuang}
                  prefix="Rp"
                  delimiter=","
                  precision={0}
                  style={[styles.inputForm, styles.formbuttonHunned]}
                  onChangeText={formattedValue => {
                    this.setState({
                      jumlahuangbefore: Math.round(
                        formattedValue.split(',').join('').split('Rp').join(''),
                      ),
                    });
                  }}
                  onChangeValue={value => {
                    this.setState({
                      jumlahuang: value,
                    });
                  }}
                />
              </View>
              <View style={styles.formbuttonFortyFive}>
                <Text style={styles.bodyTextBold}>Kembalian</Text>
                <CurrencyInput
                  editable={false}
                  value={this.state.jumlahuang - this.state.DataTableHead.total}
                  prefix="Rp"
                  delimiter=","
                  signPosition="beforePrefix"
                  precision={0}
                  style={[
                    styles.inputForm,
                    styles.formbuttonHunned,
                    styles.disabledForm,
                  ]}
                />
              </View>
            </View>
            <View
              style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
              <TouchableOpacity
                style={[styles.editButton, styles.formbuttonFortyFive]}
                onPress={printPDF}>
                <Text style={styles.buttonText}>CETAK STRUK TAGIHAN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.payConfirm()}
                style={[styles.addButton, styles.formbuttonFortyFive]}>
                <Text style={styles.buttonText}>KONFIRMASI PEMBAYARAN</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
              <TouchableOpacity
                onPress={() => this.setPembatalanVisible(true)}
                style={[styles.deleteButton, styles.formbuttonHunned]}>
                <Text style={styles.buttonText}>BATALKAN PESANAN</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    FinishPay: false,
                    NomorMejaShown: true,
                  });
                }}
                style={[styles.cancelButton, styles.formbuttonHunned]}>
                <Text style={styles.buttonText}>KEMBALI</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {/* Payment */}
      </View>
    );
  }
}

export default Pembayaran;
