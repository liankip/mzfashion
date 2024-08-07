import React, {useEffect} from "react";
import {Avatar, Button, Card, FAB, Text} from 'react-native-paper';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Product, useProducts} from "@/app/api/api";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {ListProductPageProps} from "@/app/navigation/ProductsStackNav";

type LeftContentProps = {
    size: number;
};

const LeftContent: React.FC<LeftContentProps> = (props) => <Avatar.Icon {...props} icon="folder"/>;

const ListProduct = ({navigation}: ListProductPageProps) => {
    const {product} = useProducts();

    const renderProductItem = ({item}: { item: Product }) => (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('DetailProduct', {id: item.id, name: item.nama})}>
                <Card.Cover source={{uri: item.gambar}}/>
                <Card.Content>
                    <Text variant="titleMedium">{item.nama}</Text>
                    <Text variant="bodyMedium">{formatPriceToIDR(item.harga)}</Text>
                </Card.Content>
            </TouchableOpacity>
        </Card>
    )

    return (
        <>
            <View style={styles.container}>
                <FlatList
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    data={product} numColumns={2}/>
            </View>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('CreateProduct')}/>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    card: {
        flex: 1,
        margin: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ListProduct;