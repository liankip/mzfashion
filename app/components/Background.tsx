import {KeyboardAvoidingView, Platform, View, StyleSheet} from "react-native";
import theme from "tailwindcss/defaultTheme";

export default function Background({children}: { children: React.ReactNode }) {
    return (
        <View style={styles.background}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                {children}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FCFCFD',
    },
    container: {
        flex: 1,
        padding: 28,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})