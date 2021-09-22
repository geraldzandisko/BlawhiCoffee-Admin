import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native';
import {TabelNomorMeja} from '../components';
import styles from '../styles/Android.style';
import {Picker} from '@react-native-community/picker';
import CONSTANT from '../assets/constant';

class PengaturanMeja extends React.Component {
  constructor(props) {
    super(props);
    this.showEditMeja = this.showEditMeja.bind(this);
    this.showTambahMeja = this.showTambahMeja.bind(this);
    this.state = {
      TabelMejaShown: true,
      ShowForm: false,
      EditMeja: false,
      TambahMeja: false,
      addVisible: false,
      editVisible: false,
      // Input
      nomormeja: '',
      jumlahpelanggan: 0,
      status: 'kosong',
      // Edit
      nomormeja_edit: [],
      // Edit Input
      idm_edit: '',
      nm_edit: '',
      mp_edit: 0,
      km_edit: '',
    };
  }
  setAddVisible = visible => {
    this.setState({addVisible: visible});
  };
  callbackFunction = childData => {
    this.setState({
      nomormeja_edit: childData,
      idm_edit: childData.id_nomor_meja,
      nm_edit: childData.nomor_meja,
      mp_edit: childData.maksimal_pelanggan,
      km_edit: childData.ketersediaan_meja
    });
    console.log(childData)
  };
  setEditVisible = visible => {
    this.setState({editVisible: visible});
  };
  showEditMeja() {
    this.setState({
      TabelMejaShown: false,
      ShowForm: true,
      EditMeja: true,
    });
  }
  showTambahMeja() {
    this.setState({
      TabelMejaShown: false,
      ShowForm: true,
      TambahMeja: true,
    });
  }
  KonfirmasiEditTable() {
    if (
      this.state.nm_edit == '' &&
      this.state.mp_edit <= 0 &&
      this.state.km_edit == ''
    ) {
      ToastAndroid.show('Data belum dimasukkan!', ToastAndroid.SHORT);
    } else if (
      this.state.nm_edit == '' &&
      this.state.mp_edit >= 0 &&
      this.state.km_edit != ''
    ) {
      ToastAndroid.show('Nomor meja belum dimasukkan!', ToastAndroid.SHORT);
    } else if (
      this.state.nm_edit != '' &&
      this.state.mp_edit >= 0 &&
      this.state.km_edit == ''
    ) {
      ToastAndroid.show(
        'Tolong masukkan status nomor meja!',
        ToastAndroid.SHORT,
      );
    } else if (
      this.state.nm_edit != '' &&
      this.state.mp_edit <= 0 &&
      this.state.km_edit != ''
    ) {
      ToastAndroid.show(
        'Tolong masukkan jumlah pelanggan maksimal untuk nomor meja ini!',
        ToastAndroid.SHORT,
      );
    } else {
      this.setEditVisible(true);
    }
  }
  KonfirmasiAddTable() {
    if (
      this.state.nomormeja == '' &&
      this.state.jumlahpelanggan <= 0 &&
      this.state.status == ''
    ) {
      ToastAndroid.show('Data belum dimasukkan!', ToastAndroid.SHORT);
    } else if (
      this.state.nomormeja == '' &&
      this.state.jumlahpelanggan >= 0 &&
      this.state.status != ''
    ) {
      ToastAndroid.show('Nomor meja belum dimasukkan!', ToastAndroid.SHORT);
    } else if (
      this.state.nomormeja != '' &&
      this.state.jumlahpelanggan >= 0 &&
      this.state.status == ''
    ) {
      ToastAndroid.show(
        'Tolong masukkan status nomor meja!',
        ToastAndroid.SHORT,
      );
    } else if (
      this.state.nomormeja != '' &&
      this.state.jumlahpelanggan <= 0 &&
      this.state.status != ''
    ) {
      ToastAndroid.show(
        'Tolong masukkan jumlah pelanggan maksimal untuk nomor meja ini!',
        ToastAndroid.SHORT,
      );
    } else {
      this.setAddVisible(true);
    }
  }
  AddTable() {
    fetch(CONSTANT.BASE_URL+ '/addTable', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomortable: this.state.nomormeja,
        jumlahpel: this.state.jumlahpelanggan,
        ketersediaan: this.state.status,
      }),
    });
    this.setState({
      TabelMejaShown: true,
      ShowForm: false,
      TambahMeja: false,
    });
    ToastAndroid.show(
      'Anda berhasil menambahkan nomor meja ke dalam daftar nomor meja!',
      ToastAndroid.SHORT,
    );
  }
  EditTable() {
    fetch(CONSTANT.BASE_URL+ '/editTable', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomortable: this.state.nm_edit,
        jumlahpel: this.state.mp_edit,
        ketersediaan: this.state.km_edit,
        nomorid: this.state.idm_edit,
      }),
    });
    this.setState({
      TabelMejaShown: true,
      ShowForm: false,
      EditMeja: false,
    });
    ToastAndroid.show('Nomor meja telah berhasil diubah!', ToastAndroid.SHORT);
  }
  render() {
    const {addVisible, editVisible} = this.state;
    return (
      <View>
        {/* Add */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={editVisible}
          onRequestClose={() => {
            this.setEditVisible(!editVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>
                Konfirmasi Ubah Nomor Meja
              </Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                Apakah Anda yakin untuk mengubah nomor meja ini?
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setEditVisible(!editVisible)}>
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
                  onPress={() => this.setEditVisible(!editVisible)}
                  onPressOut={() => this.EditTable()}>
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
        {/* Add */}
        {/* Edit */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={addVisible}
          onRequestClose={() => {
            this.setAddVisible(!addVisible);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.headerTextModal}>
                Konfirmasi Tambah Nomor Meja
              </Text>
              <View style={styles.marginTopTen}></View>
              <Text style={styles.bodyText}>
                Apakah Anda yakin untuk menambahkan nomor meja ini?
              </Text>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonSpaceRight]}
                  onPress={() => this.setAddVisible(!addVisible)}>
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
                  onPress={() => this.setAddVisible(!addVisible)}
                  onPressOut={() => this.AddTable()}>
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
        {/* Edit */}
        {this.state.TabelMejaShown == true ? (
          <View style={styles.headerWithInput}>
            <View style={{width: '50%'}}>
              <Text style={styles.headerTextBold}>Pengaturan Nomor Meja</Text>
            </View>
            <View style={{width: '50%'}}>
              <TextInput
                placeholder="Cari nomor meja..."
                style={styles.headerInputBox}
                onChangeText={value => {
                  this.searchMeja(value);
                }}
              />
            </View>
          </View>
        ) : null}
        {this.state.TabelMejaShown == true ? (
          <TabelNomorMeja
            parentCallback={this.callbackFunction}
            showEditMeja={this.showEditMeja}
            showTambahMeja={this.showTambahMeja}
          />
        ) : null}
        {/* Form */}
        {this.state.ShowForm == true ? (
          <View style={styles.viewPadding}>
            <View>
              {this.state.EditMeja == true ? (
                <Text style={styles.headerTextBold}>
                  Ubah Nomor Meja ({this.state.nomormeja_edit.nomor_meja})
                </Text>
              ) : this.state.TambahMeja == true ? (
                <Text style={styles.headerTextBold}>Tambah Nomor Meja</Text>
              ) : null}
              <View style={styles.horizontalLine}></View>
            </View>
            <View style={styles.marginTopTwenty}>
              <Text style={styles.bodyTextBold}>Nomor Meja</Text>
              {this.state.EditMeja == true ? (
                <View>
                  <TextInput
                    placeholder="Input nomor meja"
                    value={this.state.nm_edit}
                    style={styles.inputForm}
                    onChangeText={value => {
                      this.setState({nm_edit: value});
                    }}
                  />
                </View>
              ) : this.state.TambahMeja == true ? (
                <TextInput
                  placeholder="Input nomor meja"
                  style={styles.inputForm}
                  onChangeText={value => {
                    this.setState({nomormeja: value});
                  }}
                />
              ) : null}
            </View>
            <View style={styles.marginTopTwenty}>
              <Text style={styles.bodyTextBold}>Jumlah Pelanggan Maksimal</Text>
              {this.state.EditMeja == true ? (
                <View>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Input jumlah pelanggan maksimal"
                    value={this.state.mp_edit.toString()}
                    style={styles.inputForm}
                    onChangeText={value => {
                    	this.setState({mp_edit: parseInt(value)});
                    }}
                  />
                </View>
              ) : this.state.TambahMeja == true ? (
                <TextInput
                  keyboardType="numeric"
                  placeholder="Input jumlah pelanggan maksimal"
                  style={styles.inputForm}
                  onChangeText={value => {
                    this.setState({jumlahpelanggan: parseInt(value)});
                  }}
                />
              ) : null}
            </View>
            <View style={styles.marginTopTwenty}>
              <Text style={styles.bodyTextBold}>Status Nomor Meja</Text>
              {this.state.EditMeja == true ? (
                <View>
                      <View
                        style={[
                          styles.comboBoxContainer,
                          styles.marginTopTwenty,
                        ]}>
                        <Picker
                          selectedValue={this.state.km_edit}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({km_edit: itemValue})
                          }>
                          <Picker.Item label="Kosong" value="kosong" />
                          <Picker.Item
                            label="Tidak Aktif"
                            value="tidak aktif"
                          />
                        </Picker>
                      </View>
                </View>
              ) : this.state.TambahMeja == true ? (
                <View
                  style={[styles.comboBoxContainer, styles.marginTopTwenty]}>
                  <Picker
                    selectedValue={this.state.status}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({status: itemValue})
                    }>
                    <Picker.Item label="Kosong" value="kosong" />
                    <Picker.Item label="Tidak Aktif" value="tidak aktif" />
                  </Picker>
                </View>
              ) : null}
            </View>
            <View
              style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
              {this.state.EditMeja == true ? (
                <TouchableOpacity
                  style={[styles.editButton, styles.formbuttonFortyFive]}
                  onPress={() => {
                    this.KonfirmasiEditTable();
                  }}>
                  <Text style={styles.buttonText}>UBAH</Text>
                </TouchableOpacity>
              ) : this.state.TambahMeja == true ? (
                <TouchableOpacity
                  style={[styles.addButton, styles.formbuttonFortyFive]}
                  onPress={() => {
                    this.KonfirmasiAddTable();
                  }}>
                  <Text style={styles.buttonText}>TAMBAH</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    TabelMejaShown: true,
                    ShowForm: false,
                    TambahMeja: false,
                    EditMeja: false,
                  });
                }}
                style={[styles.cancelButton, styles.formbuttonFortyFive]}>
                <Text style={[styles.buttonText]}>BATAL</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {/* Form */}
      </View>
    );
  }
}

export default PengaturanMeja;
