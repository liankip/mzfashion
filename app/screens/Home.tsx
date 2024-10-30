import React, {useEffect, useCallback, useState} from 'react';
import {
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    View, ImageBackground, Dimensions,
    Image, ScrollView
} from 'react-native';
import {ProductsPageProps} from '../navigation/ProductsStackNav';
import {Product, useCategory, useProducts} from "@/app/api/api";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {Text, Button} from "react-native-paper";
import {getAuth} from "@firebase/auth";

const Home = ({navigation}: ProductsPageProps) => {
    const {product} = useProducts();
    const {categories, fetchCategories} = useCategory();
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchCategories();

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            setUsername(user.displayName || 'User'); // Set username or fallback to 'User' if displayName is null
        }
    }, []);

    const renderProductItem = useCallback(({item}: { item: Product }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', {id: item.id, name: item.nama})}>
            <View style={styles.cardContainer}>
                <Image source={{uri: item.gambar}} style={styles.productImage}/>
                <View style={styles.textContainer}>
                    <Text style={styles.productTitle}>{item.nama}</Text>
                    <Text style={styles.productPrice}>{formatPriceToIDR(item.harga)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    ), [navigation]);

    const renderBajuItem = ({item}: { item: Product }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetails', {id: item.id, name: item.nama})}
        >
            <Image style={styles.productImage} source={{uri: item.gambar}}/>
            <Text style={styles.productName}>{item.nama}</Text>
            <Text style={styles.productPrice}>{formatPriceToIDR(item.harga)}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView>
            <View style={styles.page}>
                <ImageBackground source={require('@/assets/images/image-background.png')}
                                 style={styles.header}>
                    <View style={styles.hello}>
                        <Text style={styles.selamat}>Selamat Datang</Text>
                        <Text style={styles.username}>{username}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.kategori}>
                    <Text style={styles.textKategori}>Kategori</Text>
                    <View style={styles.iconKategori}>
                        {categories.map((category) => (
                            <Button style={styles.buttonKategori} mode="contained" buttonColor="#fff"
                                    textColor="black"
                                    onPress={() => console.log('Pressed')}>
                                {category.nama}
                            </Button>
                        ))}
                    </View>
                </View>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.textTerlaris}>Terlaris</Text>
                    <FlatList
                        renderItem={renderProductItem}
                        keyExtractor={item => item.id.toString()}
                        horizontal
                        data={product}
                        contentContainerStyle={styles.flatListContainer}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text style={styles.textTerlaris}>Produk Lainnya</Text>
                    <FlatList
                        data={product}
                        renderItem={renderBajuItem}
                        keyExtractor={(item) => item.id} numColumns={2}
                    />
                </SafeAreaView>
            </View>
        </ScrollView>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    header: {
        width: windowWidth,
        height: windowHeight * 0.18,
        paddingHorizontal: 30,
        paddingTop: 10
    },
    logo: {
        width: windowWidth,
        height: windowHeight * 0.30,
    },
    hello: {
        height: windowHeight * 0.06,
    },
    selamat: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        paddingTop: 20
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        paddingTop: 5
    },
    kategori: {
        paddingHorizontal: 30,
        paddingTop: 15,
    },
    textKategori: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    iconKategori: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        flexWrap: 'nowrap',
        overflow: 'hidden',
    },
    buttonKategori: {
        padding: 8,
        marginBottom: 12,
        borderRadius: 10,
        marginRight: 10,
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 15,
    },
    textTerlaris: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    cardContainer: {
        flexDirection: 'row',
        padding: 20,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
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
        marginTop: 4,
        fontSize: 14,
        color: '#666',
    },
    productName: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    flatListContainer: {
        paddingHorizontal: 5,
    },
});

export default React.memo(Home);