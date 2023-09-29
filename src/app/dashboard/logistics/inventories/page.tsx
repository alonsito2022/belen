"use client";
import { useState, useEffect } from "react";
import InventoryFilter from "@/components/logistics/inventories/InventoryFilter"
import InventoryList from "@/components/logistics/inventories/InventoryList"
import InventoryRegisterOperationForm from "@/components/logistics/inventories/InventoryRegisterOperationForm"
import { IProductTariff, IWarehouse, IOperation } from "@/app/types";
import { IUser } from '@/app/types';
import { useSession} from 'next-auth/react';


const initialStateFilterObj = {
    startDate: "",
    endDate: "",
    productTariffId: 0,
    warehouseId: 6
}
const initialState = {
    warehouseId: 0,
    userId: 0,
    username: "",
    operationAction: "E",
    operationStatus: "02",
    operationType: "07",
    operationDate: "",
    turn: "NA",
    productTariffs: [],
    quantities: [],
    prices: [],
}

function InventoryPage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [warehouses, setWarehouses] = useState< IWarehouse[]>([]);
    const [operation, setOperation] = useState<any | IOperation>(initialState);
        
    const { data: session } = useSession();
    const u = session?.user as IUser;

    useEffect(() => {
        if(u!==undefined){
            console.log(u)
            // setOperation({...operation, userId: u?.userID, username: `${u?.firstName!}  ${u?.lastName!}`});
            setOperation( (prev : any) => ({...prev, userId: u?.userID, username: `${u?.firstName!}  ${u?.lastName!}`}))
        }
    }, [u]);
    async function fetchWarehouses(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        warehouses{
                            id
                            name
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setWarehouses(data.data.warehouses.filter(function(dev: IWarehouse) {
                return dev.id == 1;
            }));
        })
        
    }
    async function fetchproductTariffs(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        productTariffs{
                            id
                            productName
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setProductTariffs(data.data.productTariffs.filter(function(dev: IProductTariff) {
                return (dev.id != 5 && dev.id != 6);
            }));
        })
        
    }
    useEffect(() => {
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, startDate: defaultValue, endDate: defaultValue});
        fetchproductTariffs();
        fetchWarehouses();
    }, []);
    return (
        <>
            <h2 className="text-4xl font-bold dark:text-white pb-4">Control de inventario</h2>
            <InventoryFilter filterObj={filterObj} setFilterObj={setFilterObj} productTariffs={productTariffs} warehouses={warehouses} setOperation={setOperation} />
            <InventoryList />
            <InventoryRegisterOperationForm operation={operation} setOperation={setOperation} productTariffs={productTariffs} warehouses={warehouses} />
        </>
    )
}

export default InventoryPage