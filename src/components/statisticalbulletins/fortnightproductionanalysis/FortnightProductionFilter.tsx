import { ChangeEvent, MouseEvent } from "react";


function FortnightProductionFilter({filterObj, setFilterObj}: any) {
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }

    return (
        <>
            <div className="relative overflow-x-auto py-4 mx-auto max-w-5xl">
                <div className="flex w-96">

                    <select name="collectCycle" value={filterObj.collectCycle} onChange={handleInputChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="01">PRIMERA QUINCENA</option>
                        <option value="02">SEGUNDA QUINCENA</option>
                        <option value="03">MENSUAL</option>
                    </select>
                </div>
            </div>
        </>
    )
}

export default FortnightProductionFilter