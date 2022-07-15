import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'

import * as Location from 'expo-location'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'


import { addNewUser, updateUser , deleteUsers} from '../models/authentication'
import Background from '../components/background'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'

export default function RegisterScreen(props) {
    const navigation = useNavigation();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [contactNumber, setcontactNumber] = useState('')
    const [unitNumber, setUnitNumber] = useState('')
    const [streetName, setStreetName] = useState('')
    const [postalCode, setpostalCode] = useState('')
    const [city, setcity] = useState('')
    const [isUpdate, setisUdpate] = useState(false)
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const { route } = props
        const { isUpdate } = route.params
        if (isUpdate) {
            PopulateProfileDetails(isUpdate) 
        }  
    }, []);

    const PopulateProfileDetails = async (isUpdate) => {
        const strProfileDetails = await AsyncStorage.getItem("ProfileDetails")
        if (strProfileDetails !== null) {
         const ProfileDetails = JSON.parse(strProfileDetails)
         setName(ProfileDetails.Name)
         setEmail(ProfileDetails.Email)
         setPassword(ProfileDetails.Password)
         setcontactNumber(ProfileDetails.ContactNumber)
         setUnitNumber(ProfileDetails.DoorNumber)
         setStreetName(ProfileDetails.Street)
         setpostalCode(ProfileDetails.PostalCode)
         setcity(ProfileDetails.City)
         setisUdpate(isUpdate)
         setUserId(ProfileDetails.id)
        }
    }

    const onSignUpPressed = () => {
        if (name !== '' || email !== '' || password !== '' || contactNumber !== '' || unitNumber !== '' 
            || streetName !== '' || postalCode !== '' || city !== '') { 
            if (!validateEmail()) {
                Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter a Valid Email ID !!!!', position: 'bottom' });
                return
            }

            if (!validatePassword()) {
                Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter a Valid Password !!!!', position: 'bottom' });
                return
            }

            if (!validateMobile()) {
                Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter a Valid Contact Number !!!!', position: 'bottom' });
                return
            }

            const newuser = {
                City: city,
                ContactNumber: contactNumber,
                DoorNumber: unitNumber,
                Email: email,
                Name: name,
                Password: password,
                PostalCode: postalCode,
                Street: streetName
            }
            
            if (isUpdate) {
                updateUser(userId, newuser);
                Toast.show({ type: 'success', text1: 'Profile Updated Successfully !!!', text2: `${name}'s Profile Update`, position: 'bottom' });
                setTimeout(() => { navigation.navigate('MenuList') }, 2000)
            } else {
                addNewUser(newuser)
                Toast.show({ type: 'success', text1: 'Profile Created Successfully !!!', text2: `${name}'s Profile Created`, position: 'bottom' });
                setTimeout(() => { navigation.replace('Login') }, 2000)
            }
        } else {
            Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter all fields !!!!', position: 'bottom' });
        }
    }

    const validateEmail = () => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validatePassword = () => {
        const pwdRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
        return pwdRegex.test(password)
    }

    const validateMobile = () => {
        const mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
        return mobileRegex.test(contactNumber)
    }

    async  function  GetCurrentLocation () {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          Toast.show({ type: 'error', text1: 'Permission not granted !!!!', text2: 'Allow the app to use location service.' , position: 'bottom' });
        }
        let { coords, ...others } = await Location.getCurrentPositionAsync();
        if (coords) {
          const { latitude, longitude } = coords;
          let response = await Location.reverseGeocodeAsync({ latitude, longitude });
          for (let item of response) {
            setUnitNumber(item.streetNumber)
            setStreetName(item.street)
            setpostalCode(item.postalCode)
            setcity(item.city)
          }
        } else {
            Toast.show({ type: 'error', text1: 'Unable Find The Location !!', text2: 'Please enter the address !!!!' , position: 'bottom' });
        }
      };

    const onDeletePressed = () => {
        deleteUsers(userId)
        AsyncStorage.setItem("ProfileDetails", '')
        Toast.show({ type: 'success', text1: 'Profile Deleted Successfully !!!', text2: `Profile Deleted`, position: 'bottom' });
        setTimeout(() => { navigation.replace('Login') }, 2000)
    }

    return (
        <ScrollView>
            <Background image="../assets/signup.jpeg">
                <BackButton goBack={navigation.goBack} />
                <Header>Create Profile</Header>
                <TextInput
                    label="Name"
                    returnKeyType="next"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    label="Email"
                    returnKeyType="next"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />
                <TextInput
                    label="Password"
                    returnKeyType="done"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                />
                <TextInput
                    label="Contact Number"
                    returnKeyType="next"
                    value={contactNumber}
                    onChangeText={(text) => setcontactNumber(text)}
                />
                <Button
                    mode="contained"
                    onPress={GetCurrentLocation}
                    style={{ marginTop: 24 }}
                >
                    Get Location Details
                </Button>
                <TextInput
                    label="Door No./ Unit"
                    returnKeyType="next"
                    value={unitNumber}
                    onChangeText={(text) => setUnitNumber(text)}
                />
                <TextInput
                    label="Street"
                    returnKeyType="next"
                    value={streetName}
                    onChangeText={(text) => setStreetName(text)}
                />
                  <TextInput
                    label="Postal Code"
                    returnKeyType="next"
                    value={postalCode}
                    onChangeText={(text) => setpostalCode(text)}
                />
                  <TextInput
                    label="City"
                    returnKeyType="next"
                    value={city}
                    onChangeText={(text) => setcity(text)}
                />
                <Button
                    mode="contained"
                    onPress={onSignUpPressed}
                    style={{ marginTop: 24 }}
                >
                    {isUpdate ? 'Update Profile' : 'Sign Up'}
                </Button>
                {isUpdate && <Button
                    mode="contained"
                    onPress={onDeletePressed}
                    style={{ marginTop: 24, backgroundColor: 'red' }}
                >
                    Delete Profile
                </Button>}
                {!isUpdate &&<View style={styles.row}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>}
            </Background>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
})
