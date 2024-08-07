import {
    View,
    Text,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    FlatList,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import React, {useState} from "react";
import {PaymentPageProps} from "@/app/navigation/ProductsStackNav";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {Button} from "react-native-paper";

const Payment = ({route}: PaymentPageProps) => {
    const {
        nomor,
        email,
        produk,
        total
    } = route.params;

    const [message, setMessage] = useState('Halo, saya ' + email + ' sudah membayar transaksi dengan ' + nomor + ', dan akan memberikan bukti transfer. Terima kasih');

    const sendWhatsAppMessage = async () => {
        const phoneNumber = '6281267582824'; // Replace with the recipient's phone number
        const text = encodeURIComponent(message);

        // Construct the WhatsApp URL
        const url = `whatsapp://send?phone=${phoneNumber}&text=${text}`;

        try {
            await Linking.openURL(url);

            console.log('WhatsApp opened successfully on Android');
        } catch (error) {
            console.error('Error opening WhatsApp on Android:', error);
        }
    };


    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                  keyboardVerticalOffset={65}>
                <Text style={styles.cartTitle}>Nomor Transaksi: {nomor}</Text>
                <FlatList
                    data={produk}
                    keyExtractor={(item) => item.id_produk.toString()}
                    renderItem={({item}) => (
                        <View style={styles.cartItemContainer}>
                            <Image style={styles.cartItemImage} source={{uri: item.gambar}}/>
                            <View style={styles.itemContainer}>
                                <Text style={styles.cartItemName}>{item.nama}</Text>
                                <Text>{formatPriceToIDR(item.harga)}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>

                                <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                            </View>
                        </View>
                    )}
                />
                <Text style={styles.totalText}>Total: {formatPriceToIDR(total)}</Text>
                <Button icon="whatsapp" style={styles.submitButton}
                                  onPress={sendWhatsAppMessage}>
                    <Text style={styles.submitButtonText}>Beritahukan Bayar</Text>
                </Button>
            </KeyboardAvoidingView>
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

export default Payment;