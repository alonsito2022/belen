"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IElement } from '@/app/types';
import { toast } from "react-toastify";

function MonthlyExpenseList({categoryModal,setCategory,category,subcategoryModal,setSubcategory,subcategory, elementModal, setElement, element, allElements}:any) {
    return (
        <>
            <div className="relative overflow-x-auto mt-2">


                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-3">
                    <caption>CUADRO DE CLASIFICACION DE EGRESOS</caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 border border-gray-400">ID</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">CATEGORIA</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">SUBCATEGORIA</th>
                            <th scope="col" className="px-6 py-3 border border-gray-400">CONCEPTO</th>
                        </tr>
                    </thead>
                    <tbody>
                    {allElements.map((item: IElement) => 
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-4 py-2 border border-gray-400 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                            <td className="px-4 py-2 border border-gray-400">{item.subcategory?.category?.name}</td>
                            <td className="px-4 py-2 border border-gray-400">{item.subcategory?.name}</td>
                            <td className="px-4 py-2 border border-gray-400">{item.name}</td>
                            
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MonthlyExpenseList