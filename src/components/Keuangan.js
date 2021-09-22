import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';
import {
	TabelKeuangan
} from '../components';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import MonthPicker from 'react-native-month-year-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import styles from '../styles/Android.style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CONSTANT from '../assets/constant';

class Keuangan extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tahun: '',
			bulan: '',
			isDatePicked: false,
			datePicked: new Date(),
			tanggalDetail: new Date(),
			showPick: false,
			showPickA: true,
			minmax: [],
			laporanSummary: [],
			laporanSummaryDetail: [],
			showTable: false,
			showTableMain: false,
			HeadTableTahunBulan: ['TANGGAL', 'PEMASUKAN', 'PENGELUARAN', 'AKSI'],
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
	getSummary(date) {
		if (this.state.isDatePicked == false) {
			ToastAndroid.show("Masukkan tanggal terlebih dahulu sebelum menampilkan laporan pemasukan & pengeluaran.", ToastAndroid.SHORT);
		} else {
			fetch(CONSTANT.BASE_URL+ '/laporan/summaryKeuangan', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					date: date
				})
			})
			.then(response => response.json())
			.then(responseJson => {
				console.log(responseJson)
				this.setState({
					laporanSummary: [responseJson],
				})
			});
			this.setState({
				showTableMain: true,
				showTable: false,
			});
		}
  }
	getSummaryDetail(data) {
		fetch(CONSTANT.BASE_URL+ '/laporan/get', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				date: data
			})
		})
		.then(response => response.json())
		.then(responseJson => {
			console.log(responseJson)
			this.setState({
				laporanSummaryDetail: [responseJson],
			})
		})
  }
	componentDidMount() {
		this.getDate();
	}
	render() {
		const printPDF = async () => {
			const receipt = this.state.laporanSummary[0].detail.map((data) => {
				return(
					`<tr>
					<th>${moment(data.tanggal).format("L")}</th>
					<th class="textright">${data.totalpemasukan}</th>
          <th class="textright">${data.totalpengeluaran}</th>
					</tr>`
				);
			})
			const results = await RNHTMLtoPDF.convert({
				html:
				`<html>
				<style>
        .textright {
          text-align: right;
        }
					table {
            font-size: 1.3em;
						font-family: arial, sans-serif;
						border-collapse: collapse;
						width: 100%;
					}
          .try {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
          }
          .tryme {
            font-size: 2em;
            text-align: center;
          }
					td, th {
						border: 1px solid #dddddd;
						text-align: left;
						padding: 8px;
            font-weight: normal;
					}
					</style>
          <p class="try">${this.props.namawarung}</p>
					<p class="tryme">Laporan Pemasukan & Pengeluaran</p>
          <p class="tryme">Bulan ${moment(this.state.datePicked).format("MMMM")} / Tahun ${moment(this.state.datePicked).format("YYYY")}</p>
          <hr>
					<table style="width:100%">
						<tr>
							<th>Tanggal</th>
							<th class="textright">Pemasukan</th>
              <th class="textright">Pengeluaran</th>
						</tr>
						${receipt}
            <tr>
              <td><b>TOTAL</b></td>
              <td class="textright">${this.state.laporanSummary[0].total_pemasukan}</td>
              <td class="textright">${this.state.laporanSummary[0].total_pengeluaran}</td>
            <tr>
            <tr>
              <td><b>SALDO AKHIR</b></td>
              <td class="textright">${this.state.laporanSummary[0].total_pemasukan - this.state.laporanSummary[0].total_pengeluaran}</td>
              <td></td>
            <tr>
					</table>
				</html>`,
				fileName: 'test',
				base64: true,
			})
	
			await RNPrint.print({ filePath: results.filePath })
		}
		return(
			<View>
				<View>
					<View>
					<Text style={[styles.headerTextBold, {textAlign: 'center', marginTop: 30}]}>Laporan Pemasukan & Pengeluaran</Text>
					<Text style={[styles.headerText, {textAlign: 'center', marginBottom: 30}]}>
						<Text>Bulan</Text>
						{this.state.showPickA == true ?
							<Text> ___ </Text>
						: <Text> {moment(this.state.datePicked).format("MMMM")} </Text>
						}
						<Text> / </Text>
						<Text>Tahun</Text>
						{this.state.showPickA == true ?
							<Text> ___ </Text>
						: <Text> {moment(this.state.datePicked).format("YYYY")} </Text>
						}
					</Text>
					</View>
					{this.state.showTable == false ?
					<View style={{flexDirection: 'row', paddingLeft: 200, paddingRight: 200}}>
						<TouchableOpacity
							style={[styles.editButton, {marginBottom: 30, borderTopRightRadius: 0, borderBottomRightRadius: 0}]}
							onPress={() => {this.setState({showPick: true, isDatePicked: true})}}
						>
							<MaterialIcons name="date-range" size={28} color="#FFFFFF" />
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.addButton, {marginBottom: 30, flexGrow: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]}
							onPress={() => {
								this.getSummary(this.state.datePicked);
							}}
						>
							<Text style={styles.buttonText}>TAMPILKAN LAPORAN PEMASUKAN & PENGELUARAN</Text>
						</TouchableOpacity>
					</View>
					:
					<View style={{paddingLeft: 200, paddingRight: 200}}>
					<TouchableOpacity
						style={[styles.cancelButton, {marginBottom: 30}]}
						onPress={() => {
							this.getSummary(this.state.datePicked);
							this.setState({
								showTableMain: true,
								showTable: false,
							})
						}}
					>
						<Text style={styles.buttonText}>KEMBALI</Text>
					</TouchableOpacity>
					</View>
					}
					{this.state.showPick == true ?
					<MonthPicker
						onChange={(value, date) => {
							console.log(date)
							this.setState({
								datePicked: date,
								showPick: false,
								showPickA: false,
							});
						}}
						value={new Date()}
						minimumDate={moment(this.state.minmax.MIN).toDate()}
						maximumDate={moment(this.state.minmax.MAX).toDate()}
						locale="id"
					/>
					: null
					}
				</View>
				{this.state.showTableMain == true ?
				<View>
				<View style={[styles.tableHeaderContainer, styles.greyHeaderTable]}>
          {this.state.HeadTableTahunBulan.map((item, i) => {
            return(
              <View
                style={[styles.tableHeaderBox, styles.greyTablePaddingHeader]}
                key={i}
              >
                {item == 'AKSI' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                : item == 'PEMASUKAN' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                  : item == 'PENGELUARAN' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                  : <Text style={[styles.bodyTextBold, styles.greyHeaderColor]}>{item}</Text>
                }
              </View>
            );
          })}
          </View>
					{this.state.laporanSummary.map((data, i) => {
					return(
					<View key={i}>
					{data.detail.map((item, i) => {
					return(
					<View
						key={i}
          	style={styles.tableRowContainer, styles.greyTableLine}
          >
          	<View style={styles.tableRowBox}>
            	<View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              	<Text style={styles.bodyText}>
                	{moment(item.tanggal).format("L")}
                </Text>
              </View>
							<View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
								<NumberFormat
									renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
									value={item.totalpemasukan}
									displayType={'text'}
									thousandSeparator={true}
									prefix={'Rp'}
								/>
							</View>
							<View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
								<NumberFormat
									renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
									value={item.totalpengeluaran}
									displayType={'text'}
									thousandSeparator={true}
									prefix={'Rp'}
								/>
							</View>
							<View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
								<View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
									<TouchableOpacity
										style={[styles.addButtonTable, styles.buttonSpaceRight]}
										onPressIn={() => 
											{
												console.log(item.tanggal);
												this.setState({tanggalDetail: item.tanggal});
												this.getSummaryDetail(item.tanggal)
											}
										}
										onPress={() => this.setState({showTable: true, showTableMain: false})}
									>
										<Text style={styles.buttonText}>DETAIL</Text>
									</TouchableOpacity>
								</View>
							</View>
            </View>
            </View>
						);
						})}
						</View>
						);
						})}
						{/*  */}
						{this.state.laporanSummary.map((data, i) => {
						return(
						<View key={i} style={styles.tableRowContainer, styles.greyTableLine}>
            <View style={styles.tableRowBox}>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                <Text style={styles.bodyTextBold}>TOTAL</Text>
              </View>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                <NumberFormat
									renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
									value={data.total_pemasukan}
									displayType={'text'}
									thousandSeparator={true}
									prefix={'Rp'}
								/>
              </View>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                <NumberFormat
									renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
									value={data.total_pengeluaran}
									displayType={'text'}
									thousandSeparator={true}
									prefix={'Rp'}
								/>
              </View>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              </View>
            </View>
          </View>
					);
					})}
					{this.state.laporanSummary.map((data, i) => {
					return(
          <View key={i} style={styles.tableRowContainer, styles.greyTableLine}>
            <View style={styles.tableRowBox}>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                <Text style={styles.bodyTextBold}>SALDO AKHIR</Text>
              </View>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                <NumberFormat
									renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
									value={data.saldo_akhir}
									displayType={'text'}
									thousandSeparator={true}
									prefix={'Rp'}
								/>
              </View>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              </View>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              </View>
            	</View>
          	</View>
						);
						})}
						{/*  */}
						<View style={styles.viewPaddingLeftRight}>
            <TouchableOpacity
              onPress={printPDF}
              style={[styles.editButton, styles.marginTopThirty]}
            >
              <Text style={styles.buttonText}>CETAK LAPORAN PEMASUKAN & PENGELUARAN</Text>
            </TouchableOpacity>
          </View>
					</View>
					: null }
				<TabelKeuangan namawarung={this.props.namawarung} showTable={this.state.showTable} summaryDetail={this.state.laporanSummaryDetail} tanggal={this.state.datePicked} />
			</View>
		);
	}
}

export default Keuangan;
