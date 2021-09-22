import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ToastAndroid
} from 'react-native';
import NumberFormat from 'react-number-format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-community/picker';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class TabelDaftarMenu extends React.Component {
  constructor(props) {
    super(props)
    this.editClick = this.editClick.bind(this);
    this.tambahClick = this.tambahClick.bind(this);
    this.state = {
      namamenu_edit: [],
      HeadTable: ['GAMBAR', 'NAMA', 'HARGA', 'KATEGORI', 'KETERSEDIAAN', 'AKSI'],
      HeadTableKasir: ['GAMBAR', 'NAMA', 'HARGA', 'KATEGORI', 'UBAH KETERSEDIAAN'],
      DataTable: [],
      ketersediaanmenu: 'tersedia',
      deleteVisible: false,
      namamenu_pesanan: ''
    }
  }
  editClick() {
    this.props.showEditMeja();
  }
  tambahClick() {
    this.props.showTambahMeja();
  }
  sendData = () => {
    this.props.parentCallback(this.state.namamenu_edit);
  }
  setDeleteVisible = (visible) => {
		this.setState({deleteVisible: visible})
	}
  changeKetersediaan(ketersediaan, id) {
    console.log(ketersediaan, id)
    fetch(CONSTANT.BASE_URL+ '/changeKetersediaan', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				ketersediaan: ketersediaan,
        idmenu: id,
			})
		})
    .then(() => {
      this.getMenu();
    })
  }
  deleteMenu() {
    fetch(CONSTANT.BASE_URL+ '/deleteMenu', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				namamenu: this.state.namamenu_pesanan
			})
		})
    .then(() => {
      this.getMenu();
    })
    ToastAndroid.show("Menu pesanan telah berhasil dihapus.", ToastAndroid.SHORT);
  }
  getMenu() {
    fetch(CONSTANT.BASE_URL+ '/daftarmenu')
    .then(response => response.json())
    .then(res => {
      this.setState({
        DataTable: res
      })
    })
    .catch(error => {
      console.error(error)
    })
  }
  capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
  componentDidMount() {
    this.getMenu();
  }
  render() {
    const {deleteVisible} = this.state;
    return(
      <View>
        {/* Delete */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={deleteVisible}
					onRequestClose={() => {
						this.setDeleteVisible(!deleteVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Hapus Menu</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>Apakah Anda yakin untuk menghapus menu pesanan ini?</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setDeleteVisible(!deleteVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setDeleteVisible(!deleteVisible)}
									onPressOut={() => this.deleteMenu()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{/* Delete */}
        {/* Table Header */}
        {this.props.authority == 'pemilik' ?
          <View style={[styles.tableHeaderContainer, styles.greyHeaderTable]}>
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
        :
          <View style={[styles.tableHeaderContainer, styles.greyHeaderTable]}>
            {this.state.HeadTableKasir.map((item, i) => {
              return(
                <View
                style={[styles.tableHeaderBox, styles.greyTablePaddingHeader]}
                key={i}
                >
                  {item == 'UBAH KETERSEDIAAN' ?
                    <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                  : <Text style={[styles.bodyTextBold, styles.greyHeaderColor]}>{item}</Text>
                  }
                </View>
              );
            })}
          </View>
        }
        {/* Table Header */}
        {/* Table Row */}
        {this.props.authority == 'pemilik' ?
          <View>
            {this.state.DataTable.map((data, i) => {
              return(
                <View
                  key={i}
                  style={styles.tableRowContainer, styles.greyTableLine}
                >
                  <View style={styles.tableRowBox}>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Image style={{width: 100, height: 100}} source={{uri: CONSTANT.BASE_URL+ '/image/' + data.gambar_menu}} />
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Text style={styles.bodyText}>
                        {data.nama_menu}
                      </Text>
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      {data.diskon > 0 ?
                        <View>
                          <NumberFormat
                            renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText, {textDecorationLine: 'line-through'}]}>{value}</Text>}
                            value={data.harga_menu}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp'}
                          />
                          <NumberFormat
                            renderText={(value) => <Text style={[styles.bodyTextBold, styles.TextDanger, styles.flexEndText]}>{value} ({data.diskon}%)</Text>}
                            value={data.harga_menu - (data.harga_menu * data.diskon / 100)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp'}
                          />
                        </View>
                      :
                        <NumberFormat
                          renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                          value={data.harga_menu}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp'}
                        />
                      }
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Text style={styles.bodyText}>
                        {data.nama_kategori}
                      </Text>
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Text style={styles.bodyText}>
                        {data.ketersediaan_menu == 'tersedia' ? 
                          <Text style={styles.bodyText, styles.TextGreen}>
                            {this.capitalizeFirstLetter(data.ketersediaan_menu)}
                          </Text>
                        : data.ketersediaan_menu == 'tidak tersedia' ?
                          <Text style={[styles.bodyText, styles.TextWarning]}>
                            {this.capitalizeFirstLetter(data.ketersediaan_menu)}
                          </Text>
                        : null
                        }
                      </Text>
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                          style={[styles.editButtonTable, styles.buttonSpaceRight]}
                          onPress={this.editClick}
                          onPressIn={() => {
                            this.setState({
                              namamenu_edit: data
                            })
                          }}
                          onPressOut={this.sendData}
                        >
                          <MaterialIcons name="edit" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.deleteButtonTable, styles.buttonSpaceLeft]}
                          onPressIn={() => {
                            this.setState({
                              namamenu_pesanan: data.nama_menu
                            })
                          }}
                          onPress={() => this.setDeleteVisible(!deleteVisible)}
                        >
                          <MaterialIcons name="delete" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        :
          <View>
            {this.state.DataTable.map((data, i) => {
              return(
                <View
                  key={i}
                  style={styles.tableRowContainer, styles.greyTableLine}
                >
                  <View style={styles.tableRowBox}>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Image style={{width: 100, height: 100}} source={{uri: CONSTANT.BASE_URL+ '/image/' + data.gambar_menu}} />
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Text style={styles.bodyText}>
                        {data.nama_menu}
                      </Text>
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      {data.diskon > 0 ?
                        <View>
                          <NumberFormat
                            renderText={(value) => <Text style={[styles.bodyText, {textDecorationLine: 'line-through'}]}>{value}</Text>}
                            value={data.harga_menu}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp'}
                          />
                          <NumberFormat
                            renderText={(value) => <Text style={[styles.bodyTextBold, styles.TextDanger]}>{value} ({data.diskon}%)</Text>}
                            value={data.harga_menu - (data.harga_menu * data.diskon / 100)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp'}
                          />
                        </View>
                      :
                        <NumberFormat
                          renderText={(value) => <Text style={styles.bodyText}>{value}</Text>}
                          value={data.harga_menu}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp'}
                        />
                      }
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <Text style={styles.bodyText}>
                        {data.nama_kategori}
                      </Text>
                    </View>
                    <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                      <View style={{justifyContent: 'flex-end'}}>
                        <View style={styles.comboBoxContainer}>
                          <Picker
                            selectedValue={data.ketersediaan_menu}
                            onValueChange={(itemValue, itemIndex) =>
                              this.changeKetersediaan(itemValue, data.id_menu)
                            }
                          >
                            <Picker.Item label='Tersedia' value='tersedia' />
                            <Picker.Item label='Tidak Tersedia' value='tidak tersedia' />
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        }
        {/* Table Row */}
        {this.props.authority == 'pemilik' ?
          <View style={{justifyContent: 'flex-end', padding: 30, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={this.tambahClick}
              style={{backgroundColor: '#000000', padding: 15, borderRadius: 5}}
            >
              <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TAMBAH MENU</Text>
            </TouchableOpacity>
          </View> : null }
      </View>
    );
  }
}

export default TabelDaftarMenu;
