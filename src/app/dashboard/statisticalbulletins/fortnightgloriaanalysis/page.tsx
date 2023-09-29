"use client";
import { useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff, IWarehouse } from '@/app/types';
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/hooks"
import FortnightGloryList from "@/components/statisticalbulletins/fortnightgloriaanalysis/FortnightGloryList"
import FortnightGlorySummary from "@/components/statisticalbulletins/fortnightgloriaanalysis/FortnightGlorySummary"

const initialStateFilterObj = {
    collectDate: "",
    collectType: "06",
    productTariffId: 5,
    warehouseId: 6,
    supplierId: 527,
}
const initialStateSummaryDailyEntries = {

    quantityLiter: -1,
    paymentCostOfGloriaPerLiter: -1,
    baseCost: -1,
    igvCost: -1,
    grossCost: -1,
    paymentUncleMichael: -1,
    totalNetIncome: 0,

    sumQuantityTotalTomorrow: 0,
    sumQuantityTotalAfternoon: 0,
    sumQuantityTotalTomorrowAndAfternoon: 0,
    sumCostTotalTomorrowAndAfternoon: 0,
    sumCostTotalGloriaPerFortnitght: 0,

}

function FortnightGloriaAnalysisPage() {
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [warehouses, setWarehouses] = useState< IWarehouse[]>([]);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [summaryDailyEntries, setSummaryDailyEntries] = useState(initialStateSummaryDailyEntries);

    async function getGloriaInvoiceByFortnight(){
        
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        gloriaInvoiceByFortnight(warehouseId:${filterObj.warehouseId}, fortnightValue:${fort}) {
                            id
                            price
    		                quantity
                            operation{
                                igvCost
                                paymentUncleMichael
                                baseCost
                            }
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.data.gloriaInvoiceByFortnight !== null){

                setSummaryDailyEntries(prev => ({...prev, 
                    quantityLiter: data.data.gloriaInvoiceByFortnight.quantity,
                    baseCost: Number(data.data.gloriaInvoiceByFortnight.operation.baseCost),
                    grossCost: Number(data.data.gloriaInvoiceByFortnight.operation.baseCost) - summaryDailyEntries.sumCostTotalTomorrowAndAfternoon,
                    igvCost: Number(data.data.gloriaInvoiceByFortnight.operation.igvCost),
                    paymentUncleMichael: Number(data.data.gloriaInvoiceByFortnight.operation.paymentUncleMichael),
                    totalNetIncome: Number(data.data.gloriaInvoiceByFortnight.operation.baseCost) - summaryDailyEntries.sumCostTotalTomorrowAndAfternoon + Number(data.data.gloriaInvoiceByFortnight.operation.igvCost) - Number(data.data.gloriaInvoiceByFortnight.operation.paymentUncleMichael)
                }))
            }
            else
                setSummaryDailyEntries(prev => ({...prev, 
                    quantityLiter: 0,
                    baseCost: 0,
                    grossCost: 0,
                    igvCost: 0,
                    paymentUncleMichael: 0,
                    totalNetIncome: 0,
                }))
        })
    }

    async function getPaymentCostOfGloriaPerLiter(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        clientTariffById(clientId:${528}, fortnightValue:${fort}) {
                            id
                            clientName
                            salePrice1
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.data.clientTariffById !== null)
                setSummaryDailyEntries(prev => ({...prev, paymentCostOfGloriaPerLiter: data.data.clientTariffById.salePrice1}))
            else
                setSummaryDailyEntries(prev => ({...prev, paymentCostOfGloriaPerLiter: 0}))
        }).then(()=>{
            getGloriaInvoiceByFortnight();
        })
    }

    async function getSuppliersWithGloriaShipments(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        fortnightGloriaAnalysis(warehouseId:${filterObj.warehouseId}, productTariffId:${filterObj.productTariffId}, fortnightValue:${fort}) {
                            id
                            names
                            totalQuantityTomorrowByFortnight
                            totalQuantityAfternoonByFortnight
                            costTotalGloriaTomorrowByFortnight
                            costTotalGloriaAfternoonByFortnight
                            priceGloriaAveragePerLiterTomorrow
                            priceGloriaAveragePerLiterAfternoon
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSuppliers(data.data.fortnightGloriaAnalysis);
        }).then(()=>{
            getPaymentCostOfGloriaPerLiter();
        })
        
    }

    useEffect(() => {
        if(fort>0){
            getSuppliersWithGloriaShipments();
            
        }

    }, [fort]);

    useEffect(() => {
        if(suppliers.length > 0 && summaryDailyEntries.paymentCostOfGloriaPerLiter>0){
            let valueSumQuantityTotalTomorrow = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.totalQuantityTomorrowByFortnight!), 0);
            let valueSumQuantityTotalAfternoon = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.totalQuantityAfternoonByFortnight!), 0);
            let valSumQuantityTotalTomorrowAndAfternoon= suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.totalQuantityTomorrowByFortnight! + currentValue.totalQuantityAfternoonByFortnight!), 0);
            let valSumCostTotalTomorrowAndAfternoon = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(Math.round(Number(currentValue.totalQuantityTomorrowByFortnight!*currentValue.priceGloriaAveragePerLiterTomorrow! + currentValue.totalQuantityAfternoonByFortnight!*currentValue.priceGloriaAveragePerLiterAfternoon!)* 100) / 100), 0);
            let valueSumCostTotalGloriaPerFortnitght = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(Math.round(Number(summaryDailyEntries.paymentCostOfGloriaPerLiter*(currentValue.totalQuantityTomorrowByFortnight! + currentValue.totalQuantityAfternoonByFortnight!))* 100) / 100), 0);
            
            setSummaryDailyEntries({...summaryDailyEntries, 
                sumQuantityTotalTomorrow: Math.round(valueSumQuantityTotalTomorrow * 100) / 100,
                sumQuantityTotalAfternoon: Math.round(valueSumQuantityTotalAfternoon * 100) / 100,
                sumQuantityTotalTomorrowAndAfternoon: Math.round(valSumQuantityTotalTomorrowAndAfternoon * 100) / 100,
                sumCostTotalTomorrowAndAfternoon: Math.round(valSumCostTotalTomorrowAndAfternoon * 100) / 100,
                sumCostTotalGloriaPerFortnitght: Math.round(valueSumCostTotalGloriaPerFortnitght * 100) / 100
            });
        }
    }, [suppliers, summaryDailyEntries.paymentCostOfGloriaPerLiter]);

    return (
        <>
        
            <div className="flex justify-between my-3">

                <h2 className="text-4xl font-bold dark:text-white pb-2">Resumen de gloria {fort}</h2>
            
            </div>

            <FortnightGloryList suppliers={suppliers} summaryDailyEntries={summaryDailyEntries} />
            <FortnightGlorySummary suppliers={suppliers} filterObj={filterObj}
                setSummaryDailyEntries={setSummaryDailyEntries} summaryDailyEntries={summaryDailyEntries} fort={fort}/>
        </>
    )
}

export default FortnightGloriaAnalysisPage