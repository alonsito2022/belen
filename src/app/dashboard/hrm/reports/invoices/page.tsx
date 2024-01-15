"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IOperation, IEntry, ISubsidiary, IExpensesByWeek, IUser, IDateAndWeekday, ISubcategory, IElement } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import InvoiceList from "./InvoiceList"
import OrderReview from "@/app/dashboard/sales/orders/OrderReview"
import {obtenerSemanaActual, getDates} from '@/libs/functions'
// import ExpenseForm from "./ExpenseForm"

const initialStateFilterObj = {
    startDate: "",
    endDate: "",
    warehouseId: 7,
    searchSaleCenterId: 0,
    week: "",
    typeOfDairyProduct: "03"
}


const initialStateOutput = {
    id: 0,
    saleCenterId: 0,
    operationDate: "",
    operationStatus: "",
    operationType: "13",
    operationTypeReadable: "",
    clientId: 0,
    lastSubtraction: 0,
    supplierId: 0,
    userId: 0,
    productTariffId: 0,
    quantity: 0,
    price: 0,
    previousBalance: 0,
    productName: "",
    discount: 0,
    
    suppliers: [],
    productTariffs: [],
    quantities: [],
    prices: [],
    discounts: [],
    productNames: [],
    supplierNames: [],
  
    baseCost: 0,
    igvCost: 0,  
    totalSale: 0,

    totalPreviousBalance: 0,
    totalNet: 0,
    cash: 0,
    deposit: 0,
    subtraction: 0,

    hasIgv: false,
    isFictitious: false,
    observation: "",
    documentType: "01",
    documentTypeReadable: "",
    documentNumber: "",

    client: {names:"", saleCenter:{id:0, name:""}},
    operationdetailSet: [],
}


function InvoicePage() {
    const [invoices, setInvoices] = useState< IOperation[]>([]);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [modalReview, setModalReview] = useState< Modal | any>(null);
    const [outputFound, setOutputFound] = useState<any | IEntry>(initialStateOutput);

    async function getOutputById(id: number){
        let queryfecth = `
            query {
                outputById(pk:${id}){
                    id
                    operationDate
                    operationType
                    operationTypeReadable
                    isFictitious
                    baseCost
                    igvCost
                    totalSale
                    previousBalance

                    documentTypeReadable
                    documentNumber
                    client{
                        saleCenter{
                            id
                            name
                        }
                        names
                    }
                    operationdetailSet{
                        id
                        productTariff{
                            productName
                        }
                        supplier{
                            names
                        }
                        quantity
                        price
                        discount
                    }
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
            
            setOutputFound(data.data.outputById);
            
        })
    }

    async function fetchInvoices(){
        
        let queryfecth = `
             query {
                invoicesByDates(startDate:"${filterObj.startDate}", endDate:"${filterObj.endDate}") {
                    id
                    formattedDate
                    dayNameResult
                    operationDate
                    operationType
                    operationTypeReadable
                    operationStatus
                    isFictitious
                    baseCost
                    igvCost
                    totalSale
                    previousBalance
                    totalNet
                    cash
                    deposit
                    subtraction
                    documentTypeReadable
                    documentNumber
                    client{
                        saleCenter{
                            id
                            name
                        }
                        names
                    }
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
            setInvoices(data.data.invoicesByDates);
             
         });
    }

    
    useEffect(() => {
        if(filterObj.startDate.length > 0){
            fetchInvoices();
            
        }

    }, [filterObj]);

    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, week: semanaActual, startDate:defaultValue, endDate:defaultValue});
    }, []);

    return (
        <>
            <Breadcrumb section={"Administración"} article={"Resumen Facturas"} />
            <InvoiceList 
                invoices={invoices}
                setFilterObj={setFilterObj}
                filterObj={filterObj} 
                modalReview={modalReview} 
                getOutputById={getOutputById} 
            />
            <OrderReview modalReview={modalReview} setModalReview={setModalReview} outputFound={outputFound} />
        </>
    )
}

export default InvoicePage
