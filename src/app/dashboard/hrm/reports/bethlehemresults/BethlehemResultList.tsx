"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IMonthExpenseCostData, IMonthExpenseData } from '@/app/types';
import { toast } from "react-toastify";

function BethlehemResultList({categories, summaryDailyEntries}:any) {


    const calculateCategoryTotal = () => {
        // Filtrar los elementos de tipo 'Category'
        const categoryItems = categories.filter((item: IMonthExpenseCostData) => item.type === 'Category');
        
        // Sumar los totales de los elementos de tipo 'Category'
        const total = categoryItems.reduce((acc: any, item: any) => acc + item.total, 0);
    
        return total;
      };
    
      // Llama a la función para calcular la suma de los items de tipo 'Category'
      const categoryTotal = calculateCategoryTotal();

    return (
        <>
            <div className="relative overflow-x-auto mt-2">


            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">


                    <tbody>
                        
                        <tr className="bg-sky-50 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-bold text-gray-900">MOLDES PRODUCIDOS</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{summaryDailyEntries.sumQuantityMolds}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-sky-100 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-bold text-gray-900">COSTO PROMEDIO DE LECHE POR MOLDE</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePerformancePerLiter).toFixed(3)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-righ"></td>
                        </tr>
                        
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900" colSpan={3}></td>
                        </tr>
                        
                        <tr className="bg-gray-50 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">LITROS LECHE UTILIZADOS PARA PROCESO DE ELABORACION</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{summaryDailyEntries.sumQuantityLitersUsed}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.sumTotalLitersUsed).toFixed(2)}</td>
                        </tr>
                        
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">LITROS DE LECHE ENVIADOS A GLORIA</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{summaryDailyEntries.sumQuantitySendToGloria}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-gray-200 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">PROMEDIO DE COSTOS POR LITRO DE LECHE A GLORIA PAGADO POR GLORIA</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePriceGloria).toFixed(4)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.averagePricePerLiterPaidByGloria).toFixed(4)}</td>
                        </tr>
                        
                        <tr className="bg-gray-300 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">PROMEDIO DE COSTOS POR LITRO DE LECHE A GLORIA PAGADO POR BELEN</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePriceAfternoon).toFixed(4)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.averagePricePerLiterPaidByBelen).toFixed(4)}</td>
                        </tr>
                        

                    </tbody>

                </table>

                <table className="w-full text-sm text-left text-black mt-3">

                    <caption className="p-2 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        REPORTE DE COSTOS DE PRODUCCION QUESO BELEN
                    </caption>
                    <thead>
                        <tr className='bg-yellow-200 border-b font-bold'>
                            <td className='px-4 py-2 border border-gray-400 font-bold text-base' colSpan={2}>COSTO DE PRODUCCION</td>
                            <td className='px-4 py-2 border border-gray-400 text-right whitespace-nowrap'>S/ {Number(categoryTotal).toFixed(2)}</td>
                        </tr>
                        
                    </thead>
                   
                    <tbody>
                        
                    {categories.map((expense: IMonthExpenseCostData, c: number) => 
                    
                    
                        <tr key={c} className={expense.type==="Category"?"bg-blue-200 border-b font-bold":expense.type==="Subcategory"?"bg-green-200 border-b text-base font-semibold":"bg-white border-b text-right"}>
                            
                            {expense.type==="Category"?(
                                <>
                                <td className="px-4 py-2 border border-gray-400" colSpan={2}>{expense.name}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right whitespace-nowrap">S/ {Number(expense.total).toFixed(2)}</td>
                                </>
                            ):expense.type==="Subcategory"?(
                                <>
                                <td className="px-4 py-2 border border-gray-400" colSpan={2}>{expense.name}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right whitespace-nowrap">S/ {Number(expense.total).toFixed(2)}</td>
                                </>
                                

                            ):expense.type==="Element"?(
                                <>
                                <td className="px-4 py-2 border border-gray-400" colSpan={2}>{expense.name}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right whitespace-nowrap">S/ {Number(expense.total).toFixed(2)}</td>
                                </>
                                

                            ):(
                                <>
                                <td className="px-4 py-2 border border-gray-400">{expense.name}</td>
                                <td className="px-4 py-2 border border-gray-400">{expense.stock}</td>
                                <td className="px-4 py-2 border border-gray-400 text-right whitespace-nowrap">S/ {Number(expense.total).toFixed(2)}</td>
                                </>
                            )}
                            
                            
                        </tr>
                    
                    
                    )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default BethlehemResultList