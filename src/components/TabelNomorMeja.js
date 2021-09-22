import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ToastAndroid
} from 'react-native';
import styles from '../styles/Android.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CONSTANT from '../assets/constant';

class TabelNomorMeja extends React.Component {
  constructor(props) {
    super(props)
    this.editClick = this.editClick.bind(this);
    this.tambahClick = this.tambahClick.bind(this);
    this.state = {
      HeadTable: ['NOMOR MEJA', 'STATUS', 'JUMLAH PELANGGAN MAKSIMAL', 'AKSI'],
      DataTable: [],
      deleteTableVisible: false,
      nomormeja_edit: [],
      nomormeja: ''
    }
  }
  capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
  sendData = () => {
    this.props.parentCallback(this.state.nomormeja_edit);
  }
  setDeleteTableVisible = (visible) => {
		this.setState({deleteTableVisible: visible})
	}
  editClick() {
    this.props.showEditMeja();
  }
  tambahClick() {
    this.props.showTambahMeja();
  }
  deleteTable() {
    fetch(CONSTANT.BASE_URL+ '/deleteTable', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nomortable: this.state.nomormeja
			})
		})
    .then(() => {
      this.getMeja();
    })
    ToastAndroid.show("Nomor meja telah berhasil dihapus.", ToastAndroid.SHORT);
  }
  getMeja() {
    fetch(CONSTANT.BASE_URL+ '/nomormeja')
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
  componentDidMount() {
    this.getMeja();
  }
  render() {
    const {deleteTableVisible} = this.state;
    return(
      <View>
        {/* Modal Delete */}
        <Modal
					animationType="fade"
					transparent={true}
					visible={deleteTableVisible}
					onRequestClose={() => {
						this.setDeleteTableVisible(!deleteTableVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Hapus Nomor Meja</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>Apakah Anda yakin untuk menghapus nomor meja ini?</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setDeleteTableVisible(!deleteTableVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setDeleteTableVisible(!deleteTableVisible)}
                  onPressOut={() => this.deleteTable()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
        {/* Modal Delete */}
        {/* Table Header */}
        <View style={[styles.tableHeaderContainer, styles.greyHeaderTable]}>
          {this.state.HeadTable.map((item, i) => {
            return(
              <View
              style={[styles.tableHeaderBox, styles.greyTablePaddingHeader]}
              key={i}
              >
                {item == 'AKSI' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                : item == 'JUMLAH PELANGGAN MAKSIMAL' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText, {textAlign: 'right'}]}>{item}</Text>
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
              style={styles.tableRowContainer, styles.greyTableLine}
            >
              <View style={styles.tableRowBox}>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={[styles.bodyText, {fontSize: 20}]}>
                    {data.nomor_meja}
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  {data.ketersediaan_meja == 'kosong' ? 
                    <Text style={[styles.bodyText, {color: '#000000'}]}>
                      {this.capitalizeFirstLetter(data.ketersediaan_meja)}
                    </Text>
                  : data.ketersediaan_meja == 'aktif' ?
                    <Text style={[styles.bodyText, styles.TextWarning]}>
                      {this.capitalizeFirstLetter(data.ketersediaan_meja)}
                    </Text>
                  : data.ketersediaan_meja == 'tidak aktif' ?
                    <Text style={[styles.bodyText, styles.TextDanger]}>
                      {this.capitalizeFirstLetter(data.ketersediaan_meja)}
                    </Text>
                  : null
                  }
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={[styles.bodyText, styles.flexEndText]}>
                    {data.maksimal_pelanggan}
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                      style={[styles.editButtonTable, styles.buttonSpaceRight]}
                      onPress={() => {
                        if (data.ketersediaan_meja == 'aktif') {
                          ToastAndroid.show("Tidak dapat mengubah nomor meja ini karena status meja ini aktif.", ToastAndroid.SHORT);
                        } else {
                          this.editClick();
                        }
                      }}
                      onPressIn={() => {
                        this.setState({
                          nomormeja_edit: data
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
                          nomormeja: data.nomor_meja
                        })
                      }}
                      onPress={() => {{
                        if (data.ketersediaan_meja == 'aktif') {
                          ToastAndroid.show("Tidak dapat menghapus nomor meja ini karena status meja ini aktif.", ToastAndroid.SHORT);
                        } else {
                          this.setDeleteTableVisible(true);
                        }
                      }}}
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
        <View style={{justifyContent: 'flex-end', padding: 30, flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.tambahClick}
            style={{backgroundColor: '#000000', padding: 15, borderRadius: 5}}
          >
            <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TAMBAH NOMOR MEJA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default TabelNomorMeja;
