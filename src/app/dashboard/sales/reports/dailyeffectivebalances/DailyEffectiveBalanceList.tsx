"use client";
import React from 'react';

import { ChangeEvent ,useState, useEffect } from "react";
import { IDayInfo, IExpenseOfWeekDay } from '@/app/types';
import { getDayNameByIndex} from '@/libs/functions'
import { initFlowbite} from "flowbite";

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
        });
        initFlowbite();

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

                <table className="w-full text-sm text-left text-black dark:text-gray-400">
                    <thead className="text-xs bg-gray-50 dark:bg-gray-700">

                        <tr>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-gray-300" rowSpan={2}>DIA</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-gray-300" rowSpan={2}>FEC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-blue-300" colSpan={2}>INGRESOS</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-red-300" rowSpan={2}>EGRESOS</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-gray-300" rowSpan={2}>TOTAL</td>
                        </tr>

                        <tr>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-blue-300">EFECTIVO</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold text-base bg-blue-300">DEPOSITO</td>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {incomesAndExpensesByWeek.map((item: IDayInfo, index: number) => 
                            <tr key={index} >
                                <td  className="px-2 py-2 border border-gray-400 bg-gray-200 text-center font-semibold text-base">{getDayNameByIndex(index)}</td>
                                <td  className="px-2 py-2 border border-gray-400 bg-gray-200 text-center font-semibold text-base">{item.formattedDate?.replace("Jan","Ene")}</td>
                                <td  className="px-1 py-0 border border-gray-400 bg-blue-200 text-right text-base">

                                    {(Number(item.incomesInCash)>0)?(
                                        <>
                                        <button data-popover-target={"popover-default-"+index} type="button" data-popover-placement="bottom-end" className="btn-blue w-full py-1">S/ {item.incomesInCash}</button>

                                            <div data-popover id={"popover-default-"+index} role="tooltip" className="absolute z-auto invisible inline-block w-96 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">EFECTIVO - {getDayNameByIndex(index)}</h3>
                                                </div>
                                                <div className="px-3 py-2">
                                                    <table className='w-full text-sm text-left rtl:text-right text-black dark:text-gray-400'>
                                                        <thead>
                                                            <tr>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Descripcion</td>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Usuario</td>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Total</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.listOfIncomesInCash?.map((ts: IExpenseOfWeekDay, pos: number)=>
                                                            <tr key={pos}>
                                                                
                                                                
                                                                <td className='px-2 py-2 border-b border-gray-200'>{ts?.description} </td>
                                                                <td className='px-2 py-2 border-b border-gray-200'>{ts?.userName} </td>
                                                                <td className='px-2 py-2 border-b border-gray-200 text-right whitespace-nowrap'>S/ {ts?.total}</td>
                                                            </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                        </>
                                    ):null}
                                    
                                </td>
                                <td  className="px-2 py-2 border border-gray-400 bg-blue-200 text-right text-base">


                                    {(Number(item.incomesInDeposit)>0)?(
                                        <>
                                        <button data-popover-target={"popover-default-deposit-"+index} type="button" data-popover-placement="bottom-end" className="btn-blue w-full py-1">S/ {item.incomesInDeposit}</button>

                                            <div data-popover id={"popover-default-deposit-"+index} role="tooltip" className="absolute z-auto invisible inline-block w-96 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                                    <h3 className="font-semibold uppercase text-gray-900 dark:text-white">DEPOSITO - {getDayNameByIndex(index)}</h3>
                                                </div>
                                                <div className="px-3 py-2">
                                                    <table className='w-full text-sm text-left rtl:text-right text-black dark:text-gray-400'>
                                                        <thead>
                                                            <tr>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Descripcion</td>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Usuario</td>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Total</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.listOfIncomesInDeposit?.map((ts: IExpenseOfWeekDay, pos: number)=>
                                                            <tr>
                                                                
                                                                
                                                                <td className='px-2 py-2 border-b border-gray-200'>{ts?.description} </td>
                                                                <td className='px-2 py-2 border-b border-gray-200'>{ts?.userName} </td>
                                                                <td className='px-2 py-2 border-b border-gray-200 text-right whitespace-nowrap'>S/ {ts?.total}</td>
                                                            </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                        </>
                                    ):null}
                                </td>
                                <td  className="px-2 py-2 border border-gray-400 bg-red-200 text-right text-base">
                                    {(Number(item.expenses)>0)?(
                                        <>
                                        <button data-popover-target={"popover-default-expenses-"+index} type="button" data-popover-placement="bottom-end" className="btn-red w-full py-1">S/ {item.expenses}</button>

                                            <div data-popover id={"popover-default-expenses-"+index} role="tooltip" className="absolute z-auto invisible inline-block w-96 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                                    <h3 className="font-semibold uppercase text-gray-900 dark:text-white">EGRESO - {getDayNameByIndex(index)}</h3>
                                                </div>
                                                <div className="px-3 py-2">
                                                    <table className='w-full text-sm text-left rtl:text-right text-black dark:text-gray-400'>
                                                        <thead>
                                                            <tr>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Descripcion</td>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Usuario</td>
                                                                <td className='px-2 py-2 border-b border-gray-200 font-semibold uppercase'>Total</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.listOfExpenses?.map((ts: IExpenseOfWeekDay, pos: number)=>
                                                            <tr>
                                                                
                                                                
                                                                <td className='px-2 py-2 border-b border-gray-200'>{ts?.description} </td>
                                                                <td className='px-2 py-2 border-b border-gray-200'>{ts?.userName} </td>
                                                                <td className='px-2 py-2 border-b border-gray-200 text-right whitespace-nowrap'>S/ {ts?.total}</td>
                                                            </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    
                                                </div>
                                                <div data-popper-arrow></div>
                                            </div>
                                        </>
                                    ):null}
                                </td>
                                <td  className="px-2 py-2 border border-gray-400 bg-gray-200 text-right text-base">S/ {item.total}</td>        
                            </tr>
                        )}
                    
                    </tbody>
                    <tfoot>
                        <tr>
                            
                            <td className="px-2 py-2 border border-gray-400 bg-gray-300 text-center font-semibold text-lg" colSpan={2}>TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 text-center bg-blue-300 font-bold text-base">S/ {balanceSummary.summaryIncomesInCash}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-blue-300 font-bold text-base">S/ {balanceSummary.summaryIncomesInDeposit}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-red-300 font-bold text-base">S/ {balanceSummary.summaryExpenses}</td>
                            <td className="px-2 py-2 border border-gray-400 text-right bg-gray-300 font-bold text-base">S/ {balanceSummary.summaryTotal}</td>

                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default DailyEffectiveBalanceList