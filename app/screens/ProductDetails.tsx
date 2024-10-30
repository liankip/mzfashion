import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, ScrollView, View, Modal, TouchableOpacity} from 'react-native';
import {ProductDetailsPageProps} from "../navigation/ProductsStackNav";
import useCartStore from "@/app/state/cartStore";
import {useProducts} from "@/app/api/api";
import formatPriceToIDR from "@/app/components/formatPriceToIDR";
import {Button, Text, Snackbar, Icon, TextInput} from 'react-native-paper';
import firebase from 'firebase/compat';
import {addDoc, collection, onSnapshot, orderBy, query, where} from 'firebase/firestore';
import {FIRESTORE_DB} from '@/FirebaseConfig';

interface Review {
    id: string;
    reviewText: string;
    reviewRating: number;
    timestamp: firebase.firestore.Timestamp | null;
}

const ProductDetails = ({route}: ProductDetailsPageProps) => {
    const {id} = route.params;
    const {product, fetchProductDetail} = useProducts();

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [sizeInfo, setSizeInfo] = useState<string>('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState<number | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    const {products, addProduct} = useCartStore((state) => ({
        products: state.products,
        addProduct: state.addProduct,
    }));
    const [count, setCount] = useState(0);

    const sizeData: { [key: string]: string } = {
        'S': 'TB 150-160 cm, BB 45-55 kg',
        'M': 'TB 160-170 cm, BB 55-65 kg',
        'L': 'TB 170-180 cm, BB 65-75 kg',
        'XL': 'TB 180-190 cm, BB 75-85 kg',
        'XXL': 'TB 190-200 cm, BB 85-95 kg',
        'XXXL': 'BB 95-115 kg',
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleSizeSelection = (size: string) => {
        setSelectedSize(size);
        setSizeInfo(sizeData[size]);
    };

    useEffect(() => {
        updateProductQuantity();
    }, [products]);

    useEffect(() => {
        fetchProductDetail(id);
    }, [id]);


    const productDetail = product[0]

    const updateProductQuantity = () => {
        const result = products.filter((product) => product.id === id);
        if (result.length > 0) {
            setCount(result[0].quantity);
        } else {
            setCount(0);
        }
    };

    const handleAddToCart = () => {
        if (selectedSize) {
            addProduct({...productDetail});
            setSnackbarVisible(true);
            toggleModal();
        } else {
            alert("Pilih ukuran terlebih dahulu!");
        }
    };

    const handleReviewSubmit = async () => {
        if (reviewText && reviewRating && productDetail) {
            try {
                const reviewData = {
                    productId: productDetail.id,
                    reviewText,
                    reviewRating,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                };

                await addDoc(collection(FIRESTORE_DB, 'review_transactions'), reviewData)

                setReviewText('');
                setReviewRating(null);
                alert('Review telah disimpan!');
            } catch (error) {
                console.error("Error submitting review: ", error);
                alert('Gagal menyimpan review. Coba lagi.');
            }
        } else {
            alert('Harap isi semua bidang review.');
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            if (productDetail?.id) {
                const reviewRef = collection(FIRESTORE_DB, 'review_transactions');
                const q = query(reviewRef, where('productId', '==', productDetail.id));

                const reviews: Review[] = [];

                return onSnapshot(q, (snapshot) => {

                    snapshot.docs.forEach((doc) => {
                        const data = doc.data();
                        const review = {
                            id: doc.id,
                            reviewText: data.reviewText,
                            reviewRating: data.reviewRating,
                            timestamp: data.timestamp,
                        };

                        reviews.push(review);
                    });

                    setReviews(reviews);
                });
            }
        };

        fetchReviews();
    }, [productDetail?.id]);

    const formatTimestamp = (timestamp: firebase.firestore.Timestamp | null) => {
        return timestamp ? timestamp.toDate().toLocaleString() : '';
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {productDetail && (
                <>
                    <View style={styles.cardProduk}>
                        <Image source={{uri: productDetail.gambar}} style={styles.productImage}/>
                        <Text style={styles.category}>{productDetail.kategori}</Text>
                        <Text style={styles.productTitle}>{productDetail.nama}</Text>
                        <Text style={styles.productPrice}>{formatPriceToIDR(productDetail.harga)}</Text>
                        <Button mode="contained" style={styles.submitButton} onPress={toggleModal}>
                            <Text style={styles.submitButtonText}>
                                <Icon source="cart-plus" size={18}/> Tambah Keranjang
                            </Text>
                        </Button>
                    </View>

                    <Modal
                        transparent={true}
                        visible={isModalVisible}
                        animationType="slide"
                        onRequestClose={toggleModal}
                    >
                        <TouchableOpacity style={styles.modalOverlay} onPress={toggleModal}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Pilih Ukuran</Text>

                                <View style={styles.sizeButtonsContainer}>
                                    {Object.keys(sizeData).map((size) => (
                                        <TouchableOpacity
                                            key={size}
                                            style={[
                                                styles.sizeButton,
                                                selectedSize === size && styles.selectedSizeButton,
                                            ]}
                                            onPress={() => handleSizeSelection(size)}
                                        >
                                            <Text style={[
                                                styles.sizeButtonText,
                                                selectedSize === size && styles.selectedSizeButton
                                            ]}>{size}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {sizeInfo && (
                                    <>
                                        <Text style={styles.sizeInfoText}>{sizeInfo}</Text>
                                        <Text style={styles.sizeInfoText}>BB = Berat Badan</Text>
                                        <Text style={styles.sizeInfoText}>TB = Tinggi Badan</Text>
                                    </>
                                )}

                                <Button style={styles.submitButton} mode="contained" onPress={handleAddToCart}>
                                    <Text>Tambahkan</Text>
                                </Button>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <View style={styles.reviewContainer}>
                        <Text style={styles.reviewTitle}>Berikan Review Anda</Text>
                        <TextInput
                            textColor={'black'}
                            style={styles.reviewInput}
                            placeholder="Tulis review di sini..."
                            value={reviewText}
                            onChangeText={setReviewText}
                        />
                        <TextInput
                            textColor={'black'}
                            style={styles.reviewInput}
                            placeholder="Rating (1-5)"
                            value={reviewRating?.toString() || ''}
                            onChangeText={(text) => setReviewRating(Number(text))}
                            keyboardType="numeric"
                        />
                        <Button style={styles.submitButton} mode="contained" onPress={handleReviewSubmit}>
                            <Text>Kirim Review</Text>
                        </Button>
                    </View>

                    <View style={styles.reviewListContainer}>
                        <Text style={styles.reviewListTitle}>Review Produk</Text>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <View key={review.id} style={styles.reviewItem}>
                                    <Text style={styles.reviewText}>{review.reviewText}</Text>
                                    <Text style={styles.reviewRating}>Rating: {review.reviewRating}/5</Text>
                                    <Text style={styles.reviewDate}>{formatTimestamp(review.timestamp)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noReviewText}>Belum ada review untuk produk ini.</Text>
                        )}
                    </View>

                    <Snackbar style={{margin: 15}}
                              visible={snackbarVisible}
                              onDismiss={() => setSnackbarVisible(false)}
                              duration={3000}
                              action={{
                                  label: 'Dismiss',
                                  onPress: () => {
                                      setSnackbarVisible(false);
                                  },
                              }}
                    >
                        Produk sudah ditambahkan di keranjang.
                    </Snackbar>
                </>
            )}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    cardProduk: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    category: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
    },
    productTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d9534f',
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    sizeButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    sizeButton: {
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
    },
    selectedSizeButton: {
        backgroundColor: '#007bff',
        color: '#fff',
    },
    sizeButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    selectedButtonText: {
        color: '#fff',
    },
    sizeInfoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    reviewContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333',
    },
    cornerIcon: {
        marginLeft: 'auto',
    },
    reviewListContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    reviewListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    reviewItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    reviewText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    reviewRating: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    reviewDate: {
        fontSize: 12,
        color: '#aaa',
    },
    noReviewText: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ProductDetails;
