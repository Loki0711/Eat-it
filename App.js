import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fireDB } from './firebase';

import SignIn from './screens/login'
import SignUp from './screens/signup'
import UpdateProfile from './screens/updateprofile'
import MenuList from './screens/menulist'
import CartSummary from './screens/cartsummary'
import PaymentDetails from './screens/paymentdetails'


const Stack = createNativeStackNavigator();

export default function App() {
  return (<>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{
        headerStyle: { backgroundColor: 'purple' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
        <Stack.Screen component={SignIn} name="Login"></Stack.Screen>
        <Stack.Screen component={SignUp} name="SignUp"></Stack.Screen>
        <Stack.Screen component={UpdateProfile} name="UpdateProfile"></Stack.Screen>
        <Stack.Screen component={MenuList} name="MenuList"></Stack.Screen>
        <Stack.Screen component={CartSummary} name="CartSummary"></Stack.Screen>
        <Stack.Screen component={PaymentDetails} name="PaymentDetails"></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
