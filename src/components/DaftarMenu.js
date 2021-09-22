import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	Image,
	ScrollView,
	ToastAndroid
} from 'react-native';
import {
	TabelDaftarMenu
} from '../components';
import { Picker } from '@react-native-community/picker';
import CurrencyInput from 'react-native-currency-input';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CameraRoll from "@react-native-community/cameraroll";
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class DaftarMenu extends React.Component {
	constructor(props) {
		super(props)
		this.showEditMeja = this.showEditMeja.bind(this);
		this.showTambahMeja = this.showTambahMeja.bind(this);
		this.state = {
			// EDIT
			namamenu_edit: [],
			editmenu: [],
			pictureIsEdited: false,
			// EDIT
			TabelMejaShown: true,
			ShowForm: false,
			EditMeja: false,
			TambahMeja: false,
			hargabefore: 0,
			kategoriVisible: false,
			gambarVisible: false,
			addVisible: false,
			editVisible: false,
			deleteVisible: false,
			photos: [],
			// Input Menu
			selected_image: null,
			namamenu: '',
			harga: 0,
			diskon: 0,
			kategorid: '',
			kategorimenupick: '',
			ketersediaan: 'tersedia',
			// Input Menu
			// Input Kategori
			namakategori: '',
			kategoricombopick: 'minuman',
			// Input Kategori
			kategorimenu: [],
			// Edit
			imenu_edit: '',
			gmenu_edit: '',
			hmenu_edit: 0,
			hmenu_editbefore: 0,
			kat_edit: '',
			nkat_edit: '',
			keter_edit: '',
			nama_edit: '',
			diskon_edit: 0,
		}
	}
	getKategori() {
			fetch(CONSTANT.BASE_URL+ '/kategori')
			.then(response => response.json())
			.then(res => {
				this.setState({
					kategorimenu: res
				})
			})
			.catch(error => {
				console.error(error)
			})
  }
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	callbackFunction = (childData) => {
		this.setState({
			namamenu_edit: childData,
			imenu_edit: childData.id_menu,
			gmenu_edit: childData.gambar_menu,
			hmenu_edit: childData.harga_menu,
			kat_edit: childData.id_kategori,
			nkat_edit: childData.nama_kategori,
			keter_edit: childData.ketersediaan_menu,
			nama_edit: childData.nama_menu,
			diskon_edit: childData.diskon,
		})
		console.log(childData)
	}
	setKategoriVisible = (visible) => {
		this.setState({kategoriVisible: visible})
	}
	setGambarVisible = (visible) => {
		this.setState({gambarVisible: visible})
	}
	setAddVisible = (visible) => {
		this.setState({addVisible: visible})
	}
	setEditVisible = (visible) => {
		this.setState({editVisible: visible})
	}
	showEditMeja() {
		this.setState({
			TabelMejaShown: false,
			ShowForm: true,
			EditMeja: true
		})
	}
	showTambahMeja() {
		this.setState({
			TabelMejaShown: false,
			ShowForm: true,
			TambahMeja: true
		})
	}
	_handleButtonPress = () => {
		setInterval(() => {
			CameraRoll.getPhotos({
				first: 20,
				assetType: 'Photos'
			})
			.then(r => {
				this.setState({photos: r.edges});
			})
		}, 3000)
	}
	toBase64(url) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = () => {
			var reader = new FileReader();
			reader.onloadend = () => {
				this.setState({
					selected_image: reader.result.toString().split(',')[1]
				})
			}
			reader.readAsDataURL(xhr.response);
		}
		xhr.open('GET', url);
		xhr.send();
	}
	selectImage(p) {
		this.toBase64(p.node.image.uri)
	}
	toBase64Edit(url) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = () => {
			var reader = new FileReader();
			reader.onloadend = () => {
				this.setState({
					gmenu_edit: reader.result.toString().split(',')[1]
				})
			}
			reader.readAsDataURL(xhr.response);
		}
		xhr.open('GET', url);
		xhr.send();
	}
	selectImageEdit(p) {
		this.setState({pictureIsEdited: true})
		this.toBase64Edit(p.node.image.uri)
	}
	addCategory() {
		fetch(CONSTANT.BASE_URL+ '/addCategory', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				namakategori: this.state.namakategori,
				jeniskategori: this.state.kategoricombopick
			})
		})
		.then(() => {
			this.getKategori();
		})
	}
	deleteCategory() {
    fetch(CONSTANT.BASE_URL+ '/deleteCategory', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				namakategori: this.state.namakategori
			})
		})
		.then(() => {
			this.getKategori();
		})
    ToastAndroid.show("Kategori menu berhasil dihapus.", ToastAndroid.SHORT);
  }
	uploadMenu() {
		if (this.state.selected_image == null && this.state.namamenu == null && this.state.harga == 0 && this.state.kategoriid == null) {
			ToastAndroid.show("Data belum dimasukkan!", ToastAndroid.SHORT);
		} else if (this.state.selected_image == null) {
			ToastAndroid.show("Tambahkan gambar menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else if (this.state.namamenu == null) {
			ToastAndroid.show("Tambahkan nama menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else if (this.state.harga == 0) {
			ToastAndroid.show("Tambahkan harga menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else if (this.state.kategoriid == null) {
			ToastAndroid.show("Tambahkan kategori menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else {
			this.setAddVisible(true);
		}
	}
	uploadMenuDone() {
		fetch(CONSTANT.BASE_URL+ '/addMenu', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        namamenu: this.state.namamenu,
				hargamenu: this.state.harga,
				kategorimenu: this.state.kategoriid,
				ketersediaan: this.state.ketersediaan,
				diskon: this.state.diskon,
				gambarmenu: this.state.selected_image,
      })
    })
		this.setState({
      TabelMejaShown: true,
      ShowForm: false,
      TambahMeja: false,
    });
		ToastAndroid.show(
      'Anda berhasil menambahkan menu pesanan ke dalam daftar menu pesanan!',
      ToastAndroid.SHORT,
    );
	}
	editMenu() {
		if (this.state.gmenu_edit == null && this.state.nama_edit == null && this.state.hmenu_edit == 0 && this.state.kat_edit == null) {
			ToastAndroid.show("Data belum dimasukkan!", ToastAndroid.SHORT);
		} else if (this.state.gmenu_edit == null) {
			ToastAndroid.show("Tambahkan gambar menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else if (this.state.nama_edit == null) {
			ToastAndroid.show("Tambahkan nama menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else if (this.state.hmenu_edit == 0) {
			ToastAndroid.show("Tambahkan harga menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else if (this.state.kat_edit == null) {
			ToastAndroid.show("Tambahkan kategori menu sebelum menambahkan menu!", ToastAndroid.SHORT);
		} else {
			this.setEditVisible(true);
		}
	}
	editMenuDone() {
		if (this.state.pictureIsEdited == false) {
			fetch(CONSTANT.BASE_URL+ '/editMenuNoPic', {
				method: 'POST',
				headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
					idmenu: this.state.imenu_edit,
					namamenu: this.state.nama_edit,
					hargamenu: this.state.hmenu_edit,
					kategorimenu: this.state.kat_edit,
					ketersediaan: this.state.keter_edit,
					diskon: this.state.diskon_edit,
				})
			})
			this.setState({
				TabelMejaShown: true,
				ShowForm: false,
				TambahMeja: false,
			});
			ToastAndroid.show('Anda telah berhasil mengubah menu pesanan!',ToastAndroid.SHORT,);
		} else {
			fetch(CONSTANT.BASE_URL+ '/editMenu', {
				method: 'POST',
				headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
					idmenu: this.state.imenu_edit,
					namamenu: this.state.nama_edit,
					hargamenu: this.state.hmenu_edit,
					kategorimenu: this.state.kat_edit,
					ketersediaan: this.state.keter_edit,
					diskon: this.state.diskon_edit,
					gambarmenu: this.state.gmenu_edit,
				})
			})
			this.setState({
				TabelMejaShown: true,
				ShowForm: false,
				TambahMeja: false,
			});
			ToastAndroid.show('Anda telah berhasil mengubah menu pesanan!',ToastAndroid.SHORT,);
		}
	}
	componentDidMount() {
		this.getKategori();
		this._handleButtonPress();
  }
	render() {
		const {kategoriVisible, gambarVisible, addVisible, editVisible} = this.state;
		return(
			<View>
				{/* Add */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={addVisible}
					onRequestClose={() => {
						this.setAddVisible(!addVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Tambah Menu</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>Apakah Anda yakin untuk menambahkan menu pesanan ini?</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setAddVisible(!addVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setAddVisible(!addVisible)}
									onPressOut={() => this.uploadMenuDone()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
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
					visible={editVisible}
					onRequestClose={() => {
						this.setEditVisible(!editVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Ubah Menu</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>Apakah Anda yakin untuk mengubah menu pesanan ini?</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setEditVisible(!editVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setEditVisible(!editVisible)}
									onPressOut={() => this.editMenuDone()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{/* Edit */}
				{/* Kategori */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={kategoriVisible}
					onRequestClose={() => {
						this.setKategoriVisible(!kategoriVisible)
					}}
				>
					<ScrollView>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Kategori Menu</Text>
							<View style={styles.marginTopTen}></View>
							<Text style={styles.bodyText}>Silahkan pilih kategori menu di bawah ini.</Text>
							<View style={styles.marginTopThirty}></View>
							{this.state.kategorimenu.map((item, i) => {
								return(
									<View key={i} style={{flexDirection: 'row', backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, marginBottom: 10}}>
										{this.state.EditMeja == true ?
										<TouchableOpacity
											style={[styles.inputFormJointKategori]}
											onPress={() => {
												this.setState({
													kat_edit: item.id_kategori,
													nkat_edit: item.nama_kategori,
												})
											}}
											onPressOut={() => {
												this.setKategoriVisible(!kategoriVisible)
											}}
										>
											<Text style={styles.buttonTextKategori}>
												{item.nama_kategori}
											</Text>
											<Text style={[styles.buttonTextKategori, styles.textGrey]}>
												{this.capitalizeFirstLetter(item.jenis_kategori)}
											</Text>
										</TouchableOpacity>
										:
										<TouchableOpacity
											style={[styles.inputFormJointKategori]}
											onPress={() => {
												this.setState({
													kategoriid: item.id_kategori,
													kategorimenupick: item.nama_kategori,
												})
											}}
											onPressOut={() => {
												this.setKategoriVisible(!kategoriVisible)
											}}
										>
											<Text style={styles.buttonTextKategori}>
												{item.nama_kategori}
											</Text>
											<Text style={[styles.buttonTextKategori, styles.textGrey]}>
												{this.capitalizeFirstLetter(item.jenis_kategori)}
											</Text>
										</TouchableOpacity>
										}
										<TouchableOpacity
											onPressIn={() => {
												this.setState({
													namakategori: item.nama_kategori
												})
											}}
											onPress={() => this.deleteCategory()}
											style={styles.deleteButtonJointKategori}
										>
											<MaterialIcons name="delete" size={28} color="#FFFFFF" />
										</TouchableOpacity>
									</View>
								);
							})}
							<View style={{marginBottom: 20}}></View>
							<View style={styles.horizontalLine}></View>
							<View>
								<Text style={styles.headerTextModal}>Tambah Kategori Menu</Text>
								<TextInput
									onChangeText={value => {
										this.setState({
											namakategori: value
										})
									}}
									style={styles.inputForm}
									placeholder="Kategori Menu"
								/>
								<View style={[styles.comboBoxContainer, styles.marginTopTwenty]}>
									<Picker
										selectedValue={this.state.kategoricombopick}
										onValueChange={(itemValue, itemIndex) =>
											this.setState({kategoricombopick: itemValue})
										}>
										<Picker.Item label='Minuman' value='minuman' />
										<Picker.Item label='Makanan' value='makanan' />
									</Picker>
								</View>
								<TouchableOpacity
									style={[styles.addButton, styles.marginTopTwenty]}
									onPress={() => this.addCategory()}
								>
									<Text style={styles.buttonText}>TAMBAH</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.cancelButton, styles.marginTopTwenty]}
									onPress={() => this.setKategoriVisible(!kategoriVisible)}
								>
									<Text style={styles.buttonText}>TUTUP</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					</ScrollView>
				</Modal>
				{/* Kategori */}
				{/* Photo Roll */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={gambarVisible}
					onRequestClose={() => {
						this.setGambarVisible(!gambarVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Pilih Gambar Menu</Text>
							<View style={styles.marginTopTen}></View>
							<Text style={styles.bodyText}>Silahkan pilih gambar di bawah ini untuk menambahkan gambar menu.</Text>
							<View style={{height: 400, width: '100%'}}>
								<ScrollView>
									<View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
									{this.state.photos.map((p, i) => {
										return(
											<View key={i}>
												{this.state.EditMeja == true ?
													<TouchableOpacity
														style={{marginTop: 30}}
														onPress={() => this.selectImageEdit(p)}
														onPressOut={() => this.setGambarVisible(!gambarVisible)}
													>
														<Image source={{uri: p.node.image.uri}} style={{width: 230, height: 230, marginRight: 20}} />
													</TouchableOpacity>
												:
													<TouchableOpacity
														style={{marginTop: 30}}
														onPress={() => this.selectImage(p)}
														onPressOut={() => this.setGambarVisible(!gambarVisible)}
													>
														<Image source={{uri: p.node.image.uri}} style={{width: 230, height: 230, marginRight: 20}} />
													</TouchableOpacity>
												}
											</View>
										);
									})}
									</View>
								</ScrollView>
							</View>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton]}
									onPress={() => this.setGambarVisible(!gambarVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>BATAL</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{/* Photo Roll */}
				{this.state.TabelMejaShown == true ?
					<View style={styles.headerWithInput}>
						<View style={{width: "50%"}}>
							<Text style={styles.headerTextBold}>Daftar Menu Pesanan</Text>
						</View>
						<View style={{width: "50%"}}>
							<TextInput
								placeholder="Cari menu pesanan..."
								style={styles.headerInputBox}
							/>
						</View>
					</View>
				: null }
				{this.state.TabelMejaShown == true ?
					<TabelDaftarMenu
						parentCallback={this.callbackFunction}
						showEditMeja={this.showEditMeja}
						showTambahMeja={this.showTambahMeja}
						authority={this.props.authority}
					/>
				: null}
				{/* Form */}
				{this.state.ShowForm == true ?
					<View>
						<View style={{paddingTop: 30, paddingLeft: 30, paddingRight: 30}}>
							{this.state.EditMeja == true ?
								<Text style={styles.headerTextBold}>Ubah Menu ({this.state.namamenu_edit.nama_menu})</Text>
							: this.state.TambahMeja == true ?
								<Text style={styles.headerTextBold}>Tambah Menu</Text>
							: null
							}
							<View style={styles.horizontalLine}></View>
						</View>
						<View style={{flexDirection: 'row'}}>
							<View style={styles.contSplitFivty}>
								{this.state.EditMeja == true ?
								<View>
									<Text style={styles.bodyTextBold}>Gambar Menu</Text>
									<View style={styles.marginTopTwenty}></View>
									<View style={{height: 230, flexGrow: 1, backgroundColor: '#D4D4D4', width: '100%'}}>
										<Image
											source={{uri: 'data:image/jpg;base64,' + this.state.gmenu_edit}}
											style={{height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute'}}
										/>
										{this.state.gmenu_edit != null ?
											<Image
												source={{uri: CONSTANT.BASE_URL+ '/image/' + this.state.gmenu_edit}}
												style={{height: 230, resizeMode: 'cover'}}
											/>
										: null
										}
									</View>
									<View style={{flexDirection: 'row'}}>
									{this.state.EditMeja == true ?
									<TouchableOpacity
										style={{padding: 15, borderBottomLeftRadius: 5, backgroundColor: '#68B7E3', alignItems: 'center', flexGrow: 1}}
										onPress={() => {
											this.setGambarVisible(!gambarVisible)
										}}
									>
										<MaterialIcons name="image" size={28} color="#FFFFFF" />
									</TouchableOpacity>
									:
									<TouchableOpacity
										style={{padding: 15, borderBottomLeftRadius: 5, backgroundColor: '#000000', alignItems: 'center', flexGrow: 1}}
										onPress={() => {
											this.setGambarVisible(!gambarVisible)
										}}
									>
										<MaterialIcons name="add-photo-alternate" size={28} color="#FFFFFF" />
									</TouchableOpacity>
									}
									<TouchableOpacity
										style={{padding: 15, borderBottomRightRadius: 5, backgroundColor: '#FF8675', alignItems: 'center'}}
										onPress={() => {
											if (this.state.gmenu_edit == null) {
												ToastAndroid.show("Tidak ada gambar yang dihapus.", ToastAndroid.SHORT);
											} else {
												this.setState({gmenu_edit: null})
											}
										}}
									>
										<MaterialIcons name="delete" size={28} color="#FFFFFF" />
									</TouchableOpacity>
									</View>
								</View>
								:
								<View>
									<Text style={styles.bodyTextBold}>Gambar Menu</Text>
									<View style={styles.marginTopTwenty}></View>
									<View style={{height: 230, flexGrow: 1, backgroundColor: '#D4D4D4'}}>
										{this.state.selected_image ?
											<Image
												source={{uri: 'data:image/jpg;base64,' + this.state.selected_image}}
												style={{height:230, resizeMode: 'cover'}}
											/>
										: null
										}
									</View>
									<View style={{flexDirection: 'row'}}>
									<TouchableOpacity
										style={{padding: 15, borderBottomLeftRadius: 5, backgroundColor: '#000000', alignItems: 'center', flexGrow: 1}}
										onPress={() => {
											this.setGambarVisible(!gambarVisible)
										}}
									>
										<MaterialIcons name="add-photo-alternate" size={28} color="#FFFFFF" />
									</TouchableOpacity>
									<TouchableOpacity
										style={{padding: 15, borderBottomRightRadius: 5, backgroundColor: '#FF8675', alignItems: 'center'}}
										onPress={() => {
											if (this.state.selected_image == null) {
												ToastAndroid.show("Tidak ada gambar yang dihapus.", ToastAndroid.SHORT);
											} else {
												this.setState({selected_image: null})
											}
										}}
									>
										<MaterialIcons name="delete" size={28} color="#FFFFFF" />
									</TouchableOpacity>
									</View>
								</View>
								}
								{this.state.EditMeja == true ?
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Nama Menu</Text>
									<TextInput
										placeholder="Nama Menu"
										value={this.state.nama_edit}
										style={styles.inputForm}
										onChangeText={(value) => {
											this.setState({nama_edit: value})
										}}
									/>
								</View>
								:
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Nama Menu</Text>
									<TextInput
										placeholder="Nama Menu"
										style={styles.inputForm}
										onChangeText={(value) => {
											this.setState({namamenu: value})
										}}
									/>
								</View>
								}
							</View>
							<View style={styles.contSplitFivty}>
								{this.state.EditMeja == true ?
								<View>
									<Text style={styles.bodyTextBold}>Harga Menu</Text>
									<CurrencyInput
										value={this.state.hmenu_edit}
										prefix="Rp"
										delimiter=","
										precision={0}
										style={styles.inputForm}
										onChangeText={(formattedValue) => {
											this.setState({
												hmenu_editbefore: Math.round(formattedValue.split(',').join("").split('Rp').join(""))
											})
										}}
										onChangeValue={(value) => {
											this.setState({
												hmenu_edit: value
											})
										}}
									/>
								</View>
								:
								<View>
									<Text style={styles.bodyTextBold}>Harga Menu</Text>
									<CurrencyInput
										value={this.state.harga}
										prefix="Rp"
										delimiter=","
										precision={0}
										style={styles.inputForm}
										onChangeText={(formattedValue) => {
											this.setState({
												hargabefore: Math.round(formattedValue.split(',').join("").split('Rp').join(""))
											})
										}}
										onChangeValue={(value) => {
											this.setState({
												harga: value
											})
										}}
									/>
								</View>
								}
								{this.state.EditMeja == true ?
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Kategori Menu</Text>
									<View style={styles.marginTopTwenty}></View>
									<View style={{flexDirection: 'row'}}>
										<TouchableOpacity
											style={styles.addButtonJoint}
											onPress={() => this.setKategoriVisible(!kategoriVisible)}
										>
											<Text style={styles.buttonText}>PILIH</Text>
										</TouchableOpacity>
										<TextInput
											style={[styles.inputFormJoint, styles.disabledForm]}
											placeholder={this.state.nkat_edit}
											editable={false}
										/>
									</View>
								</View>
								:
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Kategori Menu</Text>
									<View style={styles.marginTopTwenty}></View>
									<View style={{flexDirection: 'row'}}>
										<TouchableOpacity
											style={styles.addButtonJoint}
											onPress={() => this.setKategoriVisible(!kategoriVisible)}
										>
											<Text style={styles.buttonText}>PILIH</Text>
										</TouchableOpacity>
										<TextInput
											style={[styles.inputFormJoint, styles.disabledForm]}
											placeholder={this.state.kategorimenupick == null ? 'Pilih kategori menu' : this.state.kategorimenupick}
											editable={false}
										/>
									</View>
								</View>
								}
								{this.state.EditMeja == true ?
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Ketersediaan Menu</Text>
									<View style={[styles.comboBoxContainer, styles.marginTopTwenty]}>
										<Picker
											selectedValue={this.state.keter_edit}
											onValueChange={(itemValue, itemIndex) =>
												this.setState({keter_edit: itemValue})
											}>
											<Picker.Item label='Tersedia' value='tersedia' />
											<Picker.Item label='Tidak Tersedia' value='tidak tersedia' />
										</Picker>
									</View>
								</View>
								:
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Ketersediaan Menu</Text>
									<View style={[styles.comboBoxContainer, styles.marginTopTwenty]}>
										<Picker
											selectedValue={this.state.ketersediaan}
											onValueChange={(itemValue, itemIndex) =>
												this.setState({ketersediaan: itemValue})
											}>
											<Picker.Item label='Tersedia' value='tersedia' />
											<Picker.Item label='Tidak Tersedia' value='tidak tersedia' />
										</Picker>
									</View>
								</View>
								}
								{this.state.EditMeja == true ?
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Diskon Menu (%)</Text>
									<TextInput
										value={this.state.diskon_edit.toString()}
										keyboardType="numeric"
										placeholder="0 - 100"
										style={styles.inputForm}
										onChangeText={(value) => {
											this.setState({
												diskon_edit: value
											})
										}}
									/>
								</View>
								:
								<View style={styles.marginTopTwenty}>
									<Text style={styles.bodyTextBold}>Diskon Menu (%)</Text>
									<TextInput
										value={this.state.diskon.toString()}
										keyboardType="numeric"
										placeholder="0 - 100"
										style={styles.inputForm}
										onChangeText={(value) => {
											this.setState({
												diskon: value
											})
										}}
									/>
								</View>
								}
								<View style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
									{this.state.EditMeja == true ?
										<TouchableOpacity
											style={[styles.editButton, styles.formbuttonFortyFive]}
											onPress={() => this.editMenu()}
										>
											<Text style={styles.buttonText}>UBAH</Text>
										</TouchableOpacity>
									: this.state.TambahMeja == true ?
										<TouchableOpacity
											style={[styles.addButton, styles.formbuttonFortyFive]}
											onPress={() => this.uploadMenu()}
										>
											<Text style={styles.buttonText}>TAMBAH</Text>
										</TouchableOpacity>
									: null
									}
									<TouchableOpacity onPress={() => {
										this.setState({
											TabelMejaShown: true,
											ShowForm: false,
											TambahMeja: false,
											EditMeja: false
										})
									}} style={[styles.cancelButton, styles.formbuttonFortyFive]}>
									<Text style={[styles.buttonText]}>BATAL</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				: null}
				{/* Form */}
			</View>
		);
	}
}

export default DaftarMenu;
