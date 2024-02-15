import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { IElement } from '@/app/types';

function BethlehemResultFilter({filterObj, setFilterObj}: any) {

    const [years, setYears] = useState< number[]>([]);
    const currentYear = new Date().getFullYear() - 1;
    const consecutiveYears = Array.from({ length: 3 }, (_, index) => currentYear + index);


    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }


    useEffect(() => {
        
    }, []);

    return (
        <>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-row gap-4">
                    <label htmlFor="year" className="text-sm font-medium text-gray-900 dark:text-white grid content-center ">Año:</label>
                    <select id="year" name="year" value={filterObj.year} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {consecutiveYears.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-row gap-4">
                    <label htmlFor="month" className="text-sm font-medium text-gray-900 dark:text-white grid content-center">Mes:</label>
                    <select id="month" name="month" value={filterObj.month} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        
                        <option value={0}>ENERO</option>
                        <option value={1}>FEBRERO</option>
                        <option value={2}>MARZO</option>
                        <option value={3}>ABRIL</option>
                        <option value={4}>MAYO</option>
                        <option value={5}>JUNIO</option>
                        <option value={6}>JULIO</option>
                        <option value={7}>AGOSTO</option>
                        <option value={8}>SEPTIEMBRE</option>
                        <option value={9}>OCTUBRE</option>
                        <option value={10}>NOVIEMBRE</option>
                        <option value={11}>DICIEMBRE</option>

                        
                    </select>
                </div>
            </div>

        </>
    )
}

export default BethlehemResultFilter