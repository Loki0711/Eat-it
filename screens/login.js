import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'


import Background from '../components/background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { fetchusers } from '../models/authentication'

const Login = (props) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onLoginPressed = () => {
        if (email !== '' || password !== '') {
            let IsUserAvailable = false
            const firebasereference = fetchusers()
            firebasereference.onSnapshot((query) => {
                query.forEach((doc) => {
                    if (doc.data().Email === email && doc.data().Password === password) {
                        IsUserAvailable = true
                        Toast.show({ type: 'success', text1: 'User Logged In Successfully !!!', text2: `Welcome ${doc.data().Name}`, position: 'bottom' });
                        AsyncStorage.setItem("ProfileDetails", JSON.stringify({ id: doc.id, ...doc.data() }))
                        setTimeout(() => { navigation.replace('MenuList') }, 2000)
                    }
                });
                if (!IsUserAvailable) {
                    Toast.show({ type: 'error', text1: 'User Log In Unsuccessful !!!', text2: `Error`, position: 'bottom' });
                }
            });

        } else {

        }
    }

    return (<Background image="../assets/login.jpeg">
        <BackButton goBack={navigation.goBack} />
        <Logo />
        <Header>Restaurant App</Header>
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
        <Button mode="contained" onPress={onLoginPressed}>
            Login
        </Button>
        <View style={styles.row}>
            <Text>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('SignUp', { isUpdate: false })}>
                <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
        </View>
    </Background>)
}


export default Login

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
})