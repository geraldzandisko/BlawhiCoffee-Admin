import React from 'react';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import {
	TabelRiwPembayaran
} from '../components';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import 'moment/locale/id'
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class RiwPembayaran extends React.Component {
	constructor(props) {
		super(props)
		this.showDetail = this.showDetail.bind(this);
		this.state = {
			DetailShown: false,
			TableShown: true,
			minmax: [],
			dari: new Date(),
			sampai: new Date(),
			HeadTable: ['PESANAN', 'HARGA', 'QTY', 'TOTAL HARGA'],
			DataTable: [],
			DataTableHead: [],
			showTable: false,
		}
	}
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	getDate() {
    fetch(CONSTANT.BASE_URL+ '/laporan/rpMinMax')
    .then(response => response.json())
    .then(res => {
      this.setState({
        minmax: res[0],
      })
    })
    .catch(error => {
      console.error(error)
    })
  }
	getDetailRiwayat(idpem) {
		let url_tujuan = CONSTANT.BASE_URL+ '/laporan/detailRiwayat?id='+idpem
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
	getDetailHeadRiwayat(idpem) {
		let url_tujuan = CONSTANT.BASE_URL+ '/laporan/detailHeadRiwayat?id='+idpem
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
	showDetail(data) {
		this.setState({
			TableShown: false,
			DetailShown: true
		})
		this.getDetailRiwayat(data.id_pemesanan)
		this.getDetailHeadRiwayat(data.id_pemesanan)
	}
	componentDidMount() {
		this.getDate();
	}
	render() {
		return(
			<View>
				{this.state.TableShown == true ?
					<View>
						<View>
						<Text style={[styles.headerTextBold, {textAlign: 'center', marginTop: 30}]}>Riwayat Pembayaran</Text>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 30}}>
							<View>
								<Text style={[styles.bodyTextBold, {textAlign: 'center'}]}>Dari tanggal</Text>
								<View style={styles.marginTopTen}></View>
								<DatePicker
									locale="id_ID"
									mode="date"
									androidVariant="nativeAndroid"
									minimumDate={moment(this.state.minmax.MIN).toDate()}
									maximumDate={moment(this.state.minmax.MAX).toDate()}
									date={moment(this.state.minmax.MIN).toDate()}
									onDateChange={date => {
										this.setState({
											dari: date,
										});
									}}
								/>
							</View>
							<View>
								<Text style={[styles.bodyTextBold, {textAlign: 'center'}]}>Sampai tanggal</Text>
								<View style={styles.marginTopTen}></View>
								<DatePicker
									locale="id_ID"
									mode="date"
									androidVariant="nativeAndroid"
									minimumDate={moment(this.state.minmax.MIN).toDate()}
									maximumDate={moment(this.state.minmax.MAX).toDate()}
									date={moment(this.state.minmax.MIN).toDate()}
									onDateChange={date => {
										this.setState({
											sampai: date,
										});
									}}
								/>
							</View>
						</View>
						<View style={{paddingLeft: 200, paddingRight: 200}}>
							<TouchableOpacity
								style={[styles.addButton, {marginLeft: 30, marginRight: 30, marginBottom: 30}]}
								onPress={() => {
									this.setState({showTable: true})
							}}>
								<Text style={styles.buttonText}>TAMPILKAN RIWAYAT PEMBAYARAN</Text>
							</TouchableOpacity>
						</View>
						<TabelRiwPembayaran showTable={this.state.showTable} showDetail={this.showDetail} dari={moment(this.state.dari).format("YYYY MM DD")} sampai={moment(this.state.sampai).format("YYYY MM DD")} />
					</View>
					: null
				}
				{this.state.DetailShown == true ?
					<View style={styles.viewPadding}>
						<Text style={styles.headerTextBold}>
							<Text>{moment(this.state.DataTableHead.tanggal).format("MMMM Do YYYY, HH:mm:ss")}</Text>
						</Text>
						<Text style={styles.headerText}>
							<Text>Pesanan {this.state.DataTableHead.nopesanan}, </Text>
							<Text>Meja {this.state.DataTableHead.nomeja}</Text>
						</Text>
						{this.state.DataTableHead.status == 'dibatalkan' ?
							<Text style={[styles.TextCancel, styles.headerTextBold, {fontWeight: 'bold'}]}>{this.capitalizeFirstLetter(this.state.DataTableHead.status)}</Text>
							:	this.state.DataTableHead.status == 'lunas' ?
								<Text style={[styles.TextGreen, styles.headerTextBold, {fontWeight: 'bold'}]}>{this.capitalizeFirstLetter(this.state.DataTableHead.status)}</Text>
							: null }
						<View style={styles.horizontalLine}></View>
						{/* Table Header */}
						<View style={[styles.tableHeaderContainer, styles.marginTopTwenty]}>
								{this.state.HeadTable.map((item, i) => {
								return(
									<View
										style={styles.tableHeaderBox}
										key={i}
									>
										{item == 'QTY' ?
											<Text style={[styles.bodyTextBold, styles.flexEndText]}>{item}</Text>
										: item == 'TOTAL HARGA' ?
											<Text style={[styles.bodyTextBold, styles.flexEndText]}>{item}</Text>
										: item == 'HARGA' ?
											<Text style={[styles.bodyTextBold, styles.flexEndText]}>{item}</Text>
										: <Text style={styles.bodyTextBold}>{item}</Text>
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
								style={[styles.tableRowContainer, styles.marginTopTwenty]}
							>
								<View style={styles.tableRowBox}>
									<View style={styles.tableRowEach}>
										{data.pesanan == 'Kopi Gratis' ?
										<Text style={[styles.bodyText, styles.TextDanger]}>
										{data.pesanan}
										</Text>
										: data.pesanan == 'Kopi Spesial' ?
										<Text style={[styles.bodyText, styles.TextDanger]}>
										{data.pesanan}
										</Text>
										:
										<Text style={[styles.bodyText, {color: '#000000'}]}>
										{data.pesanan}
										</Text>
										}
									</View>
									<View style={styles.tableRowEach}>
										<NumberFormat
											renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
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
											renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText, styles.textGrey]}>{value}</Text>}
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
						<View style={[styles.horizontalLine, styles.marginTopThirty]}></View>
						<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
							<View>
								<View>
									<Text style={styles.bodyTextBold}>JUMLAH PELANGGAN</Text>
									<View style={styles.marginTopTen}>
										<Text style={[styles.bodyText, styles.textGrey]}>{this.state.DataTableHead.pelanggan}</Text>
									</View>
								</View>
								{this.state.DataTableHead.status == 'lunas' ?
								<View style={{marginTop: 20}}>
									<Text style={[styles.bodyTextBold]}>UANG PEMBAYARAN</Text>
									<View style={styles.marginTopTen}>
										<NumberFormat
											renderText={(value) => <Text style={[styles.bodyText, styles.textGrey]}>{value}</Text>}
											value={this.state.DataTableHead.dibayar}
											displayType={'text'}
											thousandSeparator={true}
											prefix={'Rp'}
										/>
									</View>
								</View>
								: null }
								{this.state.DataTableHead.status == 'lunas' ?
								<View style={{marginTop: 20}}>
									<Text style={[styles.bodyTextBold]}>KEMBALIAN</Text>
									<View style={styles.marginTopTen}>
										<NumberFormat
											renderText={(value) => <Text style={[styles.bodyText, styles.textGrey]}>{value}</Text>}
											value={this.state.DataTableHead.kembalian}
											displayType={'text'}
											thousandSeparator={true}
											prefix={'Rp'}
										/>
									</View>
								</View>
								: null }
							</View>
							<View>
								<Text style={[styles.headerTextBold, styles.flexEndText]}>TOTAL</Text>
								<View style={styles.marginTopTen}>
									<NumberFormat
										renderText={(value) => <Text style={[styles.headerTextBold, styles.textGrey, styles.flexEndText]}>{value}</Text>}
										value={this.state.DataTableHead.total}
										displayType={'text'}
										thousandSeparator={true}
										prefix={'Rp'}
									/>
								</View>
							</View>
						</View>
						{this.state.DataTableHead.status == 'dibatalkan' ?
							<View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
							<View>
								<Text style={styles.bodyTextBold}>KELUHAN</Text>
								<View style={styles.marginTopTen}>
									<Text style={[styles.bodyText, styles.textGrey]}>{this.state.DataTableHead.keluhan}</Text>
								</View>
							</View>
						</View>
						: null
						}
						<TouchableOpacity
							style={[styles.cancelButton, styles.marginTopThirty]}
							onPress={() => {
								this.setState({
									TableShown: true,
									DetailShown: false
								})
							}}
						>
							<Text style={styles.buttonText}>KEMBALI</Text>
						</TouchableOpacity>
					</View>
				: null
				}
			</View>
		);
	}
}

export default RiwPembayaran;
