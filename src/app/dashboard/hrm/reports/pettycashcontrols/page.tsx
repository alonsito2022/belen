"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IMonthElementData, IMonthExpenseData, IUser, IExpenseOfWeekDay, ISubsidiary, IElement } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import {obtenerSemanaActual, getDates} from '@/libs/functions'
import PettyCashControlFilter from "./PettyCashControlFilter"
import PettyCashControlList from "./PettyCashControlList"
import PettyCashControlForm from "./PettyCashControlForm"

const initialStateFilterObj = {
    subsidiaryId: 2,
    startDate: "",
    endDate: "",
    year: new Date().getFullYear()
}
const initialStateCashFlow = {
    id: 0,
    userId: 0,
    description: "",
    total: 0,
    categoryId: 0,
    subcategoryId: 0,
    subsidiaryId: 2,
    transactionDate: "",
    transactionType: "S",
}
function PettyCashControlPage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [cashFlows, setCashFlows] = useState< IExpenseOfWeekDay[]>([]);
    const [subsidiaries, setSubsidiaries] = useState< ISubsidiary[]>([]);
    const [modal, setModal] = useState< Modal | any>(null);

    const [cashFlow, setCashFlow] = useState<any | IExpenseOfWeekDay>(initialStateCashFlow);
    const [cashFlowPrevious, setCashFlowPrevious] = useState<any | IExpenseOfWeekDay>(initialStateCashFlow);
    const [cashFlowCurrent, setCashFlowCurrent] = useState<any | IExpenseOfWeekDay>(initialStateCashFlow);
    const { data: session } = useSession();
    const u = session?.user as IUser;

    async function fetchSubsidiaries(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        subsidiaries {
                            id
                            name
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSubsidiaries(data.data.subsidiaries);
        })
    }

    async function fetchCashFlowPreviousBalance(){
        let queryfecth = `
            query {
                cashFlowPreviousBalanceBySubsidiaryAndDate(transactionDate:"${filterObj.startDate}", subsidiaryId:${filterObj.subsidiaryId}) {
                    id
                    transactionDate
                    description
                    total
                    transactionType
                    userId
                    userName
                    remainingTotal
                    formattedDate
                }
            }
        `;
        console.log(queryfecth)

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setCashFlowPrevious(data.data.cashFlowPreviousBalanceBySubsidiaryAndDate);
        })
        
    }

    async function fetchCashFlowCurrentBalance(){
        let queryfecth = `
            query {
                cashFlowCurrentBalanceBySubsidiaryAndDate(subsidiaryId:${filterObj.subsidiaryId}) {
                    id
                    transactionDate
                    description
                    total
                    transactionType
                    userId
                    userName
                    remainingTotal
                    formattedDate
                }
            }
        `;
        console.log(queryfecth)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setCashFlowCurrent(data.data.cashFlowCurrentBalanceBySubsidiaryAndDate);
        })
        
    }

    async function fetchCashFlows(){
        let queryfecth = `
            query {
                cashFlowOperationsByDates(startDate:"${filterObj.startDate}", endDate:"${filterObj.endDate}", subsidiaryId:${filterObj.subsidiaryId}) {
                    id
                    transactionDate
                    description
                    total
                    transactionType
                    userId
                    userName
                    remainingTotal
                    formattedDate
                }
            }
        `;

        console.log(queryfecth)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setCashFlows(data.data.cashFlowOperationsByDates);
        })
        
    }
    
    useEffect(() => {
        if(u!==undefined){
            setCashFlow( (prev : any) => ({...prev, userId: u?.id}))
        }
    }, [u]);

    useEffect(() => {
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setCashFlow({...cashFlow, transactionDate: defaultValue});
        setFilterObj({...filterObj, startDate: defaultValue, endDate: defaultValue});
       
        fetchSubsidiaries();
    }, []);

    useEffect(() => {
        if(filterObj.startDate!=""){
            fetchCashFlowPreviousBalance()
            fetchCashFlows();
            fetchCashFlowCurrentBalance();
        }


    }, [filterObj]);

    return (
        <>
        <Breadcrumb section={"Administración"} article={"Control de Caja"} />

        <PettyCashControlFilter filterObj={filterObj} 
        setFilterObj={setFilterObj} 
        modal={modal}
        cashFlow={cashFlow} 
        setCashFlow={setCashFlow} 
        subsidiaries={subsidiaries} 

         />

        <PettyCashControlList 
        cashFlows={cashFlows} 
        cashFlowPrevious={cashFlowPrevious} 
        fetchCashFlows={fetchCashFlows} 
        fetchCashFlowPreviousBalance={fetchCashFlowPreviousBalance} 
        fetchCashFlowCurrentBalance={fetchCashFlowCurrentBalance} 
        />
        <PettyCashControlForm 
        modal={modal} 
        setModal={setModal} 
        setCashFlow={setCashFlow} 
        cashFlow={cashFlow} 
        cashFlowCurrent={cashFlowCurrent} 
        fetchCashFlows={fetchCashFlows} 
        filterObj={filterObj} 
        subsidiaries={subsidiaries} 
        fetchCashFlowPreviousBalance={fetchCashFlowPreviousBalance} 
        fetchCashFlowCurrentBalance={fetchCashFlowCurrentBalance} 
        />

    </>
    )
}

export default PettyCashControlPage