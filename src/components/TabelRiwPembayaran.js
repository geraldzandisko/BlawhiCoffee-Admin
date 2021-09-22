import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import 'moment/locale/id'
import NumberFormat from 'react-number-format';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class TabelRiwPembayaran extends React.Component {
  constructor(props) {
    super(props)
    this.simpanClick = this.simpanClick.bind(this);
    this.state = {
      HeadTable: ['TANGGAL', 'PESANAN', 'MEJA', 'TOTAL', 'STATUS PESANAN', 'AKSI'],
      DataTable: [],
    }
  }
  simpanClick(data) {
    this.props.showDetail(data);
  }
  capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
  showRiwayat() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/laporan/riwayatPembayaran', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          begin: this.props.dari,
          end: this.props.sampai,
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          DataTable: responseJson
        })
      })
    }, 3000)
  }
  componentDidMount() {
    console.log(this.props.dari)
    console.log(this.props.sampai)
    this.showRiwayat();
  }
  render() {
    return(
      <View>
        {this.props.showTable == true ?
        <View>
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
                  : item == 'TOTAL' ?
                    <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
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
                    <Text style={styles.bodyText}>
                    {moment(data.tanggal_pemesanan).format("L")}
                    </Text>
                  </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={styles.bodyText}>
                    {data.nomor_pemesanan}
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={styles.bodyText}>
                    {data.nomor_meja}
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <NumberFormat
                    renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                    value={data.harga_total}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp'}
                  />
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <Text style={styles.bodyText}>
                    {data.status_pemesanan == 'lunas' ? 
                      <Text style={[styles.bodyText, styles.TextGreen]}>
                        {this.capitalizeFirstLetter(data.status_pemesanan)}
                      </Text>
                    : data.status_pemesanan == 'dibatalkan' ?
                      <Text style={[styles.bodyText, styles.TextCancel]}>
                        {this.capitalizeFirstLetter(data.status_pemesanan)}
                      </Text>
                    : null
                    }
                  </Text>
                </View>
                <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity
                    style={[styles.addButtonTable, styles.buttonSpaceRight]}
                    onPress={() => this.simpanClick(data)}
                  >
                    <Text style={styles.buttonText}>DETAIL</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {/* Table Row */}
        </View>
        : null }
      </View>
    );
  }
}

export default TabelRiwPembayaran;
