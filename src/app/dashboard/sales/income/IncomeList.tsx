"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IPerson, ICheeseSupplier } from '@/app/types';
import { toast } from "react-toastify";
function IncomeList({suppliers, setSuppliers, setSupplier, fetchSuppliers, fort, initialState, modal, setFilterObj, filterObj, obtenerFechaInicioFin, fechaInicio, fechaFin} : any) {

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        obtenerFechaInicioFin (value)
        setFilterObj({...filterObj, [name]: value});
    }
    return (
        <>
            <div className="relative overflow-x-auto mt-2">

                <div className="flex items-center justify-between bg-gray-200 p-2 border gap-2 border-gray-200">
                    
                    <div className="">
                        <input type="week" name="week" value={filterObj.week } onChange={handleInputChangeWeek} className="form-control" /> 
                    </div>

                    <div className="">
                    {fechaInicio && fechaFin && (
                        <p>{`Del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`}</p>
                    )}
                    </div>

                    <button  onClick={(e)=>{
                            modal.show();
                            document.getElementById("modal-title")!.innerHTML = "Escoger proveedor";
                            document.getElementById("btn-save-product")!.innerHTML = "Habilitar";
                            setSupplier(initialState);

                    }} className="btn-green border  px-5 py-2.5" type="button">
                    Habilitar proveedor
                    </button>

                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-4 border">ID</th>
                            <th scope="col" className="px-6 py-4 border">NOMBRES</th>
                        </tr>
                    </thead>
                    <tbody>
                    {suppliers
                    .map((item: ICheeseSupplier) => 
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                            <td className="px-2 py-2 border">{item.name}</td>
                            
                            
                        </tr>
                        )}
                    </tbody>
                </table>

                </div>
        </>
    )
}

export default IncomeList