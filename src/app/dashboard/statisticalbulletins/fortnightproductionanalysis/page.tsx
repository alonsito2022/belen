"use client";
import { useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff, IWarehouse } from '@/app/types';
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/hooks"
import FortnightProductionSummary from "@/components/statisticalbulletins/fortnightproductionanalysis/FortnightProductionSummary"

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

    totalMolds: -1,
    totalQuantityTomorrow: -1,
    totalQuantityAfternoon: -1,
    totalQuantityFermented: -1,
    totalQuantitySendFromBelenToGloria: -1,
    costTotalTomorrow: -1,
    costTotalAfternoon: -1,
    costAveragePerLiterTomorrow: -1,
    costAveragePerLiterAfternoon: -1,
    totalQuantityInChiller: -1,
    totalQuantityLitersUsed: -1,
    totalPerformance: -1,
    costPerformancePerLiter: -1,
    costTotalInChiller: -1,
    costTotalLitersUsed: -1,
    costAveragePerLiterUsed: -1,
    costAveragePerLiterGloria: -1,

}
function FortnightProductionAnalysisPage() {
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [warehouses, setWarehouses] = useState< IWarehouse[]>([]);
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
                        fortnightProductionAnalysis(warehouseId:${filterObj.warehouseId}, productTariffId:${filterObj.productTariffId}, fortnightValue:${fort}) {
                            id
                            supplierName
                            totalMolds
                            totalQuantityTomorrow
                            totalQuantityAfternoon
                            totalQuantityFermented
                            totalQuantitySendFromBelenToGloria
                            costTotalTomorrow
                            costTotalAfternoon
                            costAveragePerLiterTomorrow
                            costAveragePerLiterAfternoon
                            totalQuantityInChiller
                            totalQuantityLitersUsed
                            totalPerformance
                            costPerformancePerLiter
                            costTotalInChiller
                            costTotalLitersUsed
                            costAveragePerLiterUsed
                            costAveragePerLiterGloria
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            let obj = data.data.fortnightProductionAnalysis[0];
            if (obj !== null)
                setSummaryDailyEntries(prev => ({...prev, 
                    totalMolds: obj.totalMolds,
                    totalQuantityTomorrow: obj.totalQuantityTomorrow,
                    totalQuantityAfternoon: obj.totalQuantityAfternoon,
                    totalQuantityFermented: obj.totalQuantityFermented,
                    totalQuantitySendFromBelenToGloria: obj.totalQuantitySendFromBelenToGloria,
                    costTotalTomorrow: obj.costTotalTomorrow,
                    costTotalAfternoon: obj.costTotalAfternoon,
                    costAveragePerLiterTomorrow: obj.costAveragePerLiterTomorrow,
                    costAveragePerLiterAfternoon: obj.costAveragePerLiterAfternoon,
                    totalQuantityInChiller: obj.totalQuantityInChiller,
                    totalQuantityLitersUsed: obj.totalQuantityLitersUsed,
                    totalPerformance: obj.totalPerformance,
                    costPerformancePerLiter: obj.costPerformancePerLiter,
                    costTotalInChiller: obj.costTotalInChiller,
                    costTotalLitersUsed: obj.costTotalLitersUsed,
                    costAveragePerLiterUsed: obj.costAveragePerLiterUsed,
                    costAveragePerLiterGloria: obj.costAveragePerLiterGloria,
                }))
            else
                setSummaryDailyEntries(prev => ({...prev, 
                    totalMolds: 0,
                    totalQuantityTomorrow: 0,
                    totalQuantityAfternoon: 0,
                    totalQuantityFermented: 0,
                    totalQuantitySendFromBelenToGloria: 0,
                    costTotalTomorrow: 0,
                    costTotalAfternoon: 0,
                    costAveragePerLiterTomorrow: 0,
                    totalQuantityInChiller: 0,
                    totalQuantityLitersUsed: 0,
                    totalPerformance: 0,
                    costPerformancePerLiter: 0,
                    costTotalInChiller: 0,
                    costTotalLitersUsed: 0,
                    costAveragePerLiterUsed: 0,
                    costAveragePerLiterGloria: 0,
                }))

        }).then(()=>{
            //getPaymentCostOfGloriaPerLiter();
        })
        
    }
    useEffect(() => {
        if(fort>0){
            getFortnightProductionAnalysis();
            
        }

    }, [fort]);

    return (
        <>
            <div className="flex justify-between my-3">

            <h2 className="text-4xl font-bold dark:text-white pb-2">Resumen de produccion {fort}</h2>

            </div>
            <FortnightProductionSummary suppliers={suppliers} filterObj={filterObj}
                setSummaryDailyEntries={setSummaryDailyEntries} summaryDailyEntries={summaryDailyEntries} fort={fort}/>
        
        </>
    )
}

export default FortnightProductionAnalysisPage