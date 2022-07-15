import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'



import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import Background from '../components/background'
import { theme } from '../core/theme'



const PaymentDetails = () => {
    const [name, setName] = useState('');
    const [contactNumber, setcontactNumber] = useState('');
    const [unitNumber, setUnitNumber] = useState('')
    const [streetName, setStreetName] = useState('')
    const [postalCode, setpostalCode] = useState('')
    const [city, setcity] = useState('')
    const [CardNumber, setCardNumber] = useState('')
    const navigation = useNavigation();
    const [expiryDate, setexpiryDate] = useState('');
    const [isOpen, setIsOpen] = useState(false);



    useEffect(() => {
        BindProfileDetails()
    }, []);


    const BindProfileDetails = async () => {
        const strProfileDetails = await AsyncStorage.getItem("ProfileDetails")
        if (strProfileDetails !== null) {
            const ProfileDetails = JSON.parse(strProfileDetails)
            setName(ProfileDetails.Name)
            setcontactNumber(ProfileDetails.ContactNumber)
            setUnitNumber(ProfileDetails.DoorNumber)
            setStreetName(ProfileDetails.Street)
            setpostalCode(ProfileDetails.PostalCode)
            setcity(ProfileDetails.City)
        }
    }

    const placeOrder = () => {
        if (name !== '' || contactNumber !== '' || unitNumber !== '' || streetName !== '' || postalCode !== '' || city !== '') {
            if (validateCreditCard()) {
                Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter a Valid Credit Card Number !!!!', position: 'bottom' });
                return
            }

            if (!validateExpiryDate()) {
                return
            }

            Toast.show({ type: 'success', text1: 'Order Placed Successfully !!!', text2: `Order Placed`, position: 'bottom' });
            setTimeout(() => { navigation.replace('MenuList') }, 3000)
        } else {
            Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter all fields !!!!', position: 'bottom' });
        }
    }

    const validateCreditCard = () => {
        const re16digit=/^\d{16}$/
        return CardNumber.search(re16digit) == -1
    }

    const validateExpiryDate = () => {
        const ExpiryDateRegex = /^0[1-9]|1[0-2]\/\d{4}$/
        if (!ExpiryDateRegex.test(expiryDate)) {
            Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Please enter a Valid Expiry Date !!!!', position: 'bottom' });
            return false

           
        }
        if (new Date(expiryDate.split('/')[1], expiryDate.split('/')[0] - 1) <= new Date()) {
            Toast.show({ type: 'error', text1: 'Past Date Error', text2: 'Please enter a Valid Expiry Date !!!!', position: 'bottom' });
            return false
        }

        return true
    }


    return (
        <SafeAreaView>
            <ScrollView>
                <Background image="../assets/signup.jpeg">
                    <BackButton goBack={navigation.goBack} />
                    <Header>Payment Details</Header>
                    <TextInput
                        label="Name"
                        returnKeyType="next"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <TextInput
                        label="Contact Number"
                        returnKeyType="next"
                        value={contactNumber}
                        onChangeText={(text) => setcontactNumber(text)}
                    />
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
                    <TextInput
                        label="Credit Card Number"
                        returnKeyType="next"
                        value={CardNumber}
                        onChangeText={(text) => setCardNumber(text)}
                    />

                    <TextInput
                        label="Expiry Date (MM/YYYY)"
                        returnKeyType="next"
                        value={expiryDate}
                        onChangeText={(text) => setexpiryDate(text)}
                    />

                    {/* Commented By Lokesh and Himani for datepicker
            {isOpen && <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'month'}
                is24Hour={false}
                onChange={(date) => console.log(date, 'date')}
                minimumDate={new Date()}
            />} */}

                    <Button
                        mode="contained"
                        onPress={placeOrder}
                        style={{ marginTop: 24 }}
                    >
                        Place Order
                    </Button>
                </Background>
            </ScrollView>
        </SafeAreaView>)
}

export default PaymentDetails


const styles = StyleSheet.create({
    headerText: {
        textAlign: 'center',
        color: theme.colors.primary,
        fontSize: 28
    }
})

