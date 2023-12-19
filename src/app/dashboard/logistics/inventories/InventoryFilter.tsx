import { IProductTariff, IWarehouse } from "@/app/types";
import { ChangeEvent, MouseEvent } from "react";



function InventoryFilter({modal, filterObj, setFilterObj, productTariffs, warehouses, setOperation, fetchRegularizationOperations} : any) {
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }
    const handleClickButton = (e: MouseEvent<HTMLElement>) => {
        fetchRegularizationOperations()
    }

    return (
        <>
            
            <div className="flex items-end justify-start bg-gray-200 p-2 border border-gray-200 gap-2">
            
                <div className="">
                    <label htmlFor="warehouseId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Almacen</label>
                    <select id="warehouseId" name="warehouseId" value={filterObj.warehouseId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>Elige un almacen</option>
                        {warehouses.map((item: IWarehouse) => 
                            <option key={item.id} value={item.id}>{item.name}</option>
                        )}
                       
                    </select>
                </div>
                <div className="">
                    <label htmlFor="productTariffId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Presentacion de producto</label>
                    <select id="productTariffId" name="productTariffId" value={filterObj.productTariffId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>Elige una presentacion</option>
                        {productTariffs.map((item: IProductTariff) => 
                            <option key={item.id} value={item.id}>{item.productName} [{item.unitName}]</option>
                        )}
                    </select>
                </div>
                <div className="">
                    <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Desde</label>
                    <input type="date" id="startDate" name="startDate" value={filterObj.startDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="">
                    <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hasta</label>
                    <input type="date" id="endDate" name="endDate" value={filterObj.endDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>

                    <button type="button" onClick={handleClickButton} className="btn-green border  px-5 py-2">Buscar</button>

                    <button onClick={(e)=>{
                        
                            const date = new Date();
                            const defaultValue = date.toLocaleDateString('en-CA');
                            setOperation( (prev : any) => ({...prev, 
                                operationAction: "E",
                                operationStatus: "02",
                                operationType: "07",
                                operationDate: defaultValue,
                                turn: "NA"
                            }))

                            
                            modal.show();
                        
                                
                        }} className="btn-cyan border  px-5 py-2" type="button">
                        Registrar operacion
                    </button>

            </div>
        </>
    )
}

export default InventoryFilter