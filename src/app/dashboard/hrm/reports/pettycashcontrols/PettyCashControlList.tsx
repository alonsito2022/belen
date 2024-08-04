"use client";
import React from 'react';
import { toast } from "react-toastify";
import { ChangeEvent ,useState, FormEvent, useEffect } from "react";
import { IExpensesByWeek, IDateAndWeekday, IExpenseOfWeekDay, ISubsidiary, IElement } from '@/app/types';
import {getShortNameMonth, getWeekDayInSpanish} from '@/libs/functions'



function PettyCashControlList({
    cashFlows, cashFlowPrevious, fetchCashFlows, fetchCashFlowPreviousBalance, fetchCashFlowCurrentBalance
} : any) {


    async function deleteCashFlowByID(pk: number){
        
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                mutation {
                        deleteCashFlow(id: ${pk}) {
                            message
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            toast(data.data.deleteCashFlow.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchCashFlows();
            fetchCashFlowPreviousBalance();
            fetchCashFlowCurrentBalance();
        })
        
    }

    return (
        <>
            <div className="relative overflow-x-auto mt-2">


                <table className="w-full text-sm text-left text-black mt-3">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 border border-gray-400">FECHA</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">DESCRIPCION</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">USUARIO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400 bg-blue-200">INGRESO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400 bg-red-200">EGRESO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400 bg-gray-200">SALDO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* {tbodies} */}
                    {cashFlowPrevious !== null && cashFlowPrevious != undefined ?
                    <tr className='text-gray-500'>
                        <td className="px-2 py-2 border border-gray-400 whitespace-nowrap"> VIENE DEL {cashFlowPrevious?.formattedDate?.replace("Dec", "Dic").replace("Jan", "Ene")}</td>
                        <td className="px-2 py-2 border border-gray-400"></td>
                        <td className="px-2 py-2 border border-gray-400"></td>
                        <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap bg-blue-200"></td>
                        <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap bg-red-200"></td>
                        <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap bg-gray-200 font-bold">{"S/ " + Number(cashFlowPrevious?.remainingTotal).toFixed(2)}</td>
                        <td className="px-2 py-2 border border-gray-400"></td>
                    </tr>

                    : null }
                    
                    {cashFlows.map((cf: IExpenseOfWeekDay, c: number) => 
                    
                    
                        <tr key={c} >
                            <td className="px-2 py-2 border border-gray-400">{cf.formattedDate?.replace("Jan", "Ene")}</td>
                            <td className="px-2 py-2 border border-gray-400">{cf.description}</td>
                            <td className="px-2 py-2 border border-gray-400">{cf.userName?.toUpperCase()}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap bg-blue-200">{cf.transactionType=="E"?("S/ " + Number(cf.total).toFixed(2)):""}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap bg-red-200">{cf.transactionType=="S"?"S/ " + (Number(cf.total).toFixed(2)):""}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap bg-gray-200 font-bold">{"S/ " + Number(cf.remainingTotal).toFixed(2)}</td>
                            <td className="px-2 py-2 border border-gray-400">

                                <button type="button" 
                                    onClick={ ()=>{deleteCashFlowByID(cf.id!)}} 
                                    className="btn-blue px-2.5 py-1">X</button>
                            </td>
                        </tr>
                    
                    
                    )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PettyCashControlList