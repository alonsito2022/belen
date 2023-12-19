"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, MouseEvent, FormEvent ,useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';
import { toast } from "react-toastify";

const initialStateSupplierTariff = {
    id: 0,
    productTariffId: 5,
    supplierId: 0,
    purchasePrice1: 0,
    purchasePrice2: 0
}


function SupplierTariffForm({supplier, fetchSuppliers, fort}: any) {

    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [supplierTariff, setsupplierTariff] = useState<any | ISupplierTariff>(initialStateSupplierTariff);
    const [supplierTariffs, setsupplierTariffs] = useState< ISupplierTariff[]>([]);

    const handleInputChangeFST = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setsupplierTariff({...supplierTariff, [name]: value});
    }

    const handleClickSupplierTariff = (e: MouseEvent<HTMLElement>, obj:ISupplierTariff ) => {
        setsupplierTariff(obj)
    }

    const handleSaveSupplierTariff = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = `
            mutation{
                saveSupplierTariff(
                    supplierId:${supplierTariff.supplierId}, productTariffId: ${supplierTariff.productTariffId}, 
                    purchasePrice1:${supplierTariff.purchasePrice1}, purchasePrice2:${supplierTariff.purchasePrice2},
                    fortnightValue:${fort}
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
            toast(data.data.saveSupplierTariff.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            setsupplierTariff(initialStateSupplierTariff);
            /*const closeModalElement = document.getElementById('btn-close-supplier-tariff-modal');
            closeModalElement?.click();*/
            fetchSuppliers();

        }).catch(e=>console.log(e))
        
    };
    
    async function fetchSupplierTariffsBySupplierId(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        supplierTariffsBySupplierId(pk:${supplier.id}, fortnightValue:${fort}) {
                            id
                            supplierId
                            supplierName
                            productTariffId
                            productTariffName
                            purchasePrice1
                            purchasePrice2
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setsupplierTariffs(data.data.supplierTariffsBySupplierId);
        })
        
    }
    
    async function fetchProductTariffs(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        productTariffs {
                            id
                            productName
                            unitName
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setProductTariffs(data.data.productTariffs);
        })
        
    }

    useEffect(() => {
        fetchProductTariffs();
        // console.log(document.getElementById("fortnight-value").value)
    }, []);

    useEffect(() => {
        setsupplierTariff({...supplierTariff, supplierId: supplier.id})
        if(supplier.id!==0 && fort>0){
            fetchSupplierTariffsBySupplierId();
        }
    }, [supplier]);

    return (
    <>

        <div id="supplier-tariff-modal" tabIndex={-1} className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
            <div className="relative w-full max-w-md max-h-full">
                {/*<!-- Modal content -->*/}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/*<!-- Modal header -->*/}
                    <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Tarifa de compra
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                        data-modal-hide="supplier-tariff-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/*<!-- Modal body -->*/}
                    <div className="p-6 space-y-6">
                        
                        <form onSubmit={handleSaveSupplierTariff}>

                    
                            <div className="flex flex-col justify-items-end">


                                <div className="mb-3">
                                    <label htmlFor="productTariffId" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Producto según unidades:</label>

                                    <select name="productTariffId" id="productTariffId" onChange={handleInputChangeFST} value={supplierTariff.productTariffId} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                    <option value={0}>Elige</option>
                                    {productTariffs.map((o,k)=>(
                                    <option key={k} value={o.id}>{o.productName + " [" + o.unitName + "]"}</option>
                                    ))}
                                    </select>

                                </div>

                                <div className="mb-3">
                                    <label htmlFor="purchasePrice1" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Precio litro mañana:</label>
                                    <input type="number" id="purchasePrice1" name="purchasePrice1" value={supplierTariff.purchasePrice1 || ''} onChange={handleInputChangeFST} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.00" required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="purchasePrice2" className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Precio litro tarde:</label>
                                    <input type="number" id="purchasePrice2" name="purchasePrice2"  value={supplierTariff.purchasePrice2 || ''} onChange={handleInputChangeFST} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.00" required />
                                </div>
                                <div className="mb-0 flex flex-col gap-3">
                                    {supplierTariff.id===0?(
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Crear tarifa</button>

                                    ):(
                                        <>
                                        <button type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Actualizar tarifa</button>

                                        <button type="button" onClick={()=>{setsupplierTariff(initialStateSupplierTariff)}} className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Cancelar</button>

                                        </>
                                        
                                    )}
                                </div>


                            </div>
                        </form>


                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-3 py-3 font-normal">Producto [unidad]</th>
                                        <th scope="col" className="px-3 py-3 font-normal">Precio litro mañana</th>
                                        <th scope="col" className="px-3 py-3 font-normal">Precio litro tarde</th>
                                        <th scope="col" className="px-3 py-3 font-normal"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {supplierTariffs.map((st) => 
                                    <tr  key={st.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-3 py-4">{st.productTariffName}</td>
                                        <td className="px-3 py-4">{Number(st.purchasePrice1).toFixed(2)}</td>
                                        <td className="px-3 py-4">{Number(st.purchasePrice2).toFixed(2)}</td>
                                        <td className="px-3 py-4">
                                            <button type="button" onClick={e=>handleClickSupplierTariff(e, st)} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Editar</button>
                                        </td>
                                    </tr>
                                )}
                                   
                                </tbody>
                            </table>
                        </div>


                    </div>
                    {/*<!-- Modal footer -->*/}
                    <div className="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button id="btn-close-supplier-tariff-modal" data-modal-hide="supplier-tariff-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

    </>
    )
}

export default SupplierTariffForm