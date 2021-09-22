import React from 'react';
import {
  View,
  Text
} from 'react-native';
import moment from 'moment';
import 'moment/locale/id'
import NumberFormat from 'react-number-format';
import styles from '../styles/Android.style';

class DashboardTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      HeadTable: ['NOMOR MEJA', 'WAKTU PESAN', 'TOTAL'],
      DataTable: []
    }
  }
  
  render() {
    return(
      <View>
        {/* Table Header */}
        <View style={[styles.tableHeaderContainer, styles.marginTopTwenty]}>
          {this.state.HeadTable.map((item, i) => {
            return(
              <View
              style={styles.tableHeaderBox}
              key={i}
              >
                {item == 'TOTAL' ?
                <Text style={[styles.bodyTextBold, styles.flexEndText]}>{item}</Text>
                :
                <Text style={styles.bodyTextBold}>{item}</Text>
                }
              </View>
            );
          })}
        </View>
        {/* Table Header */}
        {/* Table Row */}
        {this.props.orderansekarang.map((data, i) => {
          return(
            <View
            key={i}
            style={[styles.tableRowContainer, styles.marginTopTwenty]}
            >
              <View style={styles.tableRowBox}>
                <View style={styles.tableRowEach}>
                  <Text style={[styles.bodyText]}>
                    {data.nomor_meja}
                  </Text>
                </View>
                <View style={styles.tableRowEach}>
                  <Text style={[styles.bodyText]}>
                    {moment(data.tanggal_pemesanan).format('hh:mm:ss')}
                  </Text>
                </View>
                <View style={styles.tableRowEach}>
                  <NumberFormat
                    renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                    value={data.harga_total}
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
    );
  }
}

export default DashboardTable;
