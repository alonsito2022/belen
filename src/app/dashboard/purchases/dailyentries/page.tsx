"use client";
import { useState, useEffect } from "react";
import { IPerson } from '@/app/types';
import DailyEntryList from "./DailyEntryList"
import DailyEntryFilter from "./DailyEntryFilter"
import { useAppSelector } from "@/redux/hooks"
import Breadcrumb from "@/components/Breadcrumb"

const initialStateFilterObj = {
    collectFullDateString: "",
    collectDate: "",
    collectType: "06",
    productTariffId: 5,
    warehouseId: 6
}

function DailyEntryPage() {
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [suppliersWithDailyEntries, setSuppliersWithDailyEntries] = useState< IPerson[]>([]);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    async function fetchSuppliers(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        allSuppliers(fortnightValue:${fort}, productTariffId:${5}) {
                            id
                            names
                            supplierTariffIdByFortnight
                            priceMilkTomorrowByFortnight
                            priceMilkAfternoonByFortnight
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data.data.allSuppliers.length)
            setSuppliers(data.data.allSuppliers);
        })
        
    }
    async function fetchDailyEntries(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        dailyEntries(warehouseId:${filterObj.warehouseId}, productTariffId:${filterObj.productTariffId}, collectDate:"${filterObj.collectDate}", fortnightValue:${fort}) {
                            id
                            names
                            quantityTomorrow
                            quantityAfternoon
                            supplierTariffId
                            supplierTariffPriceTomorrow
                            supplierTariffPriceAfternoon
                            quantityToReturnAfternoon
                            quantityToReturnTomorrow
                            returnStatusTomorrow
                            returnStatusAfternoon
                            quantityDeliveredTomorrow
                            quantityDeliveredAfternoon
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSuppliersWithDailyEntries(data.data.dailyEntries);
        })
        
    }
    useEffect(() => {
        if(fort>0 )
            fetchSuppliers();
    }, [fort]);

    useEffect(() => {
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        const formatFullDate = date.toLocaleDateString("es-PE", {
            weekday: "long", // narrow, short
            year: "numeric", // 2-digit
            month: "short", // numeric, 2-digit, narrow, long
            day: "numeric" // 2-digit
        });
        setFilterObj({...filterObj, collectDate: defaultValue, collectFullDateString: formatFullDate});
    }, []);

    useEffect(() => {
        if(filterObj.collectDate.length>0 && fort>0)
            fetchDailyEntries()
    }, [filterObj.collectDate, fort]);

    return (
        <>

            <Breadcrumb section={"Producción"} article={`Registro diario`} />

            <DailyEntryFilter fetchDailyEntries={fetchDailyEntries}  setFilterObj={setFilterObj} filterObj={filterObj} />
            <DailyEntryList suppliers={suppliers} suppliersWithDailyEntries={suppliersWithDailyEntries} filterObj={filterObj} fetchDailyEntries={fetchDailyEntries} fort={fort}/>
        </>
    )
}

export default DailyEntryPage