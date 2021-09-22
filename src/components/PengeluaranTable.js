import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import NumberFormat from 'react-number-format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/Android.style';
import CONSTANT from '../assets/constant';

class PengeluaranTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      HeadTable: ['KETERANGAN', 'HARGA', 'AKSI'],
      DataTable: [],
      idpengeluaran: '',
    }
  }
  getPengeluaranNow() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL+ '/pengeluaran/getPengeluaranNow')
      .then(response => response.json())
      .then(res => {
        this.setState({
          DataTable: res
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  deletePengeluaran() {
    fetch(CONSTANT.BASE_URL+ '/pengeluaran/deletePengeluaran', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idpengeluaran: this.state.idpengeluaran
      })
    })
  }
  componentDidMount() {
    this.getPengeluaranNow();
  }
  render() {
    return(
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
              {this.props.authority == 'kasir' ?
                <View style={styles.tableRowBox}>
                  <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                    {data.jenis_pengeluaran == 'limit' ?
                      <Text style={[styles.bodyText, {color: '#000000'}]}>
                        {data.keterangan_pengeluaran}
                      </Text>
                    : data.jenis_pengeluaran == 'overlimit' ?
                      <Text style={[styles.bodyText, styles.TextDanger]}>
                        {data.keterangan_pengeluaran}
                      </Text>
                    : data.jenis_pengeluaran == 'admin' ?
                      <Text style={[styles.bodyText, styles.TextDanger, {fontWeight: 'bold'}]}>
                        {data.keterangan_pengeluaran}
                      </Text>
                    : null }
                  </View>
                  <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                    {data.jenis_pengeluaran == 'limit' ?
                      <NumberFormat
                        renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText, {color: '#000000'}]}>{value}</Text>}
                        value={data.harga_pengeluaran}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp'}
                      />
                    : data.jenis_pengeluaran == 'overlimit' ?
                      <NumberFormat
                        renderText={(value) => <Text style={[styles.bodyText, styles.TextDanger, styles.flexEndText]}>{value}</Text>}
                        value={data.harga_pengeluaran}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp'}
                      />
                    : data.jenis_pengeluaran == 'admin' ?
                      <NumberFormat
                        renderText={(value) => <Text style={[styles.bodyText, styles.TextDanger, styles.flexEndText, {fontWeight: 'bold'}]}>{value}</Text>}
                        value={data.harga_pengeluaran}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'Rp'}
                      />
                    : null }
                  </View>
                  <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <TouchableOpacity
                        style={styles.deleteButtonTable}
                        onPressIn={() => {
                          this.setState({
                            idpengeluaran: data.id_pengeluaran
                          })
                        }}
                        onPress={() => this.deletePengeluaran()}
                      >
                        <MaterialIcons name="delete" size={28} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              :
                <View style={styles.tableRowBox}>
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
                  <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <TouchableOpacity
                        style={styles.deleteButtonTable}
                        onPressIn={() => {
                          this.setState({
                            idpengeluaran: data.id_pengeluaran
                          })
                        }}
                        onPress={() => this.deletePengeluaran()}
                      >
                        <MaterialIcons name="delete" size={28} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> }
            </View>
          );
        })}
        {this.props.authority == 'kasir' ?
        <View style={styles.tableRowContainer, styles.greyTableLine}>
          <View style={styles.tableRowBox}>
            <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              <Text style={styles.bodyTextBold}>TOTAL (tanpa pengeluaran overlimit)</Text>
            </View>
            <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              {this.props.totalkasir == null ?
                <NumberFormat
                  renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                  value={0}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp'}
                />
              :
                <NumberFormat
                  renderText={(value) => <Text style={[styles.bodyText, styles.flexEndText]}>{value}</Text>}
                  value={this.props.totalkasir}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'Rp'}
                />
              }
            </View>
            <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
            </View>
          </View>
        </View>
        : null }
        {/* Table Row */}
      </View>
    );
  }
}

export default PengeluaranTable;
