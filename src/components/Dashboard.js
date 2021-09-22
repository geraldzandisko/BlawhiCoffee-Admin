import React from 'react';
import {
	View,
  Text
} from 'react-native';
import styles from '../styles/Android.style';
import {
  DashboardTable,
  TimeNow
} from '../components';
import CONSTANT from '../assets/constant';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderansekarang: [],
    }
  }
  getOrder() {
    setInterval(() => {
      fetch(CONSTANT.BASE_URL + '/pesanan/pesananToday')
      .then(response => response.json())
      .then(res => {
        this.setState({
          orderansekarang: res
        })
      })
      .catch(error => {
        console.error(error)
      })
    }, 3000)
  }
  componentDidMount() {
    this.getOrder();
  }
	render() {
		return(
			<View style={{padding: 30}}>
        <TimeNow />
        <View style={styles.horizontalLine}></View>
        <View style={styles.dashboardTableContainer}>
          <Text style={styles.bodyTextBold}>Meja Yang Sedang Aktif</Text>
          <View style={styles.horizontalLine}></View>
          <DashboardTable orderansekarang={this.state.orderansekarang} />
        </View>
      </View>
		);
	}
}

export default Dashboard;
