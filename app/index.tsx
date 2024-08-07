import {NavigationContainer} from '@react-navigation/native';
import ProductsStackNav from './navigation/ProductsStackNav';
import {PaperProvider} from "react-native-paper";

export default function Index() {
    return (
        <NavigationContainer independent={true}>
            <PaperProvider>
                <ProductsStackNav/>
            </PaperProvider>
        </NavigationContainer>
    );
}
