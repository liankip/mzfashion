import {useState} from "react";
import {StyleSheet, Alert, View, ScrollView} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
import {FIRESTORE_DB} from "@/FirebaseConfig";
import {addDoc, collection} from "@firebase/firestore";

const CreateProduct = () => {
    useTheme();
    const [nama, setNama] = useState<string>('');
    const [deskripsi, setDeskripsi] = useState<string>('');
    const [gambar, setGambar] = useState<string>('');
    const [harga, setHarga] = useState<string>('');
    const [kategori, setKategori] = useState<string>('');
    const [ukuran, setUkuran] = useState<string>('');

    const handleSubmit = async () => {
        if (!nama || !deskripsi || !harga || !kategori || ukuran.length === 0) {
            Alert.alert('Error', 'Mohon masukkan form input yang kosong');
            return;
        }

        try {
            const ukuranArray = ukuran.split(',').map(item => item.trim());
            await addDoc(collection(FIRESTORE_DB, 'products'), {
                nama,
                deskripsi,
                gambar,
                harga: parseFloat(harga),
                kategori,
                ukuran: ukuranArray,
            });

            Alert.alert('Success', `Produk \`${nama}\` berhasil ditambahkan`);
            setNama('');
            setDeskripsi('');
            setGambar('');
            setHarga('');
            setKategori('Baju');
            setUkuran('');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'An unknown error occurred');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                label="Nama"
                value={nama}
                onChangeText={setNama}
                style={styles.input}
            />
            <TextInput
                label="Deskripsi"
                value={deskripsi}
                onChangeText={setDeskripsi}
                style={styles.input}
            />
            <TextInput
                label="Gambar"
                value={gambar}
                onChangeText={setGambar}
                placeholder="Masukkan link gambar"
                style={styles.input}
            />
            <TextInput
                label="Kategori"
                value={kategori}
                onChangeText={setKategori}
                placeholder="Pilihan hanya 2 baju dan celana"
                style={styles.input}
            />
            <TextInput
                label="Harga"
                value={harga}
                onChangeText={setHarga}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                label="Ukuran"
                value={ukuran}
                onChangeText={setUkuran}
                placeholder="Pisahkan dengan koma (contoh: S, M, L)"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Simpan</Text>
            </Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 20,
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

export default CreateProduct;