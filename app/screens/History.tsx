import {FlatList, View, StyleSheet} from "react-native";
import {Icon, List, MD3Colors, Text} from 'react-native-paper';
import {useTransaction} from "@/app/api/api";
import React, {useEffect} from "react";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {HistoryPageProps} from "@/app/navigation/ProductsStackNav";
import {onAuthStateChanged} from "@firebase/auth";
import {FIREBASE_AUTH} from "@/FirebaseConfig";

const History = ({navigation}: HistoryPageProps) => {
    const {transaction, fetchTransactionByEmail} = useTransaction();
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            fetchTransactionByEmail(user?.email);
        })
    }, [fetchTransactionByEmail]);

    const renderListTransaction = ({item}: { item: any }) => (
        <View style={styles.transactionContainer}>
            <List.Item onPress={() => navigation.navigate('HistoryDetails', {id: item.id})}
                       title={item.nomor}
                       description={formatPriceToIDR(item.total)}
                       left={props =>
                           <>
                               {item.status === 'pending' ? <List.Icon {...props} color="#FFA500" icon="clock"/> :
                                   item.status === 'lunas' ? <List.Icon {...props} color="#008000" icon="check"/> :
                                       <List.Icon {...props} color="#FF0000" icon="close"/>}
                           </>
                       }
            />
        </View>
    )

    return (
        <>
            {transaction.length > 0 ? (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon
                        source="cart"
                        color={MD3Colors.error50}
                        size={24}
                    />
                    <Text variant="titleLarge" style={{ color:'#000', textAlign: 'center'}}>Daftar belanja kosong</Text>
                </View>
            ) : (
                <View style={styles.container}>

                    <FlatList
                        renderItem={renderListTransaction}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        data={transaction}/>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10
    },
    transactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4
    }
})

export default History