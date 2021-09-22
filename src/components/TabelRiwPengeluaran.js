import React from 'react';
import {
  View,
  Text
} from 'react-native';
import moment from 'moment';
import 'moment/locale/id'
import NumberFormat from 'react-number-format';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class TabelRiwPengeluaran extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      total: 375000,
      HeadTable: ['TANGGAL', 'KETERANGAN', 'HARGA'],
      DataTable: []
    }
  }
  showRiwayatPeng() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/laporan/riwayatPengeluaran', {
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
    this.showRiwayatPeng();
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
                  : item == 'HARGA' ?
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
                      {moment(data.tanggal_pengeluaran).format("L")}
                    </Text>
                  </View>
                  <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                    <Text style={styles.bodyText}>
                      {data.keterangan_pengeluaran}
                    </Text>
                  </View>
                  <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                    <NumberFormat
                      renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                      value={data.harga_pengeluaran}
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
        </View>
        : null }
      </View>
    );
  }
}

export default TabelRiwPengeluaran;
