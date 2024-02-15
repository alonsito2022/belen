"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IMonthElementData, IMonthExpenseData } from '@/app/types';
import { toast } from "react-toastify";


function FinalFinalFrameList({categories}:any) {
    return (
        <>
            <div className="relative overflow-x-auto mt-2">


                <table className="w-full text-sm text-left text-black mt-3">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 border border-gray-400">GANANCIAS</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">ENERO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">FEBRERO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">MARZO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">ABRIL</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">MAYO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">JUNIO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">JULIO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">AGOSTO</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">SEPTIEMBRE</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">OCTUBRE</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">NOVIEMBRE</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">DICIEMBRE</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* {tbodies} */}


                    {/* {categories.map((expense: IMonthExpenseData, c: number) => 
                    
                    
                        <tr key={c} className={expense.type==="Category"?"bg-blue-200 border-b font-bold":expense.type==="Subcategory"?"bg-green-200 border-b text-base font-semibold":"bg-white border-b text-right"}>
                            <td className="px-4 py-2 border border-gray-400">{expense.name}</td>
                            {expense.months?.map((m: IMonthElementData, s: number) => 
                                <td className="px-4 py-2 border border-gray-400 text-right whitespace-nowrap">S/ {Number(m.amount).toFixed(2)}</td>
                            )}
                        </tr>
                    
                    
                    )} */}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default FinalFinalFrameList