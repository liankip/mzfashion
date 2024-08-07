// Path: src/screens/Products.js

import React, {useEffect, useCallback} from 'react';
import {
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    View
} from 'react-native';
import {ProductsPageProps} from '../navigation/ProductsStackNav';
import {Category, Product, useCategory, useProducts} from "@/app/api/api";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {Card, Paragraph, Text, Title} from "react-native-paper";
import truncateString from "@/app/components/truncateString";

const Products = ({navigation}: ProductsPageProps) => {
    const {product} = useProducts();
    const {categories, fetchCategories} = useCategory();

    useEffect(() => {
        fetchCategories();
    }, []);

    const renderProductItem = useCallback(({item}: { item: Product }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', {id: item.id, name: item.nama})}>
            <Card style={styles.card}>
                <Card.Cover source={{uri: item.gambar}} resizeMode="cover"/>
                <Card.Content>
                    <Title>{truncateString(item.nama, 17)}</Title>
                    <Paragraph>{formatPriceToIDR(item.harga)}</Paragraph>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    ), [navigation]);

    const renderCategoryItem = useCallback(({item}: { item: Category }) => {

        const handlePress = () => {
            if (item.nama === 'baju') {
                navigation.navigate('Baju');
            } else if (item.nama === 'celana') {
                navigation.navigate('Celana');
            }
        };

        return (
            <TouchableOpacity onPress={handlePress}>
                <Card style={styles.cardCategory}>
                    <Card.Title title={item.nama}/>
                </Card>
            </TouchableOpacity>
        );
    }, []);

    const renderProduct = useCallback(({item}: { item: Product }) => (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', {id: item.id, name: item.nama})}>
                <Card.Cover source={{uri: item.gambar}}/>
                <Card.Content>
                    <Text variant="titleMedium">{item.nama}</Text>
                    <Text variant="bodyMedium">{formatPriceToIDR(item.harga)}</Text>
                </Card.Content>
            </TouchableOpacity>
        </Card>
    ), [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                data={product}
            />

            <FlatList
                style={{marginTop: -330}}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
            />

            {/*<FlatList*/}
            {/*    renderItem={renderProduct}*/}
            {/*    keyExtractor={item => item.id.toString()}*/}
            {/*    data={product}*/}
            {/*    numColumns={2}*/}
            {/*/>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 10,
        width: 160,
    },
    cardCategory: {
        marginTop:30,
        margin: 10,
        width: 250,
    },
});

export default React.memo(Products);