import {collection, query, onSnapshot, where, doc, limit} from "@firebase/firestore";
import {FIRESTORE_DB} from "@/FirebaseConfig";
import {useEffect, useState} from "react";
import firebase from "firebase/compat";

export interface Product {
    id: string;
    nama: string;
    ukuran: string[];
    harga: number;
    gambar: string;
    stok: number;
    kategori: string;
    deskrsipsi: string;
    reviews: { user: string; comment: string }[];
}

export interface Category {
    id: string;
    nama: string;
    icon: string;
}

export interface Transaction {
    id: string,
    alamat: string;
    email: string | null | undefined;
    nomor: string;
    produk: {
        id_produk: string;
        quantity: number;
        harga: number;
        gambar: string;
        nama: string
    }[];
    status: string;
    timestamp: firebase.firestore.FieldValue;
    total: number;
}

export interface ReviewType {
    id: string;
    username: string;
    rating: number;
    komentar: string;
}

export interface Order {
    id: number;
    order_date: Date;
    customer_email: string;
    total: number;
}

export const useProducts = (): {
    product: Product[];
    fetchProductsByCategory: (category: string) => void;
    fetchProductDetail: (id: string) => void;
} => {
    const [product, setProducts] = useState<Product[]>([]);

    const productRef = collection(FIRESTORE_DB, 'products');

    const fetchProduct = () => {
        const productQuery = query(productRef, limit(6));
        return onSnapshot(productQuery, (snapshot) => {
            const products: Product[] = [];

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const product = {
                    id: doc.id,
                    nama: data.nama,
                    ukuran: data.ukuran,
                    harga: typeof data.harga === 'string' ? parseFloat(data.harga) : data.harga,
                    gambar: data.gambar,
                    stok: data.stok,
                    kategori: data.kategori,
                    deskrsipsi: data.deskripsi,
                    reviews: data.reviews,
                };

                if (!isNaN(product.harga)) {
                    products.push(product);
                }
            });

            setProducts(products);
        });
    };

    const fetchProductsByCategory = (category: string) => {
        const q = query(productRef, where('kategori', '==', category));
        return onSnapshot(q, (snapshot) => {
            const products: Product[] = [];

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const product: Product = {
                    id: doc.id,
                    nama: data.nama,
                    ukuran: data.ukuran,
                    harga: typeof data.harga === 'string' ? parseFloat(data.harga) : data.harga,
                    gambar: data.gambar,
                    kategori: data.kategori,
                    stok: data.stok,
                    deskrsipsi: data.deskripsi,
                    reviews: data.reviews,
                };

                if (!isNaN(product.harga)) {
                    products.push(product);
                }
            });

            setProducts(products);
        });
    };

    const fetchProductDetail = (id: string) => {
        const productDocRef = doc(FIRESTORE_DB, 'products', id);
        return onSnapshot(productDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const productDetail: Product = {
                    id: docSnapshot.id,
                    nama: data?.nama,
                    ukuran: data?.ukuran,
                    harga: typeof data?.harga === 'string' ? parseFloat(data.harga) : data.harga,
                    gambar: data?.gambar,
                    kategori: data?.kategori,
                    stok: data?.stok,
                    deskrsipsi: data?.deskripsi,
                    reviews: data?.reviews,
                };

                if (!isNaN(productDetail.harga)) {
                    setProducts([productDetail]); // Assuming you want to set only the detailed product
                }
            }
        });
    }

    useEffect(() => {
        const unsubscribe = fetchProduct();
        return () => unsubscribe();
    }, []);

    return {product, fetchProductDetail, fetchProductsByCategory};
}

export const useTransaction = (): {
    transaction: Transaction[];
    fetchTransaction: () => void;
    fetchTransactionByEmail: (email: string | null | undefined) => void;
    fetchTransactionDetail: (id: string) => void;
} => {
    const [transaction, setTransaction] = useState<Transaction[]>([]);

    const transactionRef = collection(FIRESTORE_DB, 'transactions');

    const fetchTransaction = () => {
        return onSnapshot(transactionRef, (snapshot) => {
            const transaction: Transaction[] = [];

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const trx = {
                    id: doc.id,
                    alamat: data.alamat,
                    email: data.email,
                    nomor: data.nomor,
                    produk: data.produk,
                    status: data.status,
                    timestamp: data.timestamp,
                    total: data.total,
                };

                transaction.push(trx);
            });

            setTransaction(transaction);
        });
    };

    const fetchTransactionByEmail = (email: string | null | undefined) => {
        const q = query(transactionRef, where('email', '==', email));
        return onSnapshot(q, (snapshot) => {

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const trxDetail: Transaction = {
                    id: doc.id,
                    alamat: data?.alamat,
                    email: data?.email,
                    nomor: data?.nomor,
                    produk: data?.produk,
                    status: data?.status,
                    timestamp: data?.timestamp,
                    total: data?.total,
                };

                setTransaction([trxDetail]); // Assuming you want to set only the detailed transaction
            })
        })
    }

    const fetchTransactionDetail = (id: string) => {
        const trxDocRef = doc(FIRESTORE_DB, 'transactions', id);
        return onSnapshot(trxDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const trxDetail: Transaction = {
                    id: docSnapshot.id,
                    alamat: data?.alamat,
                    email: data?.email,
                    nomor: data?.nomor,
                    produk: data?.produk,
                    status: data?.status,
                    timestamp: data?.timestamp,
                    total: data?.total,
                };

                setTransaction([trxDetail]); // Assuming you want to set only the detailed transaction
            }
        })
    }

    useEffect(() => {
        const unsubscribe = fetchTransaction();
        return () => unsubscribe();
    }, []);

    return {transaction, fetchTransaction, fetchTransactionByEmail, fetchTransactionDetail};
}

export const useCategory = (): {
    categories: Category[];
    fetchCategories: () => void;
} => {
    const [categories, setCategories] = useState<Category[]>([]);

    const categoryRef = collection(FIRESTORE_DB, 'category');

    const fetchCategories = () => {
        return onSnapshot(categoryRef, (snapshot) => {
            const categories: Category[] = [];

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const category = {
                    id: doc.id,
                    nama: data.nama,
                    icon: data.icon,
                };

                categories.push(category);
            });

            setCategories(categories);
        });
    };

    useEffect(() => {
        const unsubscribe = fetchCategories();
        return () => unsubscribe();
    }, []);

    return {categories, fetchCategories};
}