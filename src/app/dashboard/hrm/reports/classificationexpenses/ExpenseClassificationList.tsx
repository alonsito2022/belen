"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IElement } from '@/app/types';
import { toast } from "react-toastify";

function ExpenseClassificationList({categoryModal,setCategory,category,subcategoryModal,setSubcategory,subcategory, elementModal, setElement, element, allElements}:any) {
    return (
        <>
            <div className="relative overflow-x-auto mt-2">

                <div className="flex items-center justify-end bg-gray-100 p-2 border gap-2 border-gray-200">

                    <button  onClick={(e)=>{
                        categoryModal.show();
                        document.getElementById("modal-category-title")!.innerHTML = "Nueva categoria";
                        document.getElementById("btn-save-category")!.innerHTML = "Guardar categoria";
                        setCategory({...category, 
                            id: 0,
                            subsidiaryId: 0,
                            name: ""
                        });
                    }} className="btn-red border px-5 py-2.5" type="button">
                    Crear categoria
                    </button>

                    <button  onClick={(e)=>{
                        subcategoryModal.show();
                        document.getElementById("modal-subcategory-title")!.innerHTML = "Nueva subcategoria";
                        document.getElementById("btn-save-subcategory")!.innerHTML = "Guardar subcategoria";
                        setSubcategory({...subcategory, 
                            id: 0,
                            name: "",
                            subsidiaryId: 0,
                            categoryId: 0,
                        });
                    }} className="btn-blue border px-5 py-2.5" type="button">
                    Crear subcategoria
                    </button>

                    <button  onClick={(e)=>{
                        elementModal.show();
                        document.getElementById("modal-subcategory-title")!.innerHTML = "Nueva concepto";
                        document.getElementById("btn-save-subcategory")!.innerHTML = "Guardar concepto";
                        setElement({...element, 
                            id: 0,
                            name: "",
                            subsidiaryId: 0,
                            categoryId: 0,
                            subcategoryId: 0,
                        });
                    }} className="btn-green border px-5 py-2.5" type="button">
                    Crear concepto
                    </button>


                </div>


                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-3">
                    <caption>CLASIFICACION DE EGRESOS</caption>
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

export default ExpenseClassificationList