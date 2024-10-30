import {AdminPageProps} from "@/app/navigation/ProductsStackNav";
import React, {useEffect, useState} from "react";
import {Icon, IconButton, List, MD3Colors, Searchbar, Snackbar, Text} from 'react-native-paper';
import {useTransaction} from "@/app/api/api";
import {FlatList, StyleSheet, View} from "react-native";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import firebase from 'firebase/compat';

const Admin = ({navigation}: AdminPageProps) => {
    const {transaction, fetchTransaction, updateTransactionStatus} = useTransaction();
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState(transaction);

    useEffect(() => {
        fetchTransaction();
    }, []);

    useEffect(() => {
        const sortedTransactions = [...transaction].sort((a, b) => {
            const dateA = a.timestamp ? (a.timestamp as firebase.firestore.Timestamp).toDate() : new Date(0);
            const dateB = b.timestamp ? (b.timestamp as firebase.firestore.Timestamp).toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        const filtered = sortedTransactions.filter(item =>
            item.nomor && item.nomor.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredTransactions(filtered);
    }, [searchQuery, transaction]);

    const toggleTransactionStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'pending' ? 'lunas' : 'pending';
        try {
            updateTransactionStatus(id, newStatus);
            setNotificationMessage(`Status transaksi berhasil diubah menjadi ${newStatus}`);
            setShowNotification(true);
        } catch (error) {
            setNotificationMessage('Gagal mengubah status transaksi.');
            setShowNotification(true);
        }
    };

    const formatTimestamp = (timestamp: firebase.firestore.Timestamp | null) => {
        return timestamp ? timestamp.toDate().toLocaleString() : '';
    };

    const renderListTransaction = ({item}: any) => {
        return (
            <View style={styles.transactionContainer}>
                <List.Section>
                    <List.Item
                        onPress={() => toggleTransactionStatus(item.id, item.status)}
                        title={<Text style={{color: '#000'}}>{item.nomor}</Text>}
                        description={
                            <>
                                <Text style={{color: '#000'}}>{formatTimestamp(item.timestamp)}{'\n'}</Text>
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
                        right={props => (
                            <IconButton
                                {...props}
                                icon="arrow-right"
                                iconColor="#000"
                                style={styles.cornerIcon}
                                onPress={() => navigation.navigate('DetailTransaction', {
                                    id: item.id,
                                    nomor: item.nomor,
                                    status: item.status
                                })}
                            />
                        )}
                    />
                </List.Section>
            </View>
        )
    }

    return (
        <>
            <Searchbar
                placeholder="Cari transaksi"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />
            {filteredTransactions.length === 0 ? (
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon
                        source="cart"
                        color={MD3Colors.error50}
                        size={18}
                    />
                    <Text variant="titleLarge" style={{color: '#000', textAlign: 'center'}}>Daftar belanja kosong</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <FlatList
                        renderItem={renderListTransaction}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        data={filteredTransactions}/>
                </View>
            )}
            <Snackbar
                visible={showNotification}
                onDismiss={() => setShowNotification(false)}
                duration={3000}
            >
                {notificationMessage}
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    transactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 4,
        marginHorizontal: 15
    },
    cornerIcon: {
        position: 'absolute',
        top: -2,
        right: -110,
    },
    searchbar: {
        marginHorizontal: 15,
        marginTop: 10,
        borderRadius: 0,
        backgroundColor: '#fff',
    }
});

export default Admin;