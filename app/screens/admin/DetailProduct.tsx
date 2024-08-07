import {DetailProductPageProps} from "@/app/navigation/ProductsStackNav";

const DetailProduct = ({route}: DetailProductPageProps) => {
    const {id} = route.params;
    console.log(id)
}

export default DetailProduct