"use client";

import { useState, useEffect } from "react";
import { IPerson } from '@/app/types';
import { toast } from "react-toastify";
import GloriaShipmentList from "@/components/purchases/gloriashipments/GloriaShipmentList"
import GloriaShipmentFilter from "@/components/purchases/gloriashipments/GloriaShipmentFilter"
import { useAppSelector } from "@/redux/hooks"

const initialStateFilterObj = {
    collectFullDateString: "",
    collectDate: "",
    collectType: "08",
    productTariffId: 5,
    warehouseId: 6
}

function GloriaShipmentPage() {
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [suppliersWithGloriaShipments, setSuppliersWithGloriaShipments] = useState< IPerson[]>([]);
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
            setSuppliers(data.data.allSuppliers);
            // console.log(data.data.suppliers)
        })
        
    }
    async function getGloriaShipments(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        gloriaShipments(warehouseId:${filterObj.warehouseId}, productTariffId:${filterObj.productTariffId}, collectDate:"${filterObj.collectDate}", fortnightValue:${fort}) {
                            id
                            names
                            quantityTomorrow
                            quantityAfternoon
                            priceTomorrow
                            priceAfternoon
                            supplierTariffId
                            supplierTariffPriceTomorrow
                            supplierTariffPriceAfternoon
                            priceGloriaTomorrow
                            priceGloriaAfternoon
                            quantityToReturnAfternoon
                            quantityToReturnTomorrow
                            returnStatusTomorrow
                            returnStatusAfternoon
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSuppliersWithGloriaShipments(data.data.gloriaShipments);
        })
        
    }

    useEffect(() => {
        
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        const formatFullDate = date.toLocaleDateString("es-CL", {
            weekday: "long", // narrow, short
            year: "numeric", // 2-digit
            month: "short", // numeric, 2-digit, narrow, long
            day: "numeric" // 2-digit
       });
        setFilterObj({...filterObj, collectDate: defaultValue, collectFullDateString: formatFullDate});

    }, []);

    useEffect(() => {

        if(fort>0 )
            fetchSuppliers();
    }, [fort]);

    useEffect(() => {
        if(filterObj.collectDate.length>0 && fort>0)
            getGloriaShipments()

    }, [filterObj.collectDate, fort]);

    return (
        <>
            <h2 className="text-4xl font-bold dark:text-white pb-4">Envios Gloria</h2>
            <GloriaShipmentFilter getGloriaShipments={getGloriaShipments} setFilterObj={setFilterObj} filterObj={filterObj} />
            <GloriaShipmentList suppliers={suppliers} suppliersWithGloriaShipments={suppliersWithGloriaShipments} filterObj={filterObj} getGloriaShipments={getGloriaShipments} fort={fort} />
            
        </>
    )
}

export default GloriaShipmentPage