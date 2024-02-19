"use client";
import { useState, useEffect, useRef } from "react";
import InventoryFilter from "./InventoryFilter"
import InventoryList from "./InventoryList"
import InventoryRegisterOperationForm from "./InventoryRegisterOperationForm"
import { IProductTariff, IWarehouse, IOperation, IOperationDetail } from "@/app/types";
import { IUser } from '@/app/types';
import { useSession} from 'next-auth/react';
import { Modal, ModalOptions } from 'flowbite'
import Breadcrumb from "@/components/Breadcrumb"

const initialStateFilterObj = {
    startDate: "",
    endDate: "",
    productTariffId: 0,
    warehouseId: 1
}
const initialState = {
    warehouseId: 1,
    userId: 0,
    username: "",
    operationAction: "E",
    operationStatus: "02",
    operationType: "07",
    operationDate: "",
    observation: "CONSUMO DE PRODUCCION",
    turn: "NA",

    productTariffId: 0,
    quantity: 0,
    price: 0
}

function InventoryPage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [warehouses, setWarehouses] = useState< IWarehouse[]>([]);
    const [operation, setOperation] = useState<any | IOperation>(initialState);

    const [operationDetails, setOperationDetails] = useState< IOperationDetail[]>([]);

    const { data: session } = useSession();
    const u = session?.user as IUser;

    useEffect(() => {
        if(u!==undefined){
            // setOperation({...operation, userId: u?.userID, username: `${u?.firstName!}  ${u?.lastName!}`});
            setOperation( (prev : any) => ({...prev, userId: u?.id, username: `${u?.firstName!}  ${u?.lastName!}`}))
        }
    }, [u]);


    async function fetchRegularizationOperations(){
       
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        regularizationOperations(
                            warehouseId: ${filterObj.warehouseId}, 
                            productTariffId: ${filterObj.productTariffId}, 
                            startDate: "${filterObj.startDate}", 
                            endDate: "${filterObj.endDate}", 
                        ){
                            id
                            price
                            quantity
                            remainingQuantity
                            remainingPrice
                            remainingPriceTotal
                            batchCode
                            batchStock
                            batchPrice
                            batchPriceTotal
                            operation{
                                id
                                operationDate
                                operationAction
                                operationType
                                observation
                                user{
                                    id
                                    firstName
                                    lastName
                                }
                            }
                            productTariff{
                                id
                                product{
                                    id
                                    name
                                }
                                unit{
                                    id
                                    shortName
                                }
                            }
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.data.regularizationOperations != null)
            {
                const result = data.data.regularizationOperations.map((item: IOperationDetail) => {
                const subtotal = Number(item.price!* item.quantity!);
                // const remainingPrice = Number(item.price!* item.quantity!);
                if(item.operation?.operationAction=="E"){}
            
                return {
                    ...item,
                    subtotal: subtotal,
                    // remainingPrice: subtotal,
                    operation: {
                        ...item.operation,
                        operationTypeDisplay: item.operation?.operationType=="A_07"?"REGULARIZACION":"OTRO"
                    }
                };
            });
            setOperationDetails(result);
        }
        })
        
    }


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
                        productTariffsWithSubcategory{
                            id
                            productName
                            unitName
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setProductTariffs(data.data.productTariffsWithSubcategory.filter(function(dev: IProductTariff) {
                return (dev.id != 5 && dev.id != 6);
            }));
        })
        
    }

    const divRefEnPadre = useRef<HTMLDivElement>(null);
    const [modal, setModal] = useState< Modal | any>(null);
    useEffect(() => {
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, startDate: defaultValue, endDate: defaultValue});
        fetchproductTariffs();
        fetchWarehouses();

        

    }, []);

    /*const cambiarColorDesdePadre = () => {

        console.log('cambiarColorDesdePadre', divRefEnPadre)
        if (divRefEnPadre.current) {
          divRefEnPadre.current.style.background = 'blue';
        }
      };*/
    
    return (
        <>
            <Breadcrumb section={"Logística"} article={"Control de insumos"} />
            <div className="relative overflow-x-auto mt-2">
            <InventoryFilter modal={modal} filterObj={filterObj} setFilterObj={setFilterObj} productTariffs={productTariffs} warehouses={warehouses} setOperation={setOperation} fetchRegularizationOperations={fetchRegularizationOperations} />
            <InventoryList operationDetails={operationDetails} />
            <InventoryRegisterOperationForm modal={modal} setModal={setModal} operation={operation} setOperation={setOperation} productTariffs={productTariffs} warehouses={warehouses} fetchRegularizationOperations={fetchRegularizationOperations}   />
            </div>
        </>
    )
}

export default InventoryPage