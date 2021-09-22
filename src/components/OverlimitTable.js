import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ToastAndroid
} from 'react-native';
import moment from 'moment';
import 'moment/locale/id'
import NumberFormat from 'react-number-format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class OverlimitTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      HeadTable: ['KETERANGAN', 'TANGGAL', 'HARGA', 'AKSI'],
      DataTable: [],
      simpanVisible: false,
      hapusVisible: false,
      id_pengeluaran: '',
      // overlimit
      deskripsioverlimit: '',
      hargaoverlimit: 0
    }
  }
  getPengeluaranOverlimit() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/pengeluaran/getPengeluaranOverlimit')
      .then(response => response.json())
      .then(res => {
        this.setState({
          DataTable: res
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  addOverlimit() {
		fetch(CONSTANT.BASE_URL+ '/pengeluaran/addOverlimit', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: this.state.id_pengeluaran,
			})
		})
    .then(() => {
      this.getPengeluaranOverlimit();
    })
    ToastAndroid.show("Anda berhasil menambahkan pengeluaran overlimit ke dalam riwayat pengeluaran.", ToastAndroid.SHORT);
	}
  deleteOverlimit() {
		fetch(CONSTANT.BASE_URL+ '/pengeluaran/deleteOverlimit', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: this.state.id_pengeluaran,
			})
		})
    .then(() => {
      this.getPengeluaranOverlimit();
    })
    ToastAndroid.show("Anda berhasil menghapus pengeluaran overlimit.", ToastAndroid.SHORT);
	}
  setSimpanVisible = (visible) => {
		this.setState({simpanVisible: visible})
	}
  setHapusVisible = (visible) => {
		this.setState({hapusVisible: visible})
	}
  componentDidMount() {
    this.getPengeluaranOverlimit();
  }
  render() {
    const {simpanVisible, hapusVisible} = this.state;
    return(
      <View>
        {/* Add */}
        <Modal
					animationType="fade"
					transparent={true}
					visible={simpanVisible}
					onRequestClose={() => {
						this.setSimpanVisible(!simpanVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Pengeluaran Overlimit</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>
									<Text>Apakah Anda yakin untuk menambahkan pengeluaran</Text>
									<Text style={styles.bodyTextBold}> {this.state.deskripsioverlimit} </Text>
                  <Text>sebesar</Text>
                  <NumberFormat
                    renderText={(value) => <Text style={styles.bodyTextBold}> {value} </Text>}
                    value={this.state.hargaoverlimit}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp'}
                  />
                  <Text>dalam riwayat pengeluaran?</Text>
								</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setSimpanVisible(!simpanVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setSimpanVisible(!simpanVisible)}
									onPressOut={() => this.addOverlimit()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
        {/* Add */}
        {/* Delete */}
        <Modal
					animationType="fade"
					transparent={true}
					visible={hapusVisible}
					onRequestClose={() => {
						this.setHapusVisible(!hapusVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Hapus Pengeluaran Overlimit</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>
									<Text>Apakah Anda yakin untuk menghapus pengeluaran</Text>
									<Text style={styles.bodyTextBold}> {this.state.deskripsioverlimit} </Text>
                  <Text>sebesar</Text>
                  <NumberFormat
                    renderText={(value) => <Text style={styles.bodyTextBold}> {value}</Text>}
                    value={this.state.hargaoverlimit}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp'}
                  />
                  <Text>?</Text>
								</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setHapusVisible(!hapusVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setHapusVisible(!hapusVisible)}
									onPressOut={() => this.deleteOverlimit()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
        {/* Delete */}
        {/* Table Header */}
        <View style={[styles.tableHeaderContainer, styles.greyHeaderTable, styles.marginTopTwenty]}>
          {this.state.HeadTable.map((item, i) => {
            return(
              <View
                style={[styles.tableHeaderBox, styles.greyTablePaddingHeader]}
                key={i}
              >
                {item == 'AKSI' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                : item == 'HARGA' ?
                <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                : <Text style={[styles.bodyTextBold, styles.greyHeaderColor]}>{item}</Text>
                }
              </View>
            );
          })}
        </View>
        {/* Table Header */}
        {/* Table Row */}
        {this.state.DataTable.map((data, i) => {
          return(
            <View
              key={i}
              style={[styles.tableRowContainer, styles.greyTableLine]}
            >
              <View style={styles.tableRowBox}>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={styles.bodyText}>
                    {data.keterangan_pengeluaran}
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={styles.bodyText}>
                    {moment(data.tanggal_pengeluaran).format('L')}
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <NumberFormat
                    renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                    value={data.harga_pengeluaran}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp'}
                  />
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                      style={[styles.addButton, styles.buttonSpaceRight]}
                      onPressIn={() => {
                        this.setState({
                          id_pengeluaran: data.id_pengeluaran
                        })
                      }}
                      onPress={() => {
                        this.setState({
                          deskripsioverlimit: data.keterangan_pengeluaran,
                          hargaoverlimit: data.harga_pengeluaran
                        })
                      }}
                      onPressOut={() => this.setSimpanVisible(true)}
                    >
                      <Text style={styles.buttonText}>SIMPAN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteButton, styles.buttonSpaceLeft]}
                      onPressIn={() => {
                        this.setState({
                          id_pengeluaran: data.id_pengeluaran
                        })
                      }}
                      onPress={() => {
                        this.setState({
                          deskripsioverlimit: data.keterangan_pengeluaran,
                          hargaoverlimit: data.harga_pengeluaran
                        })
                      }}
                      onPressOut={() => this.setHapusVisible(true)}
                    >
                      <MaterialIcons name="delete" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {/* Table Row */}
      </View>
    );
  }
}

export default OverlimitTable;
