import React from 'react';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import DatePicker from 'react-native-date-picker';
import {
	TabelRiwPengeluaran
} from '../components';
import styles from '../styles/Android.style';
import moment from 'moment';
import CONSTANT from '../assets/constant';

class RiwPengeluaran extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dari: new Date(),
			minmax: [],
			sampai: new Date(),
			showTable: false
		}
	}
	getDate() {
    fetch(CONSTANT.BASE_URL+ '/laporan/rpeMinMax')
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
	componentDidMount() {
		this.getDate();
	}
	render() {
		return(
			<View>
				<View>
					<View>
					<Text style={[styles.headerTextBold, {textAlign: 'center', marginTop: 30}]}>Riwayat Pengeluaran</Text>
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
				</View>
				<View style={{paddingLeft: 200, paddingRight: 200}}>
					<TouchableOpacity
						style={[styles.addButton, {marginLeft: 30, marginRight: 30, marginBottom: 30}]}
						onPress={() => {
							this.setState({showTable: true})
						}}>
							<Text style={styles.buttonText}>TAMPILKAN RIWAYAT PENGELUARAN</Text>
					</TouchableOpacity>
				</View>
				<TabelRiwPengeluaran showTable={this.state.showTable} dari={moment(this.state.dari).format("YYYY MM DD")} sampai={moment(this.state.sampai).format("YYYY MM DD")} />
			</View>
		);
	}
}

export default RiwPengeluaran;
