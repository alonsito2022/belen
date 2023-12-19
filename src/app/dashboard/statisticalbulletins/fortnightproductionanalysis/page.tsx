"use client";
import { useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff, IWarehouse } from '@/app/types';
import Breadcrumb from "@/components/Breadcrumb"
import { useAppSelector } from "@/redux/hooks"
import FortnightProductionSummary from "./FortnightProductionSummary"
import FortnightProductionFilter from "./FortnightProductionFilter"

const initialStateFilterObj = {
  collectDate: "",
  collectCycle: "03",
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
function FortnightProductionAnalysisPage() {
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [summaryDailyEntries, setSummaryDailyEntries] = useState(initialStateSummaryDailyEntries);
    
    async function getFortnightProductionAnalysis(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        fortnightProductionAnalysis(warehouseId:${filterObj.warehouseId}, productTariffId:${filterObj.productTariffId}, fortnightValue:${fort}, collectCycle:"${filterObj.collectCycle}") {
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
        if(fort>0){
            getFortnightProductionAnalysis();
            
        }

    }, [fort, filterObj.collectCycle]);

    function obtenerNombreMes (numero : number) {
        let miFecha = new Date();
        if (0 < numero && numero <= 12) {
          miFecha.setMonth(numero - 1);
          return new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(miFecha);
        } else {
          return null;
        }
    }

    return (
        <>
            
            <Breadcrumb section={"Reportes"} article={`Resumen de produccion ${obtenerNombreMes(Number(fort.toString().substring(4, fort.toString().length - 1))) + " " + fort.toString().substring(0, 4)}`} />

            <div className="bg-white mt-2">

                <FortnightProductionFilter filterObj={filterObj} setFilterObj={setFilterObj} />
                <FortnightProductionSummary suppliers={suppliers} filterObj={filterObj}
                setSummaryDailyEntries={setSummaryDailyEntries} summaryDailyEntries={summaryDailyEntries} fort={fort}/>
            </div>
            
        
        </>
    )
}

export default FortnightProductionAnalysisPage