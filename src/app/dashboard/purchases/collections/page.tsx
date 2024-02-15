"use client";

import { useState, useEffect } from "react";
import { IPerson, IProductTariff, IWarehouse } from '@/app/types';
import CollectionList from "./CollectionList"
import CollectionFilter from "./CollectionFilter"
import CollectionSummary from "./CollectionSummary"
import { useAppSelector } from "@/redux/hooks"
import Breadcrumb from "@/components/Breadcrumb"

const initialStateFilterObj = {
    collectDate: "",
    collectType: "06",
    productTariffId: 5,
    warehouseId: 6,
    supplierId: 527,
}
const initialStateSummaryDailyEntries = {
    quantityTotalAfternoon: 0,
    costTotalAfternoon: 0,
    quantityTotalTomorrow: 0,
    costTotalTomorrow: 0,

    quantitySendToGloria: -1,
    paymentCostOfGloriaPerLiter: -1,
    quantityFermented: -1,
    quantityMoldsProduced: -1,

    costTotalRealToGloria: 0,
    costTotalEstimatedByGloria: 0,
    quantityInChiller: 0,
    costRealInChiller: 0,
    averageCostPerLiterAfternoon: 0,
    averageCostPerLiterTomorrow: 0,
    realVsGloriaDifference: 0,
    litersUsed: 0,
    costTotalLitersUsed: 0,
    averageCostPerLiterUsed: 0,
    litersCut: 0,
    performance: 0,
    costRealPerformancePerLiter: 0,


}

function CollectionPage() {
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [warehouses, setWarehouses] = useState< IWarehouse[]>([]);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [summaryDailyEntries, setSummaryDailyEntries] = useState(initialStateSummaryDailyEntries);
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    
    
    async function getQuantitySendToGloria(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        belenSendToGloria(supplierId:${filterObj.supplierId},warehouseId:${filterObj.warehouseId}, collectDate:"${filterObj.collectDate}", fortnightValue:${fort}) {
                            quantity
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.data.belenSendToGloria !== null)
                setSummaryDailyEntries(prev => ({...prev, quantitySendToGloria: data.data.belenSendToGloria.quantity}))
            else
                setSummaryDailyEntries(prev => ({...prev, quantitySendToGloria: 0}))
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
        })
    }

    async function getQuantityShipmentToFermentation(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        shipmentToFermentation(supplierId:${filterObj.supplierId},warehouseId:${filterObj.warehouseId}, collectDate:"${filterObj.collectDate}", fortnightValue:${fort}) {
                            quantity
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.data.shipmentToFermentation !== null)
                setSummaryDailyEntries(prev => ({...prev, quantityFermented: data.data.shipmentToFermentation.quantity}))
            else
                setSummaryDailyEntries(prev => ({...prev, quantityFermented: 0}))
        })
    }
    
    async function getMoldsProduced(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        moldsProduced(supplierId:${filterObj.supplierId},warehouseId:${filterObj.warehouseId}, collectDate:"${filterObj.collectDate}", fortnightValue:${fort}) {
                            quantity
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.data.moldsProduced !== null)
                setSummaryDailyEntries(prev => ({...prev, quantityMoldsProduced: data.data.moldsProduced.quantity}))
            else
                setSummaryDailyEntries(prev => ({...prev, quantityMoldsProduced: 0}))
        })
    }

    async function getSuppliersWithDailyEntries(){
        
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        dailyEntriesForProduction(warehouseId:${filterObj.warehouseId}, collectDate:"${filterObj.collectDate}", fortnightValue:${fort}) {
                            id
                            names
                            quantityTomorrow
                            quantityAfternoon
                            priceTomorrow
                            priceAfternoon
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSuppliers(data.data.dailyEntriesForProduction);
            setSummaryDailyEntries(initialStateSummaryDailyEntries);
        }).then(()=>{

            getQuantitySendToGloria();
            getPaymentCostOfGloriaPerLiter();
            getQuantityShipmentToFermentation();
            getMoldsProduced();
        })
        
    }

    useEffect(() => {
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, collectDate: defaultValue});
    }, []);

    useEffect(() => {
        
        if(filterObj.collectDate.length>0 && fort>0){
            getSuppliersWithDailyEntries();
        }

    }, [filterObj.collectDate, fort]);

    useEffect(() => {
        
        if(suppliers.length > 0){
            let valueQuantityTotalTomorrow = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow!), 0);
            let valueCostTotalTomorrow = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow!*currentValue.priceTomorrow!), 0);
            let valueQuantityTotalAfternoon = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon!), 0);
            let valueCostTotalAfternoon = suppliers.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon!*currentValue.priceAfternoon!), 0);
            setSummaryDailyEntries({...summaryDailyEntries, 
                quantityTotalTomorrow: Math.round(valueQuantityTotalTomorrow * 100) / 100,
                // costTotalTomorrow: valueCostTotalTomorrow,
                costTotalTomorrow: Math.round((Math.round(valueCostTotalTomorrow * 1000) / 1000) * 100) / 100,
                quantityTotalAfternoon: Math.round(valueQuantityTotalAfternoon * 100) / 100,
                // costTotalAfternoon: Math.round(valueCostTotalAfternoon * 100) / 100
                costTotalAfternoon: Math.round((Math.round(valueCostTotalAfternoon * 1000) / 1000) * 100) / 100
            });
            
        }


    }, [suppliers]);

    useEffect(() => {
        if(
            summaryDailyEntries.quantitySendToGloria > -1 &&
            summaryDailyEntries.paymentCostOfGloriaPerLiter > -1 &&
            summaryDailyEntries.quantityFermented > -1 &&
            summaryDailyEntries.quantityMoldsProduced > -1
        ){

            if(summaryDailyEntries.quantityTotalTomorrow>0 || summaryDailyEntries.quantityTotalAfternoon>0){

                let valueQuantityInChiller=0, valueLitersUsed=0, valueAverageCostPerLiterTomorrow=0, valueAverageCostPerLiterAfternoon=0, 
                valueCostTotalRealToGloria=0, valueCostRealInChiller=0, valueCostTotalEstimatedByGloria=0, valueRealVsGloriaDifference=0, 
                valueCostTotalLitersUsed=0, valueAverageCostPerLiterUsed=0,
                valueCostRealPerformancePerLiter=0, valueLitersCut=0, valuePerformance=0
                
                valueQuantityInChiller = summaryDailyEntries.quantityTotalAfternoon-Number(summaryDailyEntries.quantitySendToGloria);
                valueLitersUsed = valueQuantityInChiller+summaryDailyEntries.quantityTotalTomorrow;
                if(summaryDailyEntries.quantityTotalTomorrow>0){
                    valueAverageCostPerLiterTomorrow = summaryDailyEntries.costTotalTomorrow/summaryDailyEntries.quantityTotalTomorrow;
                }
                if(summaryDailyEntries.quantityTotalAfternoon>0){
                    valueAverageCostPerLiterAfternoon = summaryDailyEntries.costTotalAfternoon/summaryDailyEntries.quantityTotalAfternoon;
                    valueCostTotalRealToGloria = Number(summaryDailyEntries.quantitySendToGloria)*valueAverageCostPerLiterAfternoon;
                    valueCostRealInChiller = valueQuantityInChiller*valueAverageCostPerLiterAfternoon;
                    valueCostTotalEstimatedByGloria = Number(summaryDailyEntries.quantitySendToGloria)*Number(summaryDailyEntries.paymentCostOfGloriaPerLiter);
                    valueRealVsGloriaDifference = Number(valueCostTotalRealToGloria-valueCostTotalEstimatedByGloria)
                    valueCostTotalLitersUsed = Number(valueCostRealInChiller+summaryDailyEntries.costTotalTomorrow)
                }
    
                if(valueLitersUsed > 0){
                    valueAverageCostPerLiterUsed = valueCostTotalLitersUsed/valueLitersUsed;
                    valueLitersCut=valueLitersUsed-Number(summaryDailyEntries.quantityFermented);
                }
    
                if(Number(summaryDailyEntries.quantityMoldsProduced) > 0){
                    valuePerformance=valueLitersUsed/Number(summaryDailyEntries.quantityMoldsProduced)
                    valueCostRealPerformancePerLiter = valueAverageCostPerLiterUsed*valuePerformance;
                }

                setSummaryDailyEntries({...summaryDailyEntries, 
                    averageCostPerLiterTomorrow: Math.round(valueAverageCostPerLiterTomorrow * 10000) / 10000,
                    averageCostPerLiterAfternoon: Math.round(valueAverageCostPerLiterAfternoon * 10000) / 10000,
                    costTotalRealToGloria: valueCostTotalRealToGloria,
                    costRealInChiller: valueCostRealInChiller,
                    costTotalEstimatedByGloria: valueCostTotalEstimatedByGloria,
                    realVsGloriaDifference: valueRealVsGloriaDifference,
                    costTotalLitersUsed: valueCostTotalLitersUsed,
                    quantityInChiller: valueQuantityInChiller,
                    litersUsed: valueLitersUsed,
                    averageCostPerLiterUsed: Math.round(valueAverageCostPerLiterUsed * 10000) / 10000,
                    costRealPerformancePerLiter: Math.round(valueCostRealPerformancePerLiter * 10000) / 10000,
                    litersCut: valueLitersCut,
                    performance: valuePerformance
                });
    
            }

        }

        

    }, [
        summaryDailyEntries.quantitySendToGloria,
        summaryDailyEntries.paymentCostOfGloriaPerLiter, 
        summaryDailyEntries.quantityFermented, 
        summaryDailyEntries.quantityMoldsProduced
    ]);

    return (
        <>
            <Breadcrumb section={"Producción"} article={`Produccion`} />

            <CollectionFilter getSuppliersWithDailyEntries={getSuppliersWithDailyEntries} setFilterObj={setFilterObj} filterObj={filterObj} />
            <CollectionList suppliers={suppliers} summaryDailyEntries={summaryDailyEntries}  fort={fort} filterObj={filterObj} getSuppliersWithDailyEntries={getSuppliersWithDailyEntries} />
            <CollectionSummary suppliers={suppliers} filterObj={filterObj}
                setSummaryDailyEntries={setSummaryDailyEntries} summaryDailyEntries={summaryDailyEntries} fort={fort}
             />
        </>
    )
}

export default CollectionPage