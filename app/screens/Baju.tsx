import {FlatList, Image, StyleSheet, Text, TextBase, TouchableOpacity, View} from "react-native"
import React, {useEffect} from "react";
import {Product, useProducts} from "@/app/api/api";
import {BajuPageProps} from "@/app/navigation/ProductsStackNav";

const Baju = ({navigation}: BajuPageProps) => {
    const { product, fetchProductsByCategory } = useProducts();

    useEffect(() => {
        fetchProductsByCategory('baju');
    }, [fetchProductsByCategory]);

    const renderBajuItem = ({item}: { item: Product }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetails', {id: item.id, name: item.nama})}
        >
            <Image style={styles.productImage} source={{uri: item.gambar}}/>
            <Text style={styles.productName}>{item.nama}</Text>
            <Text style={styles.productPrice}>${item.harga}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={product}
                renderItem={renderBajuItem}
                keyExtractor={(item) => item.id} numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    productItem: {
        flex: 1,
        margin: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    productName: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    productPrice: {
        marginTop: 4,
        fontSize: 14,
        color: '#666',
    },
});

export default Baju