"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IMonthElementData, IMonthExpenseCostData, IUser, IDateAndWeekday, ISubcategory, IElement } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import {obtenerSemanaActual, getDates} from '@/libs/functions'
import BethlehemResultList from "./BethlehemResultList"
import BethlehemResultFilter from "./BethlehemResultFilter"

const initialStateFilterObj = {
    collectCycle: "03",
    productTariffId: 5,
    warehouseId: 6,
    subsidiaryId: 1,
    year: new Date().getFullYear(),
    month: new Date().getMonth()
}

const initialStateSummaryDailyEntries = {

    quantityLiter: -1,
    paymentCostOfGloriaPerLiter: -1,
    baseCost: -1,
    igvCost: -1,
    grossCost: -1,
    paymentUncleMichael: -1,
    totalNetIncome: 0,

    sumQuantityMolds: -1,
    sumQuantitySendToGloria: -1,
    sumQuantityLitersUsed: -1,
    sumTotalLitersUsed: -1,
    costAveragePerformance: -1,
    costAveragePerformancePerLiter: -1,
    costAveragePerLiterUsed: -1,
    costAveragePriceGloria: -1,
    costAveragePriceAfternoon: -1,
    averagePricePerLiterPaidByGloria: -1,
    averagePricePerLiterPaidByBelen: -1,
    paymentDifference: -1,

}

function BethlehemResultPage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);

    const [categories, setCategories] = useState< IMonthElementData[]>([]);
    const [summaryDailyEntries, setSummaryDailyEntries] = useState(initialStateSummaryDailyEntries);

    async function fetchCategories(){
        let queryfecth = `
            query {
                expensesByYearAndMonthAndSubsidiary(year:${filterObj.year}, month:${Number(Number(filterObj.month) + 1)}, subsidiaryId:${filterObj.subsidiaryId}) {
                    sequence
                    name
                    type
                    stock
                    total
                }
            }
        `;

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setCategories(data.data.expensesByYearAndMonthAndSubsidiary);
        })
        
    }

    async function getFortnightProductionAnalysis(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        fortnightProductionAnalysis(warehouseId:${filterObj.warehouseId}, productTariffId:${filterObj.productTariffId}, fortnightValue:${0}, collectCycle:"${filterObj.collectCycle}", month:${Number(Number(filterObj.month) + 1)}, year:${filterObj.year}) {
                            id
                            supplierName
                            sumQuantityMolds
                            sumQuantitySendToGloria
                            sumQuantityLitersUsed
                            sumTotalLitersUsed
                            costAveragePerformance
                            costAveragePerformancePerLiter
                            costAveragePerLiterUsed
                            costAveragePriceGloria
                            costAveragePriceAfternoon
                            averagePricePerLiterPaidByGloria
                            averagePricePerLiterPaidByBelen
                            paymentDifference
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            let obj = data.data.fortnightProductionAnalysis[0];
            console.log(obj)
            if (obj !== null &&  obj != undefined)
                setSummaryDailyEntries(prev => ({...prev, 
                    sumQuantityMolds: obj.sumQuantityMolds,
                    sumQuantitySendToGloria: obj.sumQuantitySendToGloria,
                    sumQuantityLitersUsed: obj.sumQuantityLitersUsed,
                    sumTotalLitersUsed: obj.sumTotalLitersUsed,
                    costAveragePerformance: obj.costAveragePerformance,
                    costAveragePerformancePerLiter: obj.costAveragePerformancePerLiter,
                    costAveragePerLiterUsed: obj.costAveragePerLiterUsed,
                    costAveragePriceGloria: obj.costAveragePriceGloria,
                    costAveragePriceAfternoon: obj.costAveragePriceAfternoon,
                    averagePricePerLiterPaidByGloria: obj.averagePricePerLiterPaidByGloria,
                    averagePricePerLiterPaidByBelen: obj.averagePricePerLiterPaidByBelen,
                    paymentDifference: obj.paymentDifference,
                }))
            else
                setSummaryDailyEntries(prev => ({...prev, 
                    sumQuantityMolds: 0,
                    sumQuantitySendToGloria: 0,
                    sumQuantityLitersUsed: 0,
                    sumTotalLitersUsed: 0,
                    costAveragePerformance: 0,
                    costAveragePerformancePerLiter: 0,
                    costAveragePerLiterUsed: 0,
                    costAveragePriceGloria: 0,
                    costAveragePriceAfternoon: 0,
                    averagePricePerLiterPaidByGloria: 0,
                    averagePricePerLiterPaidByBelen: 0,
                    paymentDifference: 0,
                }))

        }).then(()=>{
            //getPaymentCostOfGloriaPerLiter();
        })
        
    }
    

    useEffect(() => {
        if(filterObj.year>0 && filterObj.month>=0)
            getFortnightProductionAnalysis()
            fetchCategories()
    }, [filterObj]);

    return (
        <>
            <Breadcrumb section={"Administración"} article={"Resultados Belen"} />

            <BethlehemResultFilter filterObj={filterObj} setFilterObj={setFilterObj}  />

            <BethlehemResultList categories={categories} summaryDailyEntries={summaryDailyEntries} />

        </>
    )
}

export default BethlehemResultPage