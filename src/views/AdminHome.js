import React from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	Image,
	Modal,
	ToastAndroid
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import styles from '../styles/Android.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
	Dashboard,
	PengaturanMeja,
	HidanganKopiSpesial,
	PengaturanPengeluaran,
	Pembayaran,
	Pengeluaran,
	DaftarMenu,
	RiwPembayaran,
	RiwPengeluaran,
	Keuangan
} from '../components';
import * as RootNavigation from '../../RootNavigation';
import CONSTANT from '../assets/constant';

class AdminHome extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentMenu: 'home',
			transaksiStatus: 'off',
			laporanStatus: 'off',
			logoutVisible: false,
		}
	}
	setLogoutVisible = (visible) => {
		this.setState({logoutVisible: visible})
	}
	logOut() {
		fetch(CONSTANT.BASE_URL+ '/logout', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		RootNavigation.navigate('LoginScreen');
		ToastAndroid.show("Anda telah berhasil keluar!", ToastAndroid.SHORT);
	}
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	render() {
		const {logoutVisible} = this.state;
		const {route} = this.props;
		const {role} = route.params;
		const {namawarung} = route.params;
		const {gambarlogo} = route.params;
		return(
			<View style={styles.homeContainer}>
				<Modal
					animationType="fade"
					transparent={true}
					visible={logoutVisible}
					onRequestClose={() => {
						this.setLogoutVisible(!logoutVisible)
					}}
				>
					<View style={styles.modalBackground}>
						<View style={styles.modalBox}>
							<Text style={styles.headerTextModal}>Keluar dari Aplikasi</Text>
							<View style={styles.marginTopTen}></View>
								<Text style={styles.bodyText}>
									<Text>Apakah Anda yakin untuk keluar dari aplikasi? </Text>
									<Text style={styles.TextDanger}>Akan berdampak pada Aplikasi Pelayan dan Dapur apabila sedang jalan.</Text>
								</Text>
							<View style={{justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									style={[styles.cancelButton, styles.buttonSpaceRight]}
									onPress={() => this.setLogoutVisible(!logoutVisible)}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>TIDAK</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.addButton, styles.buttonSpaceLeft]}
									onPress={() => this.logOut()}
								>
									<Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>IYA</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				<View style={styles.homeRowLeft}>
					<View style={styles.logoHomeCenter}>
						<Image style={styles.homeLogo} source={{uri: CONSTANT.BASE_URL+ '/image/' + gambarlogo}} />
					</View>
					<TouchableOpacity
						onPress={() => {
							this.setState({
								currentMenu: 'home'
							})
						}}
						style={{marginBottom: 20}}
					>
						{this.state.currentMenu == 'home' ?
							<Text style={[styles.navigationText, styles.boldText]}>Home</Text> :
							<Text style={styles.navigationText}>Home</Text>
						}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this.setState({
								currentMenu: 'peng_meja'
							})
						}}
						style={{marginBottom: 20}}
					>
						{this.state.currentMenu == 'peng_meja' ?
							<Text style={[styles.navigationText, styles.boldText]}>Pengaturan Meja</Text> :
							<Text style={styles.navigationText}>Pengaturan Meja</Text>
						}
					</TouchableOpacity>
					{role == 'pemilik' ?
						<TouchableOpacity
							onPress={() => {
								this.setState({
									currentMenu: 'hidang_spesial'
								})
							}}
							style={{marginBottom: 20}}
						>
							{this.state.currentMenu == 'hidang_spesial' ?
								<Text style={[styles.navigationText, styles.boldText]}>Pengaturan Hidangan Kopi Spesial</Text> :
								<Text style={styles.navigationText}>Pengaturan Hidangan Kopi Spesial</Text>
							}
						</TouchableOpacity>
					: null }
					{role == 'pemilik' ?
						<TouchableOpacity
							onPress={() => {
								this.setState({
									currentMenu: 'peng_pengeluaran'
								})
							}}
							style={{marginBottom: 20}}
						>
							{this.state.currentMenu == 'peng_pengeluaran' ?
								<Text style={[styles.navigationText, styles.boldText]}>Pengaturan Pengeluaran</Text> :
								<Text style={styles.navigationText}>Pengaturan Pengeluaran</Text>
							}
						</TouchableOpacity>
					: null }
					<TouchableOpacity
						onPress={() => {
							if (this.state.transaksiStatus == 'off') {
								return this.setState({
									transaksiStatus: 'on'
								})
							}
							else if (this.state.transaksiStatus == 'on') {
								return this.setState({
									transaksiStatus: 'off'
								})
							} 
						}}
						style={{marginBottom: 20}}
					>
						{this.state.transaksiStatus == 'on' ?
							<View style={styles.navigationIconText}>
								<MaterialIcons name="expand-less" size={24} style={{marginRight: 10}} />
								<Text style={[styles.navigationText, styles.boldText]}>Transaksi</Text>
							</View> :
							<View style={styles.navigationIconText}>
								<MaterialIcons name="expand-more" size={24} style={{marginRight: 10}} />
								<Text style={styles.navigationText}>Transaksi</Text>
							</View>
						}
					</TouchableOpacity>
					{this.state.transaksiStatus == 'on' ?
						<View>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										currentMenu: 'pembayaran'
									})
								}}
								style={{marginBottom: 20}}
							>
								{this.state.currentMenu == 'pembayaran' ?
									<Text style={[styles.navigationText, styles.navigationTextSide, styles.boldText]}>Pembayaran</Text> :
									<Text style={[styles.navigationText, styles.navigationTextSide]}>Pembayaran</Text>
								}
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										currentMenu: 'pengeluaran'
									})
								}}
								style={{marginBottom: 20}}
							>
								{this.state.currentMenu == 'pengeluaran' ?
									<Text style={[styles.navigationText, styles.navigationTextSide, styles.boldText]}>Pengeluaran</Text> :
									<Text style={[styles.navigationText, styles.navigationTextSide]}>Pengeluaran</Text>
								}
							</TouchableOpacity>
						</View>
					: null}
					<TouchableOpacity
						onPress={() => {
							this.setState({
								currentMenu: 'daftar_menu'
							})
						}}
						style={{marginBottom: 20}}
					>
						{this.state.currentMenu == 'daftar_menu' ?
							<Text style={[styles.navigationText, styles.boldText]}>Daftar Menu Pesanan</Text> :
							<Text style={styles.navigationText}>Daftar Menu Pesanan</Text>
						}
					</TouchableOpacity>
					{role == 'pemilik' ?
						<View>
							<TouchableOpacity
								onPress={() => {
									if (this.state.laporanStatus == 'off') {
										return this.setState({
											laporanStatus: 'on'
										})
									}
									else if (this.state.laporanStatus == 'on') {
										return this.setState({
											laporanStatus: 'off'
										})
									}
								}}
								style={{marginBottom: 20}}
							>
								{this.state.laporanStatus == 'on' ?
									<View style={styles.navigationIconText}>
										<MaterialIcons name="expand-less" size={24} style={{marginRight: 10}} />
										<Text style={[styles.navigationText, styles.boldText]}>Laporan</Text>
									</View> :
									<View style={styles.navigationIconText}>
										<MaterialIcons name="expand-more" size={24} style={{marginRight: 10}} />
										<Text style={styles.navigationText}>Laporan</Text>
									</View>
								}
							</TouchableOpacity>
							{this.state.laporanStatus == 'on' ?
								<View>
									<TouchableOpacity
										onPress={() => {
											this.setState({
												currentMenu: 'riw_pembayaran'
											})
										}}
										style={{marginBottom: 20}}
									>
										{this.state.currentMenu == 'riw_pembayaran' ?
											<Text style={[styles.navigationText, styles.navigationTextSide, styles.boldText]}>Riwayat Pembayaran</Text> :
											<Text style={[styles.navigationText, styles.navigationTextSide]}>Riwayat Pembayaran</Text>
										}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											this.setState({
												currentMenu: 'riw_pengeluaran'
											})
										}}
										style={{marginBottom: 20}}
									>
										{this.state.currentMenu == 'riw_pengeluaran' ?
											<Text style={[styles.navigationText, styles.navigationTextSide, styles.boldText]}>Riwayat Pengeluaran</Text> :
											<Text style={[styles.navigationText, styles.navigationTextSide]}>Riwayat Pengeluaran</Text>
										}
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											this.setState({
												currentMenu: 'keuangan'
											})
										}}
										style={{marginBottom: 20}}
									>
										{this.state.currentMenu == 'keuangan' ?
											<Text style={[styles.navigationText, styles.navigationTextSide, styles.boldText]}>Laporan Pemasukan & Pengeluaran</Text> :
											<Text style={[styles.navigationText, styles.navigationTextSide]}>Laporan Pemasukan & Pengeluaran</Text>
										}
									</TouchableOpacity>
								</View>
							: null }
						</View>
					: null }
					<TouchableOpacity
						style={{marginBottom: 20}}
						onPress={() => this.setLogoutVisible(true)}
					>
						<Text style={[styles.navigationText, styles.boldText, styles.TextDanger]}>Keluar</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.homeRowRight}>
					<View style={styles.homeContent}>
						{this.state.currentMenu == 'home' ? <Dashboard authority={role} namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'peng_meja' ? <PengaturanMeja namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'hidang_spesial' ? <HidanganKopiSpesial namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'peng_pengeluaran' ? <PengaturanPengeluaran namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'pembayaran' ? <Pembayaran namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'pengeluaran' ? <Pengeluaran authority={role} /> : null}
						{this.state.currentMenu == 'daftar_menu' ? <DaftarMenu authority={role} /> : null}
						{this.state.currentMenu == 'riw_pembayaran' ? <RiwPembayaran namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'riw_pengeluaran' ? <RiwPengeluaran namawarung={namawarung} /> : null}
						{this.state.currentMenu == 'keuangan' ? <Keuangan namawarung={namawarung} /> : null}
						<View style={[styles.currentUserContainer, styles.viewPadding]}>
							<Text style={styles.bodyText}>
								<Text>Anda login sebagai:</Text>
								<Text style={styles.bodyTextBold}> {this.capitalizeFirstLetter(role)}</Text>
							</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

export default function(props) {
	const route = useRoute();

	return <AdminHome {...props} route={route} />;
}

