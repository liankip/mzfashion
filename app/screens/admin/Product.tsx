import React from "react";
import {Avatar, Card, FAB, IconButton, List, Text} from 'react-native-paper';
import {View, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {Product, useProducts} from "@/app/api/api";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {ListProductPageProps} from "@/app/navigation/ProductsStackNav";
import {deleteDoc, doc} from "@firebase/firestore";
import {FIRESTORE_DB} from "@/FirebaseConfig";

const ListProduct = ({navigation}: ListProductPageProps) => {
    const {product} = useProducts();

    const deleteProduct = async (id: string) => {
        try {
            const productDocRef = doc(FIRESTORE_DB, 'products', id);
            await deleteDoc(productDocRef);
            Alert.alert('Produk berhasil dihapus');
        } catch (error) {
            Alert.alert('Gagal menghapus produk');
        }
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            'Konfirmasi Hapus',
            'Apakah Anda yakin ingin menghapus produk ini?',
            [
                {
                    text: 'Batal',
                    style: 'cancel',
                },
                {
                    text: 'Hapus',
                    onPress: () => deleteProduct(id),
                    style: 'destructive',
                },
            ],
            {cancelable: true}
        );
    };

    const renderProductItem = ({item}: { item: Product }) => (
        <List.Item
            title={item.nama}
            description={() => (
                <Text>{formatPriceToIDR(item.harga)}</Text>
            )}
            left={() => <Avatar.Image size={56} source={{uri: item.gambar}}/>}
            right={() => (
                <IconButton
                    icon="delete"
                    onPress={() => confirmDelete(item.id)}
                />
            )}
            onPress={() => navigation.navigate('EditProduct', {id: item.id, name: item.nama})}
            style={styles.listItem}
        />
    );

    return (
        <>
            <View style={styles.container}>
                <FlatList
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id}
                    data={product}
                />
            </View>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CreateProduct')}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    listItem: {
        marginVertical: 5,
        backgroundColor: '#fff',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ListProduct;