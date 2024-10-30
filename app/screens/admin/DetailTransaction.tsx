import {DetailTransactionPageProps} from "@/app/navigation/ProductsStackNav";
import {useTransaction} from "@/app/api/api";
import React, {useEffect} from "react";
import {Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import firebase from 'firebase/compat';

const DetailTransaction = ({route, navigation}: DetailTransactionPageProps) => {
    const {id, nomor, status} = route.params;
    const {transaction, fetchTransactionDetail} = useTransaction();

    useEffect(() => {
        fetchTransactionDetail(id);
    }, [id]);

    const transactionDetail = transaction[0];

    const formatTimestamp = (timestamp: firebase.firestore.FieldValue) => {
        return timestamp ? timestamp.toDate().toLocaleString() : '';
    };

    return (
        <View style={styles.container}>
            {transactionDetail ? (
                <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                      keyboardVerticalOffset={65}>
                    <Text variant="headlineSmall" style={{color: 'black', fontWeight: 'bold'}}>Nomor
                        Transaksi: {transactionDetail.nomor}</Text>
                    <Text variant="bodyLarge" style={{color: 'black', fontWeight: 'bold'}}>{formatTimestamp(transactionDetail.timestamp)}</Text>
                    <FlatList
                        style={{paddingTop: 20}}
                        data={transactionDetail.produk}
                        keyExtractor={(item) => item.id_produk.toString()}
                        renderItem={({item}) => (
                            <View style={styles.cartItemContainer}>
                                <Image style={styles.cartItemImage} source={{uri: item.gambar}}/>
                                <View style={styles.itemContainer}>
                                    <Text style={styles.cartItemName}>{item.nama}</Text>
                                    <Text>{formatPriceToIDR(item.harga)}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>

                                    <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                                </View>
                            </View>
                        )}
                    />
                    <Text variant="titleMedium" style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
                        Alamat Pengiriman
                    </Text>
                    <Text style={styles.totalText}>
                        {transactionDetail.alamat}
                    </Text>
                    <View style={styles.row}>
                        <Text style={styles.totalText}>Total: {formatPriceToIDR(transactionDetail.total)}</Text>
                        <Text style={styles.statusText}>{transactionDetail.status}</Text>
                    </View>

                </KeyboardAvoidingView>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    cartItemContainer: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    cartItemImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 8,
        marginBottom: 10,
    },
    itemContainer: {
        flex: 1,
    },
    cartItemQuantity: {
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: '#1FE687',
        padding: 5,
        width: 30,
        color: '#fff',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    statusText: {
        textAlign: 'right',
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f2f2f2',
        color:'black'
    },
    totalText: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f2f2f2',
        color: 'black'
    },
    submitButton: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    inactive: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default DetailTransaction