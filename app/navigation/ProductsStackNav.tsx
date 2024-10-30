import {NativeStackScreenProps, createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductDetails from '../screens/ProductDetails';
import Home from '../screens/Home';
import {NavigationProp} from '@react-navigation/native';
import CartModal from '../screens/CartModal';
import CartModalNav from "@/app/navigation/CartModalNav";
import React, {useEffect} from "react";
import Baju from "@/app/screens/Baju";
import Celana from "@/app/screens/Celana";
import Login from "@/app/screens/Login";
import Register from "@/app/screens/Register";
import {onAuthStateChanged, User} from "@firebase/auth";
import {FIREBASE_AUTH} from "@/FirebaseConfig";
import {createDrawerNavigator} from "@react-navigation/drawer";
import LogOut from "@/app/screens/Logout";
import Admin from "@/app/screens/admin/Admin";
import ListProduct from "@/app/screens/admin/Product";
import CreateProduct from "@/app/screens/admin/CreateProduct";
import firebase from "firebase/compat";
import Payment from "@/app/screens/Payment";
import History from "@/app/screens/History";
import HistoryDetails from "@/app/screens/HistoryDetails";
import DetailTransaction from "@/app/screens/admin/DetailTransaction";
import EditProduct from "@/app/screens/admin/EditProduct";

type ProductsStackParamList = {
    Admin: undefined;
    CartModal: undefined;
    Baju: undefined;
    Celana: undefined;
    CustomSidebarMen: undefined;
    InsideLayout: undefined;
    Login: undefined;
    Logout: undefined;
    Payment: {
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
    };
    ProductDetails: { id: string; name: string };
    Home: undefined;
    Register: undefined;
    Sidebar: undefined;
    History: undefined;
    HistoryDetails: { id: string };
};

type AdminStackParamList = {
    Admin: undefined;
    DetailTransaction: { id: string, nomor: string, status: string };
    SidebarAdmin: undefined;
    ListProduct: undefined;
    DetailProduct: { id: string; name: string };
    CreateProduct: undefined;
    EditProduct: { id: string; name: string };
    Logout: undefined;
}

const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
const Drawer = createDrawerNavigator<ProductsStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();
const DrawerAdmin = createDrawerNavigator<AdminStackParamList>();

export type ProductsPageProps = NativeStackScreenProps<ProductsStackParamList, 'Home'>;
export type LoginPageProps = NativeStackScreenProps<ProductsStackParamList, 'Login'>;
export type LogoutPageProps = NativeStackScreenProps<ProductsStackParamList, 'Logout'>;
export type ProductDetailsPageProps = NativeStackScreenProps<ProductsStackParamList, 'ProductDetails'>;
export type CartModalProps = NativeStackScreenProps<ProductsStackParamList, 'CartModal'>;
export type PaymentPageProps = NativeStackScreenProps<ProductsStackParamList, 'Payment'>;
export type HistoryPageProps = NativeStackScreenProps<ProductsStackParamList, 'History'>;
export type HistoryDetailPageProps = NativeStackScreenProps<ProductsStackParamList, 'HistoryDetails'>;
export type BajuPageProps = NativeStackScreenProps<ProductsStackParamList, 'Baju'>;
export type CelanaPageProps = NativeStackScreenProps<ProductsStackParamList, 'Celana'>;

export type AdminPageProps = NativeStackScreenProps<AdminStackParamList, 'Admin'>;
export type SidebarAdminPageProps = NativeStackScreenProps<AdminStackParamList, 'SidebarAdmin'>;
export type DetailTransactionPageProps = NativeStackScreenProps<AdminStackParamList, 'DetailTransaction'>;
export type ListProductPageProps = NativeStackScreenProps<AdminStackParamList, 'ListProduct'>;
export type CreateProductPageProps = NativeStackScreenProps<AdminStackParamList, 'CreateProduct'>;
export type DetailProductPageProps = NativeStackScreenProps<AdminStackParamList, 'DetailProduct'>;
export type EditProductPageProps = NativeStackScreenProps<AdminStackParamList, 'EditProduct'>;

export type StackNavigation = NavigationProp<ProductsStackParamList>;

function Sidebar() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={Home}
                           options={{
                               headerRight: () => <CartModalNav/>,
                               title: 'Beranda',
                           }}/>
            <Drawer.Screen name="History" component={History} options={{
                title: 'Daftar Belanja',
            }}/>
            <Drawer.Screen name="Logout" component={LogOut}/>
        </Drawer.Navigator>
    )
}

function SidebarAdmin() {
    return (
        <DrawerAdmin.Navigator>
            <DrawerAdmin.Screen name="Admin" component={Admin} options={{
                title: 'Beranda'
            }}/>
            <DrawerAdmin.Screen name="ListProduct" component={ListProduct} options={{
                title: 'Produk',
            }}/>
            <DrawerAdmin.Screen name="Logout" component={LogOut}/>
        </DrawerAdmin.Navigator>
    )
}

const ProductsStackNav = () => {
    const [user, setUser] = React.useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, user => {
            setUser(user);
        });
    }, [])

    return (
        <ProductsStack.Navigator>
            {user ? (
                <>
                    {user.email == 'admin@mzfashion.com' ? (
                        <>
                            <AdminStack.Screen name="SidebarAdmin" component={SidebarAdmin}
                                               options={{headerShown: false}}/>
                            <AdminStack.Screen name="Admin" component={Admin} options={{
                                title: 'Beranda',
                            }}/>
                            <AdminStack.Screen name="CreateProduct" component={CreateProduct} options={{
                                headerTitle: 'Buat Produk Baru',
                            }}/>
                            <AdminStack.Screen name="DetailTransaction" component={DetailTransaction} options={{
                                title: 'Detail Transaksi'
                            }}/>
                            <AdminStack.Screen name="EditProduct" component={EditProduct}/>
                        </>
                    ) : (
                        <>
                            <ProductsStack.Screen name="Sidebar" component={Sidebar} options={{headerShown: false}}/>
                            <ProductsStack.Screen name="Home" component={Home} options={{
                                title: 'Beranda',
                            }}/>
                            <ProductsStack.Screen name="ProductDetails" component={ProductDetails}
                                                  options={({route}) => ({
                                                      headerTitle: route.params.name,
                                                      headerRight: () =>
                                                          <CartModalNav/>
                                                  })}/>
                            <ProductsStack.Screen name="CartModal" component={CartModal}
                                                  options={{headerShown: false, presentation: 'modal'}}/>
                            <ProductsStack.Screen name="Payment" component={Payment}/>
                            <ProductsStack.Screen name="HistoryDetails" options={{
                                headerTitle: 'Detail Transaksi',
                            }} component={HistoryDetails}/>
                            <ProductsStack.Screen name="Baju" component={Baju} options={{
                                title: 'Baju'
                            }}/>
                            <ProductsStack.Screen name="Celana" component={Celana} options={{
                                title: 'Celana'
                            }}/>
                        </>
                    )}
                </>
            ) : (
                <>
                    <ProductsStack.Screen name="Login" component={Login}
                                          options={{headerShown: false}}/>
                    <ProductsStack.Screen name="Register" component={Register}
                                          options={{headerShown: false}}/>
                </>
            )}
        </ProductsStack.Navigator>
    );
};

export default ProductsStackNav;