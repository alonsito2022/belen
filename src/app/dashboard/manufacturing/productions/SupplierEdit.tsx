"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IPerson } from '@/app/types';
import { toast } from "react-toastify";
function SupplierEdit(item : IPerson) {
    const [inputTimeout, setInputTimeout] = useState<any>(null)

    useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, supplierObj: IPerson) => {

        /*let updatedList = suppliers.map((item:IPerson) => 
        {
        if (item.id == supplierObj.id){
            if (inputTimeout) clearTimeout(inputTimeout)
            setInputTimeout(
                setTimeout(() => {
                    saveSupplierTariff(supplierObj.id, name, value)
                }, 1000)
            )
            return {...item, [name]: value}; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item 
        });
        setSuppliers(updatedList);*/
    
    }

    return (
        <>
            <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
            <td className="px-2 py-2 border">{item.names}</td>
            <td className="px-2 py-2 border">
            <input type='number' name='priceMilkTomorrowByFortnight' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.priceMilkTomorrowByFortnight} className='block w-full p-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 lg:text-xl sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />

            </td>
            <td className="px-2 py-2 border">
            <input type='number' name='priceMilkAfternoonByFortnight' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.priceMilkAfternoonByFortnight} className='block w-full p-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 lg:text-xl sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />

            </td>

            
            <td className="px-2 py-2 border">
                
            </td>
        </>
    )
}

export default SupplierEdit