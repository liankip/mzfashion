import {View, StyleSheet, ActivityIndicator, Alert} from "react-native";
import {Button, Text, TextInput} from "react-native-paper";
import React from "react";
import {FIREBASE_AUTH} from "@/FirebaseConfig";
import {signInWithEmailAndPassword} from "@firebase/auth";
import {LoginPageProps} from "@/app/navigation/ProductsStackNav";

const Login = ({navigation}: LoginPageProps) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password).then((user) => {
                if (user.user.email === 'admin@mzfashion.com') {
                    navigation.navigate('Admin');
                } else {
                    navigation.navigate('Products');
                }
            }).catch((error) => {
                Alert.alert('Login gagal', error.message);
            });
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none"
                       onChangeText={(text) => setEmail(text)}
                       keyboardType="email-address"
                       left={<TextInput.Icon icon="email"/>}/>
            <TextInput value={password} style={styles.input} placeholder="Password" autoCapitalize="none"
                       secureTextEntry
                       onChangeText={(text) => setPassword(text)}
                       left={<TextInput.Icon icon="key"/>}/>

            {loading ? (
                <ActivityIndicator size="large" color="#000"/>
            ) : (
                <Button mode="contained"
                        style={{marginTop: 10, backgroundColor: '#121330', borderRadius: 0, padding: 10}}
                        onPress={() => {
                            signIn().then(r => console.log(r))
                        }}>
                    <Text style={{color: '#fff'}}> Masuk</Text>
                </Button>
            )}

            <Text variant="titleMedium" style={{color: '#000', textAlign: 'center', marginTop: 10}}>Atau</Text>

            <Button mode="contained" style={{marginTop: 10, backgroundColor: '#121330', borderRadius: 0, padding: 10}}
                    onPress={() => navigation.navigate('Register')}>
                <Text style={{color: '#fff'}}>Daftar</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        backgroundColor: '#fff'
    }
})

export default Login