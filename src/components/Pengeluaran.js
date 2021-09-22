import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	ToastAndroid
} from 'react-native';
import {
	PengeluaranTable
} from '../components';
import moment from 'moment';
import 'moment/locale/id'
import NumberFormat from 'react-number-format';
import { Picker } from '@react-native-community/picker';
import CurrencyInput from 'react-native-currency-input';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class Pengeluaran extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			kategori: 'limit',
			tanggal: new Date(),
			keterangan: '',
			harga: 0,
			hargabefore: 0,
			DataTable: [
        {
          "keterangan": 'Data Keterangan',
          "harga": 'Data Harga',
          "kategoripengeluaran": 'limit'
        },
        {
          "keterangan": 'Data Keterangan',
          "harga": 'Data Harga',
          "kategoripengeluaran": 'overlimit'
        }
      ],
			konfirmasiVisible: false,
			updatePengeluaran: [],
			totalKasir: []
		}
	}
	getTotalKasir() {
		setInterval(() => {
			fetch(CONSTANT.BASE_URL+ '/pengeluaran/totPengeluaranKasir')
			.then(response => response.json())
			.then(res => {
				this.setState({
					totalKasir: res[0]
				})
			})
			.catch(error => {
				console.error(error)
			})
		}, 3000)
	}
	updatePengeluaran() {
		fetch(CONSTANT.BASE_URL+ '/pengeluaran/details?id_pengaturan=1')
		.then(response => response.json())
		.then(res => {
			console.log(res)
			this.setState({
				updatePengeluaran: res[0]
			})
		})
		.catch(error => {
			console.error(error)
		})
  }
	setKonfirmasiVisible = (visible) => {
		this.setState({konfirmasiVisible: visible})
	}
	konfirmasiPeng() {
		if (this.state.DataTable == 0) {
			ToastAndroid.show("Tidak dapat melakukan konfirmasi pengeluaran karena tidak ada data pengeluaran!", ToastAndroid.SHORT);
		} else {
			this.setKonfirmasiVisible(true);
		}
	}
	sendPengeluaran() {
		if (this.props.authority == 'pemilik') {
			fetch(CONSTANT.BASE_URL+ '/pengeluaran/confPengAdmin', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		} else if (this.props.authority == 'kasir') {
			fetch(CONSTANT.BASE_URL+ '/pengeluaran/confPengKasir', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		}
		ToastAndroid.show("Data pengeluaran berhasil ditambahkan untuk hari ini.", ToastAndroid.SHORT);
	}
	addAdmin() {
		if (this.state.keterangan == '' && this.state.harga == 0) {
			ToastAndroid.show("Data belum dimasukkan sama sekali!", ToastAndroid.SHORT);
		} else if (this.state.keterangan == '') {
			ToastAndroid.show("Keterangan pengeluaran belum dimasukkan!", ToastAndroid.SHORT);
		} else if (this.state.harga == 0) {
			ToastAndroid.show("Harga pengeluaran belum dimasukkan!", ToastAndroid.SHORT);
		} else {
			fetch(CONSTANT.BASE_URL+ '/pengeluaran/addPengAdmin', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					keterangan: this.state.keterangan,
					harga: this.state.harga
				})
			})
		}
	}
	addKasir() {
		console.log(this.state.harga + this.state.totalKasir.TotalKonfirmasi)
		console.log(this.state.harga + this.state.totalKasir.TotalPending)
		console.log(this.state.updatePengeluaran.maksimal_pengeluaran)
		if (this.state.keterangan == '' && this.state.harga == 0) {
			ToastAndroid.show("Data belum dimasukkan sama sekali!", ToastAndroid.SHORT);
		} else if (this.state.keterangan == '') {
			ToastAndroid.show("Keterangan pengeluaran belum dimasukkan!", ToastAndroid.SHORT);
		} else if (this.state.harga == 0) {
			ToastAndroid.show("Harga pengeluaran belum dimasukkan!", ToastAndroid.SHORT);
		} else if (this.state.kategori == 'limit' && this.state.harga + this.state.totalKasir.TotalKonfirmasi > this.state.updatePengeluaran.maksimal_pengeluaran) {
			ToastAndroid.show("Pengeluaran yang Anda masukkan akan melebihi maksimal pengeluaran per hari yang telah ditentukan!", ToastAndroid.SHORT);
		} else if (this.state.kategori == 'limit' && this.state.harga + (this.state.totalKasir.TotalPending + this.state.totalKasir.TotalKonfirmasi) > this.state.updatePengeluaran.maksimal_pengeluaran) {
			ToastAndroid.show("Pengeluaran yang Anda masukkan akan melebihi maksimal pengeluaran per hari yang telah ditentukan!", ToastAndroid.SHORT);
		} else {
			fetch(CONSTANT.BASE_URL+'/pengeluaran/addPengKasir', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					keterangan: this.state.keterangan,
					harga: this.state.harga,
					jenis: this.state.kategori,
				})
			})
		}
	}
	componentDidMount() {
		this.getTotalKasir();
		this.updatePengeluaran();
	}
	render() {
		const {konfirmasiVisible} = this.state;
		return(
			<View>
				<Modal
					animationType="fade"
					transparent={true}
					visible={konfirmasiVisible}
					onRequestClose={() => {
						this.setKonfirmasiVisible(!konfirmasiVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Konfirmasi Pengeluaran</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>Apakah Anda sudah yakin dengan data yang sudah dimasukkan?</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setKonfirmasiVisible(!konfirmasiVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.setKonfirmasiVisible(!konfirmasiVisible)}
									onPressOut={() => this.sendPengeluaran()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				{this.props.authority == 'pemilik' ?
					<View style={styles.viewPadding}>
						<Text style={styles.headerTextBold}>Pengeluaran, {moment(this.state.tanggal).format("MMMM Do YYYY")}</Text>
					</View>
					:
					<View style={styles.viewPadding}>
						<Text style={styles.headerTextBold}>Pengeluaran, {moment(this.state.tanggal).format("MMMM Do YYYY")}</Text>
						<Text style={styles.headerText}>
							<Text>Total pengeluaran maksimal per hari,</Text>
							<NumberFormat
								renderText={(value) => <Text> {value}</Text>}
								value={this.state.updatePengeluaran.maksimal_pengeluaran}
								displayType={'text'}
								thousandSeparator={true}
								prefix={'Rp'}
							/>
						</Text>
					</View>
				}
				<PengeluaranTable authority={this.props.authority} totalkasir={this.state.totalKasir.TotalKonfirmasi} />
				{this.props.authority == 'pemilik' ?
					<View style={styles.viewPadding}>
						<Text style={styles.headerTextBold}>Masukkan Pengeluaran</Text>
						<View style={styles.additionalFormContainer}>
							<TextInput
								placeholder="Keterangan"
								style={[styles.inputForm, styles.formbuttonFortyFive]}
								onChangeText={(value) => {
									this.setState({
										keterangan: value
									})
								}}
							/>
							<CurrencyInput
								// ref={input => {this.textInput = input}}
								value={this.state.harga}
								prefix="Rp"
								delimiter=","
								precision={0}
								style={[styles.inputForm, styles.formbuttonFortyFive]}
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
						<View style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
							<TouchableOpacity
								style={[styles.greyButton, styles.formbuttonHunned]}
								onPress={() => this.addAdmin()}
							>
								<Text style={styles.buttonText}>SIMPAN</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
							<TouchableOpacity
								style={[styles.addButton, styles.formbuttonHunned]}
								onPress={() => this.konfirmasiPeng()}
							>
								<Text style={styles.buttonText}>KONFIRMASI PENGELUARAN</Text>
							</TouchableOpacity>
						</View>
					</View>
				:
					<View style={styles.viewPadding}>
						<Text style={styles.headerTextBold}>Masukkan Pengeluaran</Text>
						<View style={styles.additionalFormContainer}>
							<TextInput
								placeholder="Keterangan"
								style={[styles.inputForm, styles.formbuttonFortyFive]}
								onChangeText={(value) => {
									this.setState({
										keterangan: value
									})
								}}
							/>
							<CurrencyInput
								// ref={input => {this.textInput = input}}
								value={this.state.harga}
								prefix="Rp"
								delimiter=","
								precision={0}
								style={[styles.inputForm, styles.formbuttonFortyFive]}
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
						<View style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
							<View style={[styles.comboBoxContainer, styles.formbuttonFortyFive]}>
								<Picker
									selectedValue={this.state.kategori}
									onValueChange={(itemValue, itemIndex) =>
										this.setState({kategori: itemValue})
									}>
									<Picker.Item label='Limit' value='limit' />
									<Picker.Item label='Overlimit' value='overlimit' />
								</Picker>
							</View>
							<TouchableOpacity
								style={[styles.greyButton, styles.formbuttonFortyFive]}
								onPress={() => this.addKasir()}
							>
								<Text style={styles.buttonText}>SIMPAN</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles.additionalFormContainer, styles.marginTopTwenty]}>
							<TouchableOpacity
								style={[styles.addButton, styles.formbuttonHunned]}
								onPress={() => this.konfirmasiPeng()}
							>
								<Text style={styles.buttonText}>KONFIRMASI PENGELUARAN</Text>
							</TouchableOpacity>
						</View>
					</View>
				}
			</View>
		);
	}
}

export default Pengeluaran;
