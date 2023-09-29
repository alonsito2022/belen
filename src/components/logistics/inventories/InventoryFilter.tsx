import { IProductTariff, IWarehouse } from "@/app/types";
import { ChangeEvent, MouseEvent } from "react";

function InventoryFilter({filterObj, setFilterObj, productTariffs, warehouses, setOperation} : any) {
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }
    const handleClickButton = (e: MouseEvent<HTMLElement>) => {
        // fetchDailyEntries()
    }
    return (
        <>
            

            <div className="grid gap-4 grid-cols-5 items-end">
                <div className="mb-4">
                    <label htmlFor="warehouseId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Almacen</label>
                    <select id="warehouseId" name="warehouseId" value={filterObj.warehouseId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>Elige un almacen</option>
                        {warehouses.map((item: IWarehouse) => 
                            <option key={item.id} value={item.id}>{item.name}</option>
                        )}
                       
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="productTariffId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Presentacion de producto</label>
                    <select id="productTariffId" name="productTariffId" value={filterObj.productTariffId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>Elige una presentacion</option>
                        {productTariffs.map((item: IProductTariff) => 
                            <option key={item.id} value={item.id}>{item.productName}</option>
                        )}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Desde</label>
                    <input type="date" id="startDate" name="startDate" value={filterObj.startDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hasta</label>
                    <input type="date" id="endDate" name="endDate" value={filterObj.startDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>

                <div className="mb-4 grid grid-cols-2 items-end gap-2  justify-end ">
                    <button type="button" onClick={handleClickButton} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>

                    <button data-modal-toggle="supplierFormModal" onClick={(e)=>{
                        
                            const date = new Date();
                            const defaultValue = date.toLocaleDateString('en-CA');
                            setOperation( (prev : any) => ({...prev, 
                                operationAction: "E",
                                operationStatus: "02",
                                operationType: "07",
                                operationDate: defaultValue,
                                turn: "NA"
                            }))
                        
                                
                        }} className=" block text-white bg-gray-400 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">
                        Nueva Operacion
                    </button>
                
                </div>
            </div>
        </>
    )
}

export default InventoryFilter