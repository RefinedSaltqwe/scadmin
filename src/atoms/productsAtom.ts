import { VariantOption, VariantValue } from "@/components/Product/ProductVariant";
import { atom } from "recoil";

export interface Product {
    id?: string
    title: string
    description: string;
    images: string [];
    price: string;
    comparePrice: string;
    productTax: boolean;
    taxPerItem: string;
    sku: string;
    barcode: string;
    trackQuantity: boolean;
    continueSelling: boolean;
    shippingType: "physical" | "digital";
    shippingWeight: string;
    weightType: "lb" | "oz" | "kg" | "g";
}

export const defaultProduct: Product = {
    title: "",
    description: "",
    images: [],
    price: "",
    comparePrice: "",
    productTax: false,
    taxPerItem: "",
    sku: "",
    barcode: "",
    trackQuantity: true,
    continueSelling: false,
    shippingType: "physical",
    shippingWeight: "",
    weightType: "kg"
}

export const defaultVariantValue: VariantValue = {
    id: "",
    variantName: "",
    variantImage: "",
    variantPrice: "",
    variantComparePrice: "",
    variantAvailability: "0",
    variantOnHand: "0",
    variantSKU: "",
    variantBarcode: "",
}

export const defaultVariantOption: VariantOption = {
    name: "",
    values: []
}

export interface ProductObject {
    product: Product;
    productList: Product [];
    productMedia: string[];
    variantOptionValues: VariantOption[];
    variantsDataGrid: VariantValue[];
}

export const defaultProductObject = {
    product: defaultProduct,
    productList: [],
    productMedia: [],
    variantOptionValues: [],
    variantsDataGrid: [],
};

export const productState = atom<ProductObject>({
  key: "productState",
  default: defaultProductObject,
});