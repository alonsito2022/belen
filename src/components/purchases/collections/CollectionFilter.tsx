import { ChangeEvent, MouseEvent } from "react";


function CollectionFilter({getSuppliersWithDailyEntries, setFilterObj, filterObj} : any) {

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }

    const handleClickButton = (e: MouseEvent<HTMLElement>) => {
        getSuppliersWithDailyEntries()
    }

    
  return (
    <>
    
    {/*<div className="mb-4">

        <label htmlFor="warehouseId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona tu almacen</label>
        <select id="warehouseId" name="warehouseId" value={filterObj.warehouseId} onChange={handleInputChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value={0}>Elegir</option>
            {warehouses.map((i: IWarehouse)  =>

                <option key={i.id} value={i.id}>{i.name}</option>
                
            )}
            
        </select>
            </div>*/}

    {/*<div className="mb-4">

        <label htmlFor="productTariffId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona tu presentacion de producto</label>
        <select id="productTariffId" name="productTariffId" value={filterObj.productTariffId} onChange={handleInputChange}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value={0}>Elegir</option>
            {productTariffs.map((i: IProductTariff)  =>

                <option key={i.id} value={i.id}>{i.productName + " [" + i.unitName + "]"}</option>
                
            )}
            
        </select>
            </div>*/}

    <div className="grid grid-flow-col gap-4 items-end ">
        <div className="mb-4 ">
            <label htmlFor="collectDate" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Fecha</label>
            <input type="date" id="collectDate" name="collectDate" value={filterObj.collectDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>

        <div className="mb-4 text-right">
            <button type="button" onClick={e=>handleClickButton(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>
        </div>
    </div>
    </>
  )
}

export default CollectionFilter