import { ChangeEvent, MouseEvent } from "react";

function GloriaShipmentFilter({getGloriaShipments, setFilterObj, filterObj} : any) {
    
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }

    const handleClickButton = (e: MouseEvent<HTMLElement>) => {
        getGloriaShipments()
    }

    return (
        <>
        <div className="grid grid-cols-2 mt-2">
            <div className="text-3xl text-gray-900">{filterObj.collectFullDateString}</div>
            <div className="flex flex-row gap-4">
                <input type="date" id="collectDate" name="collectDate" value={filterObj.collectDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
            
                <button type="button" onClick={handleClickButton} className="mr-0 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Buscar</button>
            </div>
        </div>
            
        </>
    )
}

export default GloriaShipmentFilter