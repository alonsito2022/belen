
export interface ICategory {
    id: number
    name?: string
    subsidiaryId: number
    isEnabled: boolean
}
export interface ISubcategory {
    id: number
    subsidiaryId: number
    categoryId: number
    name?: string
    category?: ICategory
    isEnabled: boolean
}

export interface IElement {
    id: number
    subsidiaryId: number
    subcategoryId: number
    categoryId: number
    name?: string
    subcategory?: ISubcategory
    isEnabled: boolean
}

export interface ICheeseSupplier {
    id: number
    name?: string
    
    pariah?: string
    mozzarella?: string
    tilsit?: string
    andean?: string
    edam?: string
    gouda?: string
}

export interface IChoice {
    id: string
    value?: string
}

export interface ICashFlow {
    id: number
    userId?: number
    operationId?: number
    total?: number
    transactionDate?: string
    transactionType?: string
    description?: string
}
export interface IEntry {
    id: number
    saleCenterId?: number
    operationDate?: string
    operationType?: string
    operationStatus?: string
    clientId?: number
    previousBalance?: number
    supplierId?: number
    userId?: number
    productTariffId?: number
    quantity?: number
    price?: number
    

    suppliers?: Array<number>
    productTariffs?: Array<number>
    quantities?: Array<number>
    prices?: Array<number>
    discounts?: Array<number>
    productNames?: Array<string>
    supplierNames?: Array<string>

    baseCost?: number
    igvCost?: number
    totalSale?: number

    totalPreviousBalance?: number
    totalNet?: number
    cash?: number
    deposit?: number
    subtraction?: number

    payedInCash?: number
    payedInDeposit?: number

    hasIgv?: boolean
    isFictitious?: boolean
    observation?: string
    documentType?: string
    documentNumber?: string

    operationdetailSet?: Array<IOperationDetail>
    cashflowSet?: Array<ICashFlow>
    client?: IPerson

}
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
    salesCenter?: string
    salesCenterReadable?: string
    
    isEnabled: boolean
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
    saleCenterId?: number
    saleCenterName?: string
    saleCenter?: ISaleCenter
    lastSubtraction?: string
}

export interface IProduct {
    id: number
    code: number 
    name: string
    stockMin: number 
    stockMax: number 
    path: string
    typeDairy: string
    typeDairyReadable?: string
    classification: string
    classificationReadable?: string
    isCollected: boolean
    isPurchased: boolean
    isManufactured: boolean
    available: boolean
    producttariffSet?: IProductTariff
    totalProductTariff?: number
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
    purchasePrice1?: number 
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
    subsidiary?: ISubsidiary,
    fortnightValue?: number,

    role?: string,
    roleReadable?: string,
    code?: number,
    remuneration?: number,
    names?: string,
    document?: string,
    phone?: string,
    address?: string,
    birthDate?: string,
    phoneOfRelative?: string,
    startDate?: string,
    endDate?: string,
    isActive?: boolean,
    id?: number
    subsidiaryId?: number


}

export interface IUnit {
    id?: number
    shortName?: string
    description?: string
}

export interface ISaleCenter {
    id?: number
    name?: string
}

export interface IWarehouse {
    id?: number
    name?: string
    category?: string
    categoryReadable?: string
    subsidiaryId?: number
    subsidiaryName?: string
}

export interface IAttendanceIncidence {
    attendanceDetailId?: number
    employeeId?: number
    substituteEmployeeId?: number
    statusChoice?: string
    registerDate?: string
    firstName?: string
    lastName?: string
    observation?: string
}

export interface IAttendanceListUser {
    userId?: number
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

export interface IAttendanceOfMonth {
    employee?: IUser
    attendancedetailSet?: Array<IAttendanceDetail>
    countT?: number
    countPE?: number
    countNT?: number
    countNA?: number
    totalDaysWorked?: number
    totalDaysNoWorked?: number
    totalReplacementDays?: number
    remunerationExtra?: number
    remunerationDiscounted?: number
    totalRemuneration?: number
}

export interface IDayOfMonth {
    id?: number
    name?: string
}

export interface IAttendanceDetail {
    id?: number
    day?: number
    status?: string
    registerDate?: string
    observation?: string
    substituteEmployeeId?: number
    replacementEmployeeId?: number
    substituteEmployee?: IUser
    replacementEmployee?: IUser

}

export interface IOperation {
    id: number
    turn?: string
    formattedDate?: string
    dayNameResult?: string
    operationDate?: string
    operationStatus?: string
    operationType?: string
    documentTypeReadable?: string
    operationTypeDisplay?: string
    operationTypeReadable?: string
    operationAction?: string
    observation?: string
    documentNumber?: string
    user?: IUser
    supplier?: IPerson
    client?: IPerson
    lastSubtraction?: number
    baseCost?: number
    igvCost?: number
    totalSale?: number

    payedInCash?: number
    payedInDeposit?: number

    isFictitious?: boolean

    previousBalance?: number
    totalNet?: number
    cash?: number
    deposit?: number
    subtraction?: number
    cashflowSet?: Array<ICashFlow>
}

export interface IEntryAndSaleByWeek {
    startDate?: string
    endDate?: string
    entries?: Array<ISaleOfWeekDay>
    sales?: Array<ISaleOfWeekDay>
    shippingCost?: number
    description?: string
}

export interface IDateAndWeekday {
    formattedDate?: string
    formattedWeekday?: string
}

export interface IBalanceByWeek {
    productTariffId?: number
    productName?: string
    totalEntries?: number
    totalRemnants?: number
    totalLosses?: number
    totalReturns?: number
    totalSales?: number
    totalGeneral?: number
}

export interface IEntriesByWeek {
    productName?: string
    salesOf0?: Array<ISaleOfWeekDay>
    salesOf1?: Array<ISaleOfWeekDay>
    salesOf2?: Array<ISaleOfWeekDay>
    salesOf3?: Array<ISaleOfWeekDay>
    salesOf4?: Array<ISaleOfWeekDay>
    salesOf5?: Array<ISaleOfWeekDay>
    salesOf6?: Array<ISaleOfWeekDay>
}

export interface IExpensesByWeek {
    expensesOf0?: Array<IExpenseOfWeekDay>
    expensesOf1?: Array<IExpenseOfWeekDay>
    expensesOf2?: Array<IExpenseOfWeekDay>
    expensesOf3?: Array<IExpenseOfWeekDay>
    expensesOf4?: Array<IExpenseOfWeekDay>
    expensesOf5?: Array<IExpenseOfWeekDay>
    expensesOf6?: Array<IExpenseOfWeekDay>
}

export interface IDayInfo{
    incomesInCash?: number
    incomesInDeposit?: number
    expenses?: number
    total?: number
}
export interface IExpenseOfWeekDay{
    id?: number
    userId?: number
    userName?: string
    description?: string
    total?: number
    transactionDate?: string
    transactionType?: string
}

export interface ISaleOfWeekDay{
    operationDetailId?: number
    clientName?: string
    supplierName?: string
    saleCenterName?: string
    day?: number
    formattedDate?: string
    quantity?: number
    price?: number
    subtotal?: number
    discount?: number
    subtotalWithDiscount?: number
}

export interface IOperationDetail {
    id?: number
    operation?: IOperation
    productTariff?: IProductTariff
    supplier?: IPerson
    price?: number
    discount?: number
    quantity?: number
    subtotal?: number
    remainingQuantity?: number
    remainingPrice?: number
    remainingPriceTotal?: number
    batchCode?: number
    batchStock?: number
    batchPrice?: number
    batchPriceTotal?: number
    productTariffs?: Array<number>
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