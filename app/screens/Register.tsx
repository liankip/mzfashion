import {ActivityIndicator, StyleSheet, View} from "react-native";
import {Text, TextInput, Button} from "react-native-paper";
import React from "react";
import {FIREBASE_AUTH} from "@/FirebaseConfig";
import {createUserWithEmailAndPassword, updateProfile} from "@firebase/auth";

const Register = () => {
    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: username,
                });
            } else {
                console.error("No user is currently signed in.");
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <TextInput textColor="black" value={username} style={styles.input} placeholder="Username"
                       autoCapitalize="none"
                       onChangeText={(text) => setUsername(text)}
                       left={<TextInput.Icon icon="tag"/>}/>
            <TextInput textColor="black" value={email} style={styles.input} placeholder="Email" autoCapitalize="none"
                       onChangeText={(text) => setEmail(text)}
                       left={<TextInput.Icon icon="email"/>}/>
            <TextInput textColor="black" value={password} style={styles.input} placeholder="Password" secureTextEntry
                       autoCapitalize="none"
                       onChangeText={(text) => setPassword(text)}
                       left={<TextInput.Icon icon="key"/>}/>
            {loading ? (
                <ActivityIndicator size="large" color="#000"/>
            ) : (
                <Button mode="contained"
                        style={{marginTop: 10, backgroundColor: '#121330', borderRadius: 0, padding: 10}}
                        onPress={() => {
                            signUp().then(r => console.log(r))
                        }}>
                    <Text style={{color: '#fff'}}>Daftar</Text>
                </Button>
            )}
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

export default Register;
