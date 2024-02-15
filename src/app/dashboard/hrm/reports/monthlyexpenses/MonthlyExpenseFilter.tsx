import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { IElement } from '@/app/types';

function MonthlyExpenseFilter({filterObj, setFilterObj}: any) {

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
                <div className="flex flex-row gap-4">
                    <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Año Seleccionado:</label>
                    <select id="year" name="year" value={filterObj.year} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {consecutiveYears.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
        </>
    )
}

export default MonthlyExpenseFilter