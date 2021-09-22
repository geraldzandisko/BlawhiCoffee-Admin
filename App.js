import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  View,
	Dimensions,
	LogBox,
	PermissionsAndroid
} from 'react-native';
import {
  Login,
	AdminHome
} from './src/views'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';

LogBox.ignoreLogs([
	'Warning: Can',
	'Please report: Exce'
]);

const screenHeight = Dimensions.get('window').height;
const Stack = createStackNavigator();

const requestStorage = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Aplikasi Pihak Warung Kopi Storage Permission",
        message: "Aplikasi Pihak Warung Kopi needs access to your storage",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Storage permission accepted");
    } else {
      console.log("Storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

function AppRun() {
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator initialRouteName="LoginScreen">
				<Stack.Screen
					name="LoginScreen"
					component={Login}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="AdminScreen"
					component={AdminHome}
					options={{
						title: "Aplikasi Pihak Warung Kopi",
						headerStyle: {
							height: 60,
						},
						headerTitleStyle: {
							fontSize: 22,
							alignSelf: 'center'
						},
						headerLeft: null
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

function App() {
	useEffect(() => {
		requestStorage()
	}, [])
  return (
		<View>
			<StatusBar />
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
			>
				<View style={{height: screenHeight + 1500}}>
					<AppRun />
				</View>
			</ScrollView>
		</View>
  );
};

export default App;
