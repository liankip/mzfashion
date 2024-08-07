import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FIREBASE_AUTH} from '@/FirebaseConfig';
import {signOut} from "@firebase/auth";
import {LogoutPageProps} from "@/app/navigation/ProductsStackNav";

const LogOut = ({navigation}: LogoutPageProps) => {

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await signOut(FIREBASE_AUTH).then(r => console.log(r));
                navigation.navigate("Login");
            } catch (error) {
                console.error("Logout Error: ", error);
            }
        };

        handleLogout().then(r => r);
    }, []);

    return (
        <View style={styles.container}>
            <Text>Logging out...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LogOut;