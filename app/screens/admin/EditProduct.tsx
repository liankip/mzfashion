import React, { useEffect, useState } from 'react';
import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Product, useProducts } from "@/app/api/api";
import { EditProductPageProps } from "@/app/navigation/ProductsStackNav";

const EditProduct = ({ route, navigation }: EditProductPageProps) => {
    const { id } = route.params;
    const { product, fetchProductDetail, editProduct } = useProducts();

    // State for input fields
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [gambar, setGambar] = useState('');
    const [kategori, setKategori] = useState('');
    const [harga, setHarga] = useState('');
    const [ukuran, setUkuran] = useState(''); // Treat ukuran as string

    useEffect(() => {
        fetchProductDetail(id);
    }, [id]);

    const productDetail = product[0];

    useEffect(() => {
        if (productDetail) {
            setNama(productDetail.nama);
            setDeskripsi(productDetail.deskrsipsi);
            setGambar(productDetail.gambar);
            setKategori(productDetail.kategori);
            setHarga(productDetail.harga.toString());
            setUkuran(productDetail.ukuran); // No need for .join() as it's already a string
        }
    }, [productDetail]);

    const handleEdit = async () => {
        try {
            await editProduct(id, {
                nama,
                deskrsipsi: deskripsi,
                gambar,
                kategori,
                harga: parseFloat(harga), // convert to number
                ukuran, // ukuran remains a string
            });
            Alert.alert('Produk berhasil diupdate!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Gagal mengupdate produk');
        }
    };

    return (
        <ScrollView contentContainerStyle={editProductStyles.container}>
            <TextInput
                label="Nama"
                value={nama}
                onChangeText={setNama}
                style={editProductStyles.input}
            />
            <TextInput
                label="Deskripsi"
                value={deskripsi}
                onChangeText={setDeskripsi}
                style={editProductStyles.input}
            />
            <TextInput
                label="Gambar"
                value={gambar}
                onChangeText={setGambar}
                placeholder="Masukkan link gambar"
                style={editProductStyles.input}
            />
            <TextInput
                label="Kategori"
                value={kategori}
                onChangeText={setKategori}
                placeholder="Pilihan hanya 2 baju dan celana"
                style={editProductStyles.input}
            />
            <TextInput
                label="Harga"
                value={harga}
                onChangeText={setHarga}
                keyboardType="numeric"
                style={editProductStyles.input}
            />
            <TextInput
                label="Ukuran"
                value={ukuran}
                onChangeText={setUkuran}
                placeholder="Pisahkan dengan koma (contoh: S, M, L)"
                style={editProductStyles.input}
            />
            <Button mode="contained" onPress={handleEdit} style={editProductStyles.submitButton}>
                <Text style={editProductStyles.submitButtonText}>Simpan</Text>
            </Button>
        </ScrollView>
    );
};

// Renamed 'styles' to 'editProductStyles' to avoid conflict
const editProductStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginVertical: 4,
        height: 50,
        backgroundColor: '#fff'
    },
    submitButton: {
        backgroundColor: '#000',
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

export default EditProduct;
