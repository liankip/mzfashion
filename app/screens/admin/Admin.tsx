import {AdminPageProps} from "@/app/navigation/ProductsStackNav";
import React, {useEffect} from "react";
import {Icon, List, MD3Colors, Text} from 'react-native-paper';
import {useTransaction} from "@/app/api/api";
import {FlatList, StyleSheet, View} from "react-native";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";

const Admin = ({navigation}: AdminPageProps) => {
    const {transaction, fetchTransaction} = useTransaction();

    useEffect(() => {
        fetchTransaction();
    }, [transaction]);

    const renderListTransaction = ({item}: any) => {
        return (
            <View style={styles.transactionContainer}>
                <List.Item onPress={() => navigation.navigate('DetailTransaction', {id: item.id, nomor: item.nomor, status: item.status})}
                           title={<Text style={{color: '#000'}}>{item.nomor}</Text>}
                           description={
                               <>
                                   <Text style={{color: '#000'}}>{item.email}{'\n'}</Text>
                                   <Text style={{color: '#000'}}>{formatPriceToIDR(item.total)}</Text>
                               </>
                           }
                           left={props =>
                               <>
                                   {item.status === 'pending' ?
                                       <List.Icon {...props} color="#FFA500" icon="clock"/> :
                                       item.status === 'lunas' ?
                                           <List.Icon {...props} color="#008000" icon="check"/> :
                                           <List.Icon {...props} color="#FF0000" icon="close"/>}
                               </>
                           }
                />
            </View>
        )
    }

    return (
        <>
            {transaction.length < 0 ? (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon
                        source="cart"
                        color={MD3Colors.error50}
                        size={24}
                    />
                    <Text variant="titleLarge" style={{color: '#000', textAlign: 'center'}}>Daftar belanja kosong</Text>
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
    },
    todo: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },

})

export default Admin;