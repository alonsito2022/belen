import { IOperation, IProductTariff, IWarehouse } from "@/app/types";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";


const options = [
    {id: "E", value: "ENTRADA"},
    {id: "S", value: "SALIDA"},
];

    const initialStateDetailObj = {

        productTariffId: 0,
        quantity: 0,
        price: 0
    }

function InventoryRegisterOperationForm({operation, setOperation, productTariffs, warehouses} : any) {

    const [detailObj, setDetailObj] = useState(initialStateDetailObj);

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setOperation({...operation, [name]: value});
    }

    const handleInputChange2 = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setDetailObj({...detailObj, [name]: value});
    }

    useEffect(() => {
       
        console.log(operation.productTariffs)
    }, [operation]);

    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(detailObj)

        // setOperation({...operation, productTariffs: A})
        setOperation((operation:any )=> ({
            ...operation, 
            // [productTariffs]: [...operation[productTariffs], detailObj.productTariffId]
        }))
        /*/let queryFetch: String = "";
        
            queryFetch = `
                mutation{
                    createOperation(
                        warehouseId: "${operation.warehouseId}", userId: "${operation.userId}", operationAction: "${operation.operationAction}", 
                        operationStatus:"${operation.operationStatus}", operationType:"${operation.operationType}", operationType:"${operation.operationType}", 
                        operationDate:"${operation.operationDate}", turn:${operation.turn}
                    ){
                        message
                    }
                }
            `;
            
            await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({query: queryFetch})
            })
            .then(res=>res.json())
            .then(data=>{
                // toast(data.data.createSupplier.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                // setOperation(initialState);
                const closeModalElement = document.getElementById('btn-close-supplier-modal');
                closeModalElement?.click();
                // fetchSuppliers();

            }).catch(e=>console.log(e))*/
        

    };
    return (
        <>
        
        <div id="supplierFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-4xl max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                                NUEVA OPERACION
                            </h3>
                            <button type="button" id="btn-close-supplier-modal" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="supplierFormModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveSupplier}>

                            <div className="grid gap-4 mb-4 sm:grid-cols-2">

                                <div className="mb-0">
                                    <label htmlFor="warehouseId2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ALMACEN</label>
                                    <select id="warehouseId2" name="warehouseId" value={operation.warehouseId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={0}>Elige un almacen</option>
                                        {warehouses.map((item: IWarehouse) => 
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )}
                                    
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="operationAction2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">TIPO OPERACION:</label>
                                    <select  id="operationAction2" name="operationAction" value={operation.operationAction} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={"E"}>ENTRADA</option>
                                        <option value={"S"}>SALIDA</option>
                                    
                                    </select>

                                </div>
                                <div>
                                    <label htmlFor="operationDate2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">FECHA</label>
                                    <input type="date" id="operationDate2" name="operationDate" value={operation.operationDate}  onChange={handleInputChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                                </div>
                                <div>
                                    <label htmlFor="username2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">USUARIO:</label>
                                    <input type="text" name="username" id="username2" value={operation.username || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="walt.r@gmail.com"  />
                                </div>

                               

                            </div>

                            <div className="grid gap-4 mb-4 sm:grid-cols-4 items-end ">
                                <div>
                                    <label htmlFor="productTariffId2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PRODUCTO [UNIDAD]</label>
                                    <select id="productTariffId2" name="productTariffId" value={detailObj.productTariffId} onChange={handleInputChange2} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={0}>Elige una presentacion</option>
                                        {productTariffs.map((item: IProductTariff) => 
                                            <option key={item.id} value={item.id}>{item.productName}</option>
                                        )}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="quantity2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CANTIDAD:</label>
                                    <input type="number" name="quantity" id="quantity2" value={detailObj.quantity} onChange={handleInputChange2} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0"  />
                                </div>
                                
                                <div>
                                    <label htmlFor="price2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PRECIO:</label>
                                    <input type="number" name="price" id="price2" value={detailObj.price} onChange={handleInputChange2} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0"  />
                                </div>

                                <div className=" text-left">
                                    <button id="btn-save-product" type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
                                        +
                                    </button>
                                </div>
                            </div>

                            
                            
                        </form>


                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-3 py-3 border font-normal">Producto [unidad]</th>
                                        <th scope="col" className="px-3 py-3 border font-normal">Stock</th>
                                        <th scope="col" className="px-3 py-3 border font-normal">Precio</th>
                                        <th scope="col" className="px-3 py-3 border font-normal">Cantidad</th>
                                        <th scope="col" className="px-3 py-3 border font-normal">Subtotal</th>
                                        <th scope="col" className="px-3 py-3 border font-normal"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-3 py-4 border">SAL [Kg]</td>
                                        <td className="px-3 py-4 border">50</td>
                                        <td className="px-3 py-4 border">S/ 1.5</td>
                                        <td className="px-3 py-4 border">2</td>
                                        <td className="px-3 py-4 border">S/ 3</td>
                                        <td className="px-3 py-4 border"></td>
                                    </tr>
                                {/*operation.product_tariffs.map((pt: number, index : number) => 
                                    <tr  key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-3 py-4 border">{productTariffs[index].productName}</td>
                                        <td className="px-3 py-4 border">{Number(operation.prices[index]).toFixed(2)}</td>
                                        <td className="px-3 py-4 border">{Number(operation.quantities[index]).toFixed(2)}</td>
                                        <td className="px-3 py-4 border">
                                        </td>
                                    </tr>
                                        )*/}
                                   
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>
            </div>

        
    </>
    )
}

export default InventoryRegisterOperationForm