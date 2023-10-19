
export interface IPerson {
    id: number
    clientType: string
    clientTypeReadable?: string
    documentType?: string
    documentTypeReadable?: string
    documentNumber?: string
    names: string
    phone?: string
    email?: string
    address?: string
    license?: string
    district?: string
    districtReadable?: string
    
    isEnabled: boolean,
    countSupplierTariffs?: number
    suppliertariffSet?: Array<ISupplierTariff>
    operationDetailSet?: Array<IOperationDetail>
    priceTomorrow?: number
    priceAfternoon?: number
    quantityTomorrow?: number
    quantityAfternoon?: number
    supplierTariffId?: number
    supplierTariffPriceTomorrow?: number
    supplierTariffPriceAfternoon?: number
    priceMilkTomorrow?: number
    priceMilkAfternoon?: number
    priceMilkTomorrowByFortnight?: number
    priceMilkAfternoonByFortnight?: number
    supplierTariffIdByFortnight?: number
    quantityToReturnTomorrow?: number
    quantityToReturnAfternoon?: number
    returnStatusTomorrow?: string
    returnStatusAfternoon?: string
    priceGloria?: number
    priceGloriaTomorrow?: number
    priceGloriaAfternoon?: number
    quantityDeliveredTomorrow?: number
    quantityDeliveredAfternoon?: number

    totalQuantityTomorrowByFortnight?: number
    totalQuantityAfternoonByFortnight?: number
    costTotalGloriaTomorrowByFortnight?: number
    costTotalGloriaAfternoonByFortnight?: number
    priceGloriaAveragePerLiterTomorrow?: number
    priceGloriaAveragePerLiterAfternoon?: number

    quantityTomorrowBySupplier?: number
    quantityAfternoonBySupplier?: number
    costGeneralTomorrowBySupplier?: number
    costGeneralAfternoonBySupplier?: number
    costGloriaTomorrowBySupplier?: number
    costGloriaAfternoonBySupplier?: number
    averagePriceGloriaTomorrowBySupplier?: number
    averagePriceGeneralTomorrowBySupplier?: number
    averagePriceGloriaAfternoonBySupplier?: number
    averagePriceGeneralAfternoonBySupplier?: number

    date?: string
    productionQuantityTomorrow?: number
    productionPriceTomorrow?: number
    productionTotalTomorrow?: number
    productionQuantityAfternoon?: number
    productionPriceAfternoon?: number
    productionTotalAfternoon?: number
    gloriaShipmentQuantityTomorrow?: number
    gloriaShipmentPriceTomorrow?: number
    gloriaShipmentTotalTomorrow?: number
    gloriaShipmentQuantityAfternoon?: number
    gloriaShipmentPriceAfternoon?: number
    gloriaShipmentTotalAfternoon?: number


    milkId?: number
}

export interface IProduct {
    id: number
    code: number 
    name: string
    stockMin: number 
    stockMax: number 
    path: string
    cheeseClassification: string
    cheeseClassificationReadable?: string
    isSupply: boolean
    isPurchased: boolean
    isManufactured: boolean
    available: boolean
    producttariffSet?: IProductTariff
}

export interface IProductTariff {
    id: number
    productId?: number
    unitId?: number
    salePrice1?: number 
    salePrice2?: number 
    quantityMinimum?: number 
    productName?: string
    unitName?: string
}

export interface ISupplierTariff {
    id?: number
    productTariffId?: number 
    supplierId?: number 
    purchasePrice1?: number 
    purchasePrice2?: number 
    supplierName?: string
    productTariffName?: string
}

export interface IUser {
    userID?: number
    email?: string
    firstName?: string
    lastName?: string
    groups: Array<any>
    subsidiary: any,
    fortnightValue?: number
}

export interface IUnit {
    id?: number
    shortName?: string
    description?: string
}

export interface IWarehouse {
    id?: number
    name?: string
    category?: string
    categoryReadable?: string
    subsidiaryId?: number
    subsidiaryName?: string
}

export interface ISubsidiary {
    id?: number
    name?: string
    business_name?: string
    address?: string
    serial?: string
    phone?: string
    ruc?: string
}

export interface IOperation {
    id?: number
    turn?: string
    operationDate?: string
    operationType?: string
    operationTypeDisplay?: string
    operationAction?: string
    observation?: string
    user?: IUser
}

export interface IOperationDetail {
    id?: number
    operation?: IOperation
    productTariff?: IProductTariff
    price?: number
    quantity?: number
    subtotal?: number
    remainingQuantity?: number
    remainingPrice?: number
    remainingPriceTotal?: number
}

/*type Product = {
    productID: number;
    code: number;
    name?: string;
    stockMin: number;
    stockMax: number;
    path: string;
    cheeseClassification: string;
    isSupply: boolean;
    isPurchased: boolean;
    isManufactured: boolean;
    available: boolean;
};*/

// export default  { IProduct }