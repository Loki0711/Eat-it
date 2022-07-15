import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { theme } from '../core/theme'
import Header from '../components/Header'
import Button from '../components/Button'

const CartSummary = (props) => {
    const naviagation = useNavigation()
    const [tableHead, settableHead] = useState(['Item', 'Quantity', 'Price'])
    const [tableTitle, settableTitle] = useState([])
    const [tableData, settableData] = useState([
        ['2', '3'],
        ['b', 'c'],
        ['2', '3'],
        ['b', 'c']
    ])

    useEffect(() => {
        BindCartDetails()
    }, []);


    const BindCartDetails = async () => {
        const strCartSummary = await AsyncStorage.getItem("CartSummary")
        const CartSummary = [...JSON.parse(strCartSummary)]
        const statetableTitle = []
        const statetableData = []
        let TotalPrice = 0
        CartSummary.forEach((Cart) => {
            const Row = []
            statetableTitle.push(Cart.Title)
            Row.push(Cart.cartCount)
            const itemTotal = Cart.cartCount * Cart.Price
            Row.push(itemTotal)
            statetableData.push(Row)
            TotalPrice = itemTotal + TotalPrice
        })
        const totalrow = ['']
        statetableTitle.push('Total')
        totalrow.push(`${TotalPrice}`)
        statetableData.push(totalrow)
        const discountrow = []
        statetableTitle.push('Discount')
        const discountDetails = calculateDiscountBasedOnPrice(TotalPrice)
        discountrow.push(`${discountDetails.percentage}`)
        discountrow.push(discountDetails.price.toFixed(2))
        statetableData.push(discountrow)
        const finalRow = ['']
        statetableTitle.push('Final Price')
        finalRow.push(`${(TotalPrice - discountDetails.price).toFixed(2)}`)
        statetableData.push(finalRow)
        settableTitle(statetableTitle)
        settableData(statetableData)
    }


    const calculateDiscountBasedOnPrice = (Price) => {
        let Discount = {
            percentage: '',
            price: ''
        }
        if (Price >= 100) {
            Discount.percentage = '30%'
            Discount.price = parseFloat(Price * 0.30)
        } else if (Price >= 88 && Price <= 99) {
            Discount.percentage = '20%'
            Discount.price = parseFloat(Price * 0.20)
        } else if (Price < 80) {
            Discount.percentage = '5%'
            Discount.price = parseFloat(Price * 0.05)
        }
        return Discount
    }

    const gotoPaymentPage = () => {
        naviagation.navigate("PaymentDetails")
    }


    return (<ScrollView>
        <Header style={styles.headerText}>Cart Summary</Header>
        <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 1 }}>
                <Row data={tableHead} flexArr={[2, 1, 1]} style={styles.head} textStyle={styles.text} />
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[28, 28]} textStyle={styles.text} />
                    <Rows data={tableData} flexArr={[1, 1]} style={styles.row} textStyle={styles.text} />
                </TableWrapper>
            </Table>
        </View>
        <Button mode="contained" style={styles.menuButtons} onPress={gotoPaymentPage}>
            Pay Bill
        </Button>
    </ScrollView>)
}

export default CartSummary


const styles = StyleSheet.create({
    headerText: {
        textAlign: 'center',
        color: theme.colors.primary,
        fontSize: 28
    },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    wrapper: { flexDirection: 'row' },
    title: { flex: 2, backgroundColor: '#f6f8fa' },
    row: { height: 28 },
    text: { textAlign: 'center' }
})