import {initializeApp} from 'firebase/app';
import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBC44NBrYLDn41GgQ8Vdb558z2EscEZC_Q",
    authDomain: "mz-fashion-d0843.firebaseapp.com",
    projectId: "mz-fashion-d0843",
    storageBucket: "mz-fashion-d0843.appspot.com",
    messagingSenderId: "278209713484",
    appId: "1:278209713484:web:b0ac1c5aa0cde5210debe9",
    measurementId: "G-Z00465LW2F"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
