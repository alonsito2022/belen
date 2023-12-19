import { IOperation, IProductTariff, IWarehouse } from "@/app/types";
import { toast } from "react-toastify";
import { ChangeEvent ,useState, useEffect, useRef, MouseEvent, FormEvent } from "react";
import { Modal, ModalOptions } from 'flowbite'

const options = [
    {id: "E", value: "ENTRADA"},
    {id: "S", value: "SALIDA"},
];

function InventoryRegisterOperationForm({modal, setModal , operation, setOperation, productTariffs, warehouses, fetchRegularizationOperations} : any) {

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setOperation({...operation, [name]: value});
    }

    const handleClickButtonAdd = (e: MouseEvent<HTMLButtonElement>) => {
        if(operation.warehouseId>0){
            if(operation.productTariffId>0){
                if(operation.quantity>0){
                    if((operation.operationAction=="E" && operation.price > 0) || operation.operationAction=="S"){
                        save()
                        
                    }
                    else
                        toast("Validar precio", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
                }
                else
                    toast("Validar cantidad", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
            }
            else
                toast("Validar presentacion de producto", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
        else
            toast("Validar almacen", { hideProgressBar: true, autoClose: 2000, type: 'warning' })

    }
    async function save(){
        let queryFetch: String = "";
        
        queryFetch = `
            mutation{
                saveRegularizationOperation(
                    warehouseId: ${operation.warehouseId}, 
                    userId: ${operation.userId}, 
                    operationAction: "${operation.operationAction}", 
                    operationDate: "${operation.operationDate}", 
                    observation: "${operation.observation}", 
                    productTariffId: ${operation.productTariffId}, 
                    price: ${Number(operation.price)!==0?operation.price:0}
                    quantity: ${Number(operation.quantity)!==0?operation.quantity:0}, 
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
            console.log(data.data)
            toast(data.data.saveRegularizationOperation.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

            setOperation( (prev : any) => ({...prev, observation: "CONSUMO DE PRODUCCION", productTariffId: 0,  quantity: 0, price: 0}))
            // document.getElementById("btn-close-supplier-modal")?.click();
            modal.hide();
            fetchRegularizationOperations()

        }).catch(e=>console.log(e))
        
    }


      useEffect(() => {
        
        if(modal == null){
            console.log('useEffect modal definided')
            const $targetEl = document.getElementById('top-left-modal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,
                /*onHide: () => {
                    console.log('modal is hidden');
                },
                onShow: () => {
                    console.log('modal is shown');
                },
                onToggle: () => {
                    console.log('modal has been toggled');
                }*/
            };
        
           // const modal = ;
            setModal(new Modal($targetEl, options))
        }

      }, []);

    return (
        <>


        <div id="top-left-modal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                                NUEVA OPERACION
                            </h3>
                        
                            <button type="button" onClick={()=>{modal.hide();}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form>

                            <div className="grid gap-4 mb-4 sm:grid-cols-4">

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

                            <div className="grid gap-4 mb-4 sm:grid-cols-3 items-end ">
                                <div>
                                    <label htmlFor="productTariffId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PRODUCTO [UNIDAD]</label>
                                    <select id="productTariffId" name="productTariffId" value={operation.productTariffId} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={0}>Elige una presentacion</option>
                                        {productTariffs.map((item: IProductTariff) => 
                                            <option key={item.id} value={item.id}>{item.productName} [{item.unitName}]</option>
                                        )}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CANTIDAD:</label>
                                    <input type="number" name="quantity" id="quantity" value={operation.quantity} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0"  />
                                </div>
                                
                                <div>
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PRECIO:</label>
                                    <input type="number" name="price" id="price" disabled={operation.operationAction=="E"?false:true} value={operation.price} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0"  />
                                </div>

                            </div>

                            
                            <div>
                                <label htmlFor="observation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DESCRIPCION</label>
                                <textarea id="observation" name="observation" value={operation.observation} onChange={handleInputChange}  rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Escribe tu observacion aqui..."></textarea>
                            </div>

                        

                            <div className=" text-right mt-2">
                                <button id="btn-save-product" type="button" onClick={handleClickButtonAdd} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
                                    + GUARDAR
                                </button>
                            </div>
                            
                        </form>



                    </div>
                </div>
            </div>

        
    </>
    )
}

export default InventoryRegisterOperationForm