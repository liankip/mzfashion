import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {ProductDetailsPageProps} from "../navigation/ProductsStackNav";
import useCartStore from "@/app/state/cartStore";
import {ReviewType, useProducts} from "@/app/api/api";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {Button, Card, List, Paragraph, Text, Title} from 'react-native-paper';

const ProductDetails = ({route}: ProductDetailsPageProps) => {
    const {id} = route.params;
    const {product, fetchProductDetail} = useProducts();
    const [reviews, setReviews] = useState<ReviewType[]>([]);

    const {products, addProduct} = useCartStore((state) => ({
        products: state.products,
        addProduct: state.addProduct,
    }));
    const [count, setCount] = useState(0);

    useEffect(() => {
        updateProductQuantity();
    }, [products]);

    useEffect(() => {
        fetchProductDetail(id);
    }, [id]);

    const productDetail = product[0]
    console.log(productDetail)
    const updateProductQuantity = () => {
        const result = products.filter((product) => product.id === id);
        if (result.length > 0) {
            setCount(result[0].quantity);
        } else {
            setCount(0);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {productDetail && (
                <>
                    <Card>
                        <Card.Cover source={{uri: productDetail.gambar}} resizeMode="center"/>
                        <Card.Content>
                            <Title>{productDetail.nama}</Title>
                            <Paragraph>{productDetail.deskrsipsi}</Paragraph>
                            <List.Item
                                title="CustomSidebarMen"
                                description={productDetail.kategori}
                                left={props => <List.Icon {...props} icon="folder"/>}
                            />
                            <List.Item
                                title="Harga"
                                description={formatPriceToIDR(productDetail.harga)}
                                left={props => <List.Icon {...props} icon="currency-usd"/>}
                            />
                        </Card.Content>
                    </Card>
                    <Button mode="contained" style={styles.submitButton} onPress={() => addProduct(productDetail)}>
                        <Text style={styles.submitButtonText}>Tambah Keranjang</Text>
                    </Button>
                </>
            )}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetails;
