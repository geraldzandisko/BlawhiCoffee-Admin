import React from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Modal,
	ToastAndroid,
	TextInput,
	ScrollView
} from 'react-native';
import styles from '../styles/Android.style';
import {
	LoginForm
} from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-community/picker';
import CONSTANT from '../assets/constant';
import CameraRoll from "@react-native-community/cameraroll";

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			warunginfo: [],
			settingVisible: false,
			// Daftar Akun
			username: '',
			password: '',
			wewenang: 'pemilik',
			// Nama Warung Kopi
			namawarung: '',
			photos: [],
			// Logo and Cover
			logoVisible: false,
			selected_logo: null,
			selected_cover: null,
			coverVisible: false,
		}
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
	logoToBase64(url) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = () => {
			var reader = new FileReader();
			reader.onloadend = () => {
				this.setState({
					selected_logo: reader.result.toString().split(',')[1]
				})
			}
			reader.readAsDataURL(xhr.response);
		}
		xhr.open('GET', url);
		xhr.send();
	}
	coverToBase64(url) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = () => {
			var reader = new FileReader();
			reader.onloadend = () => {
				this.setState({
					selected_cover: reader.result.toString().split(',')[1]
				})
			}
			reader.readAsDataURL(xhr.response);
		}
		xhr.open('GET', url);
		xhr.send();
	}
	selectLogo(p) {
		this.logoToBase64(p.node.image.uri)
	}
	setLogo() {
		fetch(CONSTANT.BASE_URL+ '/editLogoWarung', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				gambarlogo: this.state.selected_logo,
			})
		})
		.then(() => {
			this.warungInfo();
		})
		.then(() => {
			this.setState({selected_logo: null})
		})
	}
	setCover() {
		fetch(CONSTANT.BASE_URL+ '/editCoverWarung', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				gambarcover: this.state.selected_cover,
			})
		})
		.then(() => {
			this.warungInfo();
		})
		.then(() => {
			this.setState({selected_cover: null})
		})
	}
	selectCover(p) {
		this.coverToBase64(p.node.image.uri)
	}
	setSettingVisible = (visible) => {
		this.setState({settingVisible: visible})
	}
	setLogoVisible = (visible) => {
		this.setState({logoVisible: visible})
	}
	setCoverVisible = (visible) => {
		this.setState({coverVisible: visible})
	}
	addUser() {
		if (this.state.username == '' && this.state.password == '') {
			ToastAndroid.show("Data belum dimasukkan sama sekali.", ToastAndroid.SHORT);
		}
		if (this.state.username == '') {
			ToastAndroid.show("Masukkan username sebelum mendaftarkan akun.", ToastAndroid.SHORT);
		}
		if (this.state.password == '') {
			ToastAndroid.show("Masukkan password sebelum mendaftarkan akun.", ToastAndroid.SHORT);
		}
		else {
			fetch(CONSTANT.BASE_URL+ '/addUser', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.state.username,
					password: this.state.password,
					wewenang: this.state.wewenang,
				})
			})
			this.textInputUsername.clear();
      this.textInputPassword.clear();
			ToastAndroid.show("Akun baru berhasil ditambahkan.", ToastAndroid.SHORT);
		}
	}
	editWarung() {
		if (this.state.namawarung == '') {
			ToastAndroid.show("Nama warung kopi belum dimasukkan.", ToastAndroid.SHORT);
		}
		else {
			fetch(CONSTANT.BASE_URL+ '/editWarungName', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.state.namawarung,
				})
			})
			.then(() => {
				this.warungInfo()
			})
			this.textInputWarung.clear();
			ToastAndroid.show("Nama warung kopi berhasil diubah.", ToastAndroid.SHORT);
		}
	}
	warungInfo() {
		fetch(CONSTANT.BASE_URL+ '/warunginfo')
    .then(response => response.json())
    .then(res => {
      this.setState({
      	warunginfo: res[0],
      })
    })
    .catch(error => {
      console.error(error)
    })
	}
	componentDidMount() {
		this.warungInfo();
		this._handleButtonPress();
	}
	render() {
		const {settingVisible, logoVisible, coverVisible} = this.state;
		return(
			<View style={styles.loginContainer}>
				{/* Cover */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={coverVisible}
					onRequestClose={() => {
						this.setCoverVisible(!coverVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Pilih Gambar Cover</Text>
							<View style={styles.marginTopTen}></View>
							<Text style={styles.bodyText}>Silahkan pilih gambar di bawah ini untuk mengubah cover.</Text>
							<View style={{height: 400, width: '100%'}}>
								<ScrollView>
									<View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
									{this.state.photos.map((p, i) => {
										return(
											<View key={i}>
												<TouchableOpacity
													style={{marginTop: 30}}
													onPress={() => this.selectCover(p)}
													onPressOut={() => this.setCoverVisible(!coverVisible)}
												>
													<Image source={{uri: p.node.image.uri}} style={{width: 230, height: 230, marginRight: 20}} />
												</TouchableOpacity>
											</View>
										);
									})}
									</View>
								</ScrollView>
							</View>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton]}
									onPress={() => this.setCoverVisible(!coverVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>BATAL</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{/* Cover */}
				{/* Logo */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={logoVisible}
					onRequestClose={() => {
						this.setLogoVisible(!logoVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Pilih Gambar Logo</Text>
							<View style={styles.marginTopTen}></View>
							<Text style={styles.bodyText}>Silahkan pilih gambar di bawah ini untuk mengubah logo.</Text>
							<View style={{height: 400, width: '100%'}}>
								<ScrollView>
									<View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
									{this.state.photos.map((p, i) => {
										return(
											<View key={i}>
												<TouchableOpacity
													style={{marginTop: 30}}
													onPress={() => this.selectLogo(p)}
													onPressOut={() => this.setLogoVisible(!logoVisible)}
												>
													<Image source={{uri: p.node.image.uri}} style={{width: 230, height: 230, marginRight: 20}} />
												</TouchableOpacity>
											</View>
										);
									})}
									</View>
								</ScrollView>
							</View>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton]}
									onPress={() => this.setLogoVisible(!logoVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>BATAL</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{/* Logo */}
				{/* Setting */}
				<Modal
					animationType="fade"
					transparent={true}
					visible={settingVisible}
					onRequestClose={() => {
						this.setSettingVisible(!settingVisible)
					}}
				>
					<ScrollView>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Pengaturan Aplikasi Pihak Warung Kopi</Text>
							<View style={styles.marginTopTwenty}></View>
							{/*  */}
							<View style={{flexDirection: 'row'}}>
								<View style={{width: '50%', paddingRight: 30}}>
									<Text style={styles.bodyText}>Ubah Logo Warung Kopi</Text>
									<View style={{marginTop: 20}}>
										{this.state.selected_logo ?
										<Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri: 'data:image/jpeg;base64,' + this.state.selected_logo}} />
										:
										<Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri: CONSTANT.BASE_URL+ '/image/' + this.state.warunginfo.logo_warung_kopi}} />
										}
										<View style={{flexDirection: 'row', marginTop: 20}}>
											<TouchableOpacity onPress={() => this.setLogoVisible(!logoVisible)} style={[styles.addButton, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}>
												<MaterialIcons name="add-photo-alternate" size={28} color="#FFFFFF" />
											</TouchableOpacity>
											{this.state.selected_logo == null ?
											<TouchableOpacity disabled={true} style={[styles.greyButton, {flexGrow: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
												<Text style={styles.buttonText}>UBAH LOGO</Text>
											</TouchableOpacity>
											:
											<TouchableOpacity onPress={() => this.setLogo()} style={[styles.editButton, {flexGrow: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
												<Text style={styles.buttonText}>UBAH LOGO</Text>
											</TouchableOpacity>
											}
										</View>
									</View>
									<View style={styles.marginTopTwenty}></View>
									<Text style={styles.bodyText}>Ubah Cover Warung Kopi</Text>
									<View style={{marginTop: 20}}>
										{this.state.selected_cover ?
										<Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri: 'data:image/jpeg;base64,' + this.state.selected_cover}} />
										:
										<Image style={{width: 100, height: 100, alignSelf: 'center'}} source={{uri: CONSTANT.BASE_URL+ '/image/' + this.state.warunginfo.cover_warung_kopi}} />
										}
										<View style={{flexDirection: 'row', marginTop: 20}}>
											<TouchableOpacity onPress={() => this.setCoverVisible(!coverVisible)} style={[styles.addButton, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]}>
												<MaterialIcons name="add-photo-alternate" size={28} color="#FFFFFF" />
											</TouchableOpacity>
											{this.state.selected_cover == null ?
											<TouchableOpacity disabled={true} style={[styles.greyButton, {flexGrow: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
												<Text style={styles.buttonText}>UBAH COVER</Text>
											</TouchableOpacity>
											:
											<TouchableOpacity onPress={() => this.setCover()} style={[styles.editButton, {flexGrow: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}>
												<Text style={styles.buttonText}>UBAH COVER</Text>
											</TouchableOpacity>
											}
										</View>
									</View>
								</View>
								<View style={{width: '50%', paddingLeft: 30}}>
									<Text style={styles.bodyText}>Daftar Akun</Text>
									<TextInput
										ref={input => {
											this.textInputUsername = input;
										}}
										onChangeText={value => {
											this.setState({username: value})
										}}
										style={styles.inputForm}
										placeholder="Nama Pengguna"
									/>
									<TextInput
										ref={input => {
											this.textInputPassword = input;
										}}
										onChangeText={value => {
											this.setState({password: value})
										}}
										secureTextEntry
										style={styles.inputForm}
										placeholder="Kata Sandi"
									/>
									<View style={[styles.comboBoxContainer, styles.marginTopTwenty]}>
									<Picker
										selectedValue={this.state.wewenang}
										onValueChange={(itemValue, itemIndex) =>
											this.setState({wewenang: itemValue})
										}>
										<Picker.Item label='Pemilik' value='pemilik' />
										<Picker.Item label='Kasir' value='kasir' />
									</Picker>
								</View>
								<TouchableOpacity onPress={() => this.addUser()} style={[styles.addButton, styles.marginTopTwenty]}>
									<Text style={styles.buttonText}>DAFTAR</Text>
								</TouchableOpacity>
								</View>
							</View>
							<View style={styles.marginTopTwenty}>
								<Text style={styles.bodyText}>Ubah Nama Warung Kopi</Text>
								<TextInput
									editable={false}
									style={[styles.inputForm, styles.disabledForm]}
									placeholder={this.state.warunginfo.nama_warung_kopi}
								/>
								<TextInput
									ref={input => {
										this.textInputWarung = input;
									}}
									onChangeText={value => {
										this.setState({namawarung: value})
									}}
									style={styles.inputForm}
									placeholder="Nama Warung Kopi"
								/>
								<TouchableOpacity onPress={() => this.editWarung()} style={[styles.editButton, styles.marginTopTwenty]}>
									<Text style={styles.buttonText}>UBAH NAMA WARUNG KOPI</Text>
								</TouchableOpacity>
							</View>
							{/*  */}
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={styles.cancelButton}
									onPress={() => this.setSettingVisible(!settingVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TUTUP</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					</ScrollView>
				</Modal>
				{/* Setting */}
				<View style={styles.loginRow}>
					<View style={{flexDirection: 'row'}}>
						<TouchableOpacity onPress={() => this.setSettingVisible(!settingVisible)} style={{backgroundColor: '#000000', padding: 15, borderRadius: 5, marginLeft: 20, marginTop: 20}}>
							<MaterialIcons color="#FFFFFF" name="settings" size={30} />
						</TouchableOpacity>
					</View>
					<View style={styles.loginInputContainer}>
						<View style={styles.loginLogoCenter}>
							<Image style={styles.loginLogo} source={{uri: CONSTANT.BASE_URL+ '/image/' + this.state.warunginfo.logo_warung_kopi}} />
						</View>
						<LoginForm gambarlogo={this.state.warunginfo.logo_warung_kopi} namawarung={this.state.warunginfo.nama_warung_kopi} />
					</View>
				</View>
				<View style={styles.loginRow}>
					<Image style={styles.loginPhoto} source={{uri: CONSTANT.BASE_URL+ '/image/' + this.state.warunginfo.cover_warung_kopi}} />
				</View>
			</View>
		);
	}
}

export default Login;
