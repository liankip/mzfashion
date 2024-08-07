import React from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import useCartStore from '../state/cartStore';
import {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Order} from '../api/api';
import {CartModalProps} from '../navigation/ProductsStackNav';
import ConfettiCannon from 'react-native-confetti-cannon';
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import firebase from "firebase/compat";
import {onAuthStateChanged} from "@firebase/auth";
import {FIREBASE_AUTH, FIRESTORE_DB} from "@/FirebaseConfig";
import {addDoc, collection} from "@firebase/firestore";

const CartScreen = ({navigation}: CartModalProps) => {
    const {products, total, reduceProduct, addProduct, clearCart} = useCartStore((state) => ({
        products: state.products,
        total: state.total,
        reduceProduct: state.reduceProduct,
        addProduct: state.addProduct,
        clearCart: state.clearCart,
    }));
    const [alamat, setAlamat] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const auth = FIREBASE_AUTH;

    const onSubmitOrder = async () => {
        setSubmitting(true);
        Keyboard.dismiss();

        try {
            onAuthStateChanged(auth, async (user) => {
                const orderData = {
                    email: user?.email,
                    alamat: alamat,
                    produk: products.map((product) => ({
                        id_produk: product.id,
                        quantity: product.quantity,
                        harga: product.harga,
                        gambar: product.gambar,
                        nama: product.nama
                    })),
                    total,
                    status:
                        'pending',
                    nomor:
                        'TRX' + Math.floor(Math.random() * 1000000),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                };
                navigation.navigate('Payment', {
                    nomor: orderData.nomor,
                    total: orderData.total,
                    email: orderData.email,
                    alamat: orderData.alamat,
                    produk: orderData.produk,
                    status: orderData.status,
                    timestamp: orderData.timestamp
                });

                await addDoc(collection(FIRESTORE_DB, 'transactions'), orderData)
            })
            clearCart();
        } catch (error) {
            alert('Gagal submit order');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {order &&
                <ConfettiCannon count={200} origin={{x: -10, y: 0}} fallSpeed={2500} fadeOut={false} autoStart={true}/>}
            {order && (
                <View style={{
                    marginTop: '50%',
                    padding: 20,
                    backgroundColor: '#000',
                    borderRadius: 8,
                    marginBottom: 20,
                    alignItems: 'center'
                }}>
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 26}}>Order submitted!</Text>
                    <Text style={{color: '#fff', fontSize: 16, margin: 20}}>Order ID: {order.id}</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}
                                      style={{backgroundColor: '#1FE687', padding: 10, borderRadius: 8}}>
                        <Text style={{color: '#000', fontWeight: 'bold', fontSize: 16}}>Lanjutkan Belanja</Text>
                    </TouchableOpacity>
                </View>
            )}
            {!order && (
                <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                      keyboardVerticalOffset={65}>
                    <Text style={styles.cartTitle}>Daftar Keranjang</Text>
                    {products.length === 0 && <Text style={{textAlign: 'center'}}>Keranjang Masih Kosong</Text>}
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({item}) => (
                            <View style={styles.cartItemContainer}>
                                <Image style={styles.cartItemImage} source={{uri: item.gambar}}/>
                                <View style={styles.itemContainer}>
                                    <Text style={styles.cartItemName}>{item.nama}</Text>
                                    <Text>{formatPriceToIDR(item.harga)}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => reduceProduct(item)} style={{padding: 10}}>
                                        <Ionicons name="remove" size={20} color={'#000'}/>
                                    </TouchableOpacity>

                                    <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                                    <TouchableOpacity onPress={() => addProduct(item)} style={{padding: 10}}>
                                        <Ionicons name="add" size={20} color={'#000'}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                    <Text style={styles.totalText}>Total: {formatPriceToIDR(total)}</Text>

                    <TextInput style={styles.emailInput} placeholder="Masukkan alamat" onChangeText={setAlamat}/>
                    <TouchableOpacity style={[styles.submitButton, alamat === '' ? styles.inactive : null]}
                                      onPress={onSubmitOrder} disabled={alamat === '' || submitting}>
                        <Text style={styles.submitButtonText}>{submitting ? 'Membuat Order...' : 'Buat Order'}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

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
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    emailInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
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
});

export default CartScreen;