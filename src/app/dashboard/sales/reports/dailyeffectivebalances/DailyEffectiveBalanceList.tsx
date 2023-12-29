"use client";
import React from 'react';

import { ChangeEvent ,useState, useEffect } from "react";
import { IDayInfo } from '@/app/types';
import { getDayNameByIndex} from '@/libs/functions'

const initialStateBalanceSummary = {
    summaryIncomesInCash: 0,
    summaryIncomesInDeposit: 0,
    summaryExpenses: 0,
    summaryTotal: 0,
}
function DailyEffectiveBalanceList({setFilterObj, filterObj, obtenerFechaInicioFin, fechaInicio, fechaFin, incomesAndExpensesByWeek} : any) {

    const [balanceSummary, setBalanceSummary] = useState(initialStateBalanceSummary);

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week") obtenerFechaInicioFin (value);
        setFilterObj({...filterObj, [name]: value});
    }

    useEffect(() => {
        const sumValues = incomesAndExpensesByWeek.reduce((acc: any, week: any) => {
            acc.incomesInCash += week.incomesInCash || 0;
            acc.incomesInDeposit += week.incomesInDeposit || 0;
            acc.expenses += week.expenses || 0;
            acc.total += week.total || 0;
            return acc;
        }, { incomesInCash: 0, incomesInDeposit: 0, expenses: 0, total: 0 });
          
        setBalanceSummary({...balanceSummary, 
            summaryIncomesInCash: sumValues.incomesInCash!,
            summaryIncomesInDeposit: sumValues.incomesInDeposit!,
            summaryExpenses: sumValues.expenses!,
            summaryTotal: sumValues.total!
        })

    }, [incomesAndExpensesByWeek]);

    return (
        <>
            <div className="relative overflow-x-auto mt-2">
                <div className="flex items-center justify-between bg-gray-100 p-2 border gap-2 border-gray-200">
                    <div className="">
                        <input type="week" name="week" value={filterObj.week } onChange={handleInputChangeWeek} className="form-control" />
                    </div>

                    <div className="">
                        {fechaInicio && fechaFin && (
                            <p className=" text-2xl font-thin">{`Del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`}</p>
                        )}
                    </div>

                    
                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                        <tr>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-yellow-200" rowSpan={2}>DIA</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-blue-200" colSpan={2}>INGRESOS</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-red-200" rowSpan={2}>EGRESOS</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-yellow-200" rowSpan={2}>TOTAL</td>
                        </tr>

                        <tr>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-blue-200">EFECTIVO</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-blue-200">DEPOSITO</td>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {incomesAndExpensesByWeek.map((item: IDayInfo, index: number) => 
                            <tr key={index} >
                                <td  className="px-2 py-2 border border-gray-400 text-center font-semibold text-base">{getDayNameByIndex(index)}</td>
                                <td  className="px-2 py-2 border border-gray-400 text-right text-base">S/ {item.incomesInCash}</td>
                                <td  className="px-2 py-2 border border-gray-400 text-right text-base">S/ {item.incomesInDeposit}</td>
                                <td  className="px-2 py-2 border border-gray-400 text-right text-base">S/ {item.expenses}</td>
                                <td  className="px-2 py-2 border border-gray-400 text-right text-base">S/ {item.total}</td>        
                            </tr>
                        )}
                    
                    </tbody>
                    <tfoot>
                        <tr>
                            
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 text-center font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-blue-200 font-bold text-base">S/ {balanceSummary.summaryIncomesInCash}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-blue-200 font-bold text-base">S/ {balanceSummary.summaryIncomesInDeposit}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-red-200 font-bold text-base">S/ {balanceSummary.summaryExpenses}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-yellow-200 font-bold text-base">S/ {balanceSummary.summaryTotal}</td>

                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default DailyEffectiveBalanceList