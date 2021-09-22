import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import 'moment/locale/id'
import NumberFormat from 'react-number-format';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import styles from '../styles/Android.style';

class TabelKeuangan extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      HeadTableTahunBulan: ['TANGGAL', 'PEMASUKAN', 'TOTAL PEMASUKAN', 'PENGELUARAN', 'TOTAL PENGELUARAN'],
    }
  }
  capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
  render() {
    const printPDF = async () => {
			const receipt = this.props.summaryDetail[0].detail.map((data) => {
				return(
					`<tr>
					<th>${moment(data.tanggal).format("L")}</th>
					<th>${data.pemasukan}</th>
					<th class="textright">${data.totalpemasukan}</th>
					<th>${data.pengeluaran}</th>
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
          <p class="tryme">Bulan ${moment(this.props.tanggal).format("MMMM")} / Tahun ${moment(this.props.tanggal).format("YYYY")}</p>
          <hr>
					<table style="width:100%">
						<tr>
							<th>Tanggal</th>
							<th>Pemasukan</th>
							<th class="textright">Total Pemasukan</th>
							<th>Pengeluaran</th>
              <th class="textright">Total Pengeluaran</th>
						</tr>
						${receipt}
            <tr>
              <td></td>
              <td><b>TOTAL</b></td>
              <td class="textright">${this.props.summaryDetail[0].total_pemasukan}</td>
              <td></td>
              <td class="textright">${this.props.summaryDetail[0].total_pengeluaran}</td>
            <tr>
            <tr>
              <td></td>
              <td><b>SALDO AKHIR</b></td>
              <td class="textright">${this.props.summaryDetail[0].total_pemasukan - this.props.summaryDetail[0].total_pengeluaran}</td>
              <td></td>
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
        {this.props.showTable == true ?
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
                : item == 'TOTAL PEMASUKAN' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                  : item == 'TOTAL PENGELUARAN' ?
                  <Text style={[styles.bodyTextBold, styles.greyHeaderColor, styles.flexEndText]}>{item}</Text>
                  : <Text style={[styles.bodyTextBold, styles.greyHeaderColor]}>{item}</Text>
                }
              </View>
            );
          })}
          </View>
          {this.props.summaryDetail.map((data, i) => {
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
                      <Text style={styles.bodyText}>
                        {item.pemasukan}
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
                      <Text style={styles.bodyText}>
                        {item.pengeluaran}
                      </Text>
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
                  </View>
              </View>
              );
              })}
              </View>
            );
          })}
          {this.props.summaryDetail.map((data, i) => {
          return(
          <View key={i}>
          <View style={styles.tableRowContainer, styles.greyTableLine}>
            <View style={styles.tableRowBox}>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              </View>
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
            </View>
          </View>
          <View style={styles.tableRowContainer, styles.greyTableLine}>
            <View style={styles.tableRowBox}>
              <View style={[styles.tableRowEach, styles.greyTablePaddingRow]}>
              </View>
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
          </View>
          );
          })}
          </View>
          : null }
          {this.props.showTable == true ?
          <View style={styles.viewPaddingLeftRight}>
            <TouchableOpacity
              onPress={printPDF}
              style={[styles.editButton, styles.marginTopThirty]}
            >
              <Text style={styles.buttonText}>CETAK LAPORAN PEMASUKAN & PENGELUARAN</Text>
            </TouchableOpacity>
          </View>
          
          : null }
      </View>
    );
  }
}

export default TabelKeuangan;
