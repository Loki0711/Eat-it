import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core'
import { View, StyleSheet, ScrollView } from 'react-native'
import Toast from 'react-native-toast-message'
import { Text } from 'react-native-paper'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import AsyncStorage from '@react-native-async-storage/async-storage'


import Header from '../components/Header'
import Button from '../components/Button'
import { theme } from '../core/theme'

const MenuList = (props) => {
    const [restaurantData, setrestaurantData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [cartCount, setCartCount] = useState(0);
    const CartCount = restaurantData.reduce((accumulator, object) => accumulator + object.cartCount, 0);

    const menuList = () => {
        const apiURL = `https://gist.githubusercontent.com/skd09/8d8a685ffbdae387ebe041f28384c13c/raw/26e97cec1e18243e3d88c90d78d2886535a4b3a6/menu.json`;

        return fetch(apiURL)
            .then((response) => response.json().then((json) => {
                const finalList = json.map((product) => Object.assign({ ...product, cartCount: 0 }))
                 setrestaurantData(finalList);
                 })
                .catch((error) => { console.error(error); })
                .finally(() => setLoading(false))
            );
    }

    useEffect(() => { menuList() }, []);

    const addToCart = (Index) => {
        const menuItems = [...restaurantData]
        const menuItem =  menuItems[Index]
        menuItem.cartCount = menuItem.cartCount + 1
        setrestaurantData(menuItems)
        const totalCount = menuItems.reduce((accumulator, cart) => accumulator + cart.cartCount , 0);
        Toast.show({ type: 'success', text1: `${menuItem.Title} added to Cart !!!`, text2: `${totalCount} are in cart !!!`, position: 'bottom' });
    }

    const removeItem = (Index) => {
        const menuItems = [...restaurantData]
        const menuItem =  menuItems[Index]
        if (menuItem.cartCount >= 1) {
            menuItem.cartCount = menuItem.cartCount - 1
            setrestaurantData(menuItems)
            const totalCount = menuItems.reduce((accumulator, cart) => accumulator + cart.cartCount , 0);
            Toast.show({ type: 'success', text1: `${menuItem.Title} removed from Cart !!!`, text2: `${totalCount} are in cart !!!`, position: 'bottom' });
        } else {
            Toast.show({ type: 'error', text1: `Invalid Action`, text2: `please add this item to cart to remove !!!!!`, position: 'bottom' });
        }
    }
 
    const gotoCartSummary = () => {      
        const cartItems = restaurantData.filter((cartItem) => cartItem.cartCount >= 1)
        AsyncStorage.setItem("CartSummary", JSON.stringify(cartItems))
        navigation.navigate("CartSummary")
    }

    return (<ScrollView>
        <Header style={styles.headerText}>Restaurant Menu</Header>
        <Button mode="contained" style={styles.menuButtons} onPress={() => navigation.navigate("SignUp", { isUpdate: true })}>
            View / Update Profile
        </Button>
        <Button mode="contained" style={styles.menuButtons} onPress={gotoCartSummary}>
            {`Check Out (${CartCount} Items)`}
        </Button>
        <View style={{ marginVertical: 10 }}>
            {restaurantData.map((restaurantDetails, index) => {
                return (<Card style={styles.menucard} key={`details_${index}`}>
                    <CardImage
                        style={{ height: 300 }}
                        source={{ uri: restaurantDetails.Image }}
                    />
                    <CardTitle
                        title={restaurantDetails.Title}
                        subtitle={restaurantDetails.Category}
                    />
                    <CardContent text={restaurantDetails.Description} />
                    <Text style={styles.PriceText}>{`$ ${restaurantDetails.Price}`}</Text>
                    {restaurantDetails.Available === 1 ? <CardAction
                        separator={true}
                        inColumn={false}
                        style={styles.CardButtons}>
                        <Button mode="contained" style={styles.widthHalf} onPress={() => removeItem(index)}>
                            -
                        </Button>
                        <Text>{`${restaurantDetails.cartCount}`}</Text>
                        <Button mode="contained" style={styles.widthHalf} onPress={() => addToCart(index)}>
                            +
                        </Button>
                    </CardAction> : <></>}
                </Card>)
            })}
        </View>
    </ScrollView>)
}

export default MenuList


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
    menucard: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 20
    },
    headerText: {
        textAlign: 'center',
        color: theme.colors.primary,
        fontSize: 28
    },
    menuButtons: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    widthHalf: {
        width: '30%'
    },
    CardButtons: {
        flex: 1,
        justifyContent: 'space-between',
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    PriceText: {
        textAlign: 'center',
        width: '100%',
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 18
    }
})