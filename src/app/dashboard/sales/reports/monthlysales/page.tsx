"use client";
import { ChangeEvent ,useState, useEffect, FormEvent } from "react";
import { useSession} from 'next-auth/react';
import { IEntryAndSaleByWeek, ICheeseSupplier, IPerson, IUser } from '@/app/types';
import MonthlySaleList from "./MonthlySaleList";
import Breadcrumb from "@/components/Breadcrumb"

const initialStateFilterObj = {

    typeOfDairyProduct: "03",
    supplierId: 0,
    userId: 0,
    month: "",
    firstDayOfMonth : "",
    lastDayOfMonth  : "",
}

function MonthlySalePage() {
    const { data: session } = useSession();
    const u = session?.user as IUser;
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [entriesAndSalesByMonth, setEntriesAndSalesByMonth] = useState< IEntryAndSaleByWeek[]>([]);
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    async function fetchEntriesAndSalesByMonth(){
        let queryfecth = `
            query {
                entriesAndSalesByMonth(firstDayOfMonth:"${filterObj.firstDayOfMonth}", supplierId:${filterObj.supplierId}) {
                    startDate
                    endDate
                    entries{
                        operationDetailId
                        supplierName
                        productName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                    }
                    sales{
                        operationDetailId
                        clientName
                        productName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                    }
                    shippingCost
                    description
                }
            }
        `;
        // console.log(queryfecth)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data.data.entriesAndSalesByMonth)
            setEntriesAndSalesByMonth(data.data.entriesAndSalesByMonth);
        })
        
    }

    async function fetchSuppliers(){
        let queryfecth = `
            query {
                suppliersByTypeOfDairyProduct(typeOfDairyProduct:"${filterObj.typeOfDairyProduct}", supplierId:${0}) {
                    id
                    names
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
            setSuppliers(data.data.suppliersByTypeOfDairyProduct);
        })
        
    }


    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        setFilterObj( (prev : any) => ({...prev, month: `${currentYear}-${currentMonth}`}))
        fetchSuppliers();
    }, []);
    
    useEffect(() => {
        if(filterObj.firstDayOfMonth.length > 0){
            
            fetchEntriesAndSalesByMonth();
        }

    }, [filterObj.firstDayOfMonth, filterObj.supplierId]);

    useEffect(() => {
        if(u!==undefined){
            setFilterObj( (prev : any) => ({...prev, userId: u?.id}))
        }
    }, [u]);

    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Ventas mensuales"} />
            <MonthlySaleList 
                setFilterObj={setFilterObj}  
                filterObj={filterObj} 
                suppliers={suppliers}
                entriesAndSalesByMonth={entriesAndSalesByMonth}
                fetchEntriesAndSalesByMonth={fetchEntriesAndSalesByMonth}
                setEntriesAndSalesByMonth={setEntriesAndSalesByMonth}
            />
        </>
    )
}

export default MonthlySalePage