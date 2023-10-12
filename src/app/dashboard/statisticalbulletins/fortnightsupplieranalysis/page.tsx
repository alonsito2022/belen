"use client";
import { useState, useEffect } from "react";
import FortnightSupplierList from "@/components/statisticalbulletins/fortnightsupplieranalysis/FortnightSupplierList"
import FortnightSupplierFilter from "@/components/statisticalbulletins/fortnightsupplieranalysis/FortnightSupplierFilter"
import { IProductTariff, IWarehouse, IPerson } from "@/app/types";
import { useAppSelector } from "@/redux/hooks"

const initialStateFilterObj = {
    supplierId: 0,
}

function FortnightSupplierAnalysisPage() {
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [supplierWithData, setSupplierWithData] = useState< IPerson[]>([]);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    async function fetchSuppliers(){
        // console.log('fetchSuppliers fort', fort)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        suppliersByFortnightAndProductTariff(fortnightValue:${fort}, productTariffId:${5}) {
                            id
                            names
                            isEnabled
                            countSupplierTariffs
                            priceMilkTomorrowByFortnight
                            priceMilkAfternoonByFortnight
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data.data.suppliers)
            // console.log(data.data.suppliers.length)
            setSuppliers(data.data.suppliersByFortnightAndProductTariff);
        })
        
    }


    async function fetchDailyEntriesAndGloriaShipmentsBySupplier(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        dailyEntriesAndGloriaShipmentsBySupplier(supplierId:${filterObj.supplierId}, fortnightValue:${fort}) {
                            date
                            productionQuantityTomorrow
                            productionPriceTomorrow
                            productionTotalTomorrow
                            productionQuantityAfternoon
                            productionPriceAfternoon
                            productionTotalAfternoon
                            gloriaShipmentQuantityTomorrow
                            gloriaShipmentPriceTomorrow
                            gloriaShipmentTotalTomorrow
                            gloriaShipmentQuantityAfternoon
                            gloriaShipmentPriceAfternoon
                            gloriaShipmentTotalAfternoon
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.data.dailyEntriesAndGloriaShipmentsBySupplier)
            setSupplierWithData(data.data.dailyEntriesAndGloriaShipmentsBySupplier);
        })
        
    }

    useEffect(() => {
        if(fort>0 ){
            fetchSuppliers();
            if(filterObj.supplierId>0 )
                fetchDailyEntriesAndGloriaShipmentsBySupplier();
        }
    }, [fort, filterObj.supplierId]);


    return (
        <>
        <div className="relative overflow-x-auto p-4 mx-auto max-w-5xl bg-white">

            <h2 className="text-4xl font-bold dark:text-white pb-4">Boleta quincenal de proveedores</h2>
            <FortnightSupplierFilter />
            <FortnightSupplierList suppliers={suppliers} supplierWithData={supplierWithData} 
            filterObj={filterObj} setFilterObj={setFilterObj} />
        </div>
            
        </>

    )
}

export default FortnightSupplierAnalysisPage