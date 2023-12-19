"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IPerson } from '@/app/types';
import { toast } from "react-toastify";

function SupplierList({suppliers, setSuppliers, setSupplier, fetchSuppliers, fort, initialState, modal} : any) {

    const [search, setSearch] = useState("");

    async function fetchSupplierByID(pk: number){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        supplierById(pk: ${pk}){
                            id
                            names
                            documentType
                            documentNumber
                            phone
                            email
                            address
                            license
                            district
                            isEnabled
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSupplier(data.data.supplierById);
        })
    }

    async function deleteSupplierByID(pk: number){
        
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                mutation {
                        deleteSupplier(id: ${pk}) {
                            message
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data.data.deleteSupplier.message);
            toast(data.data.deleteSupplier.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchSuppliers()
        })
        
    }

    const [inputTimeout, setInputTimeout] = useState<any>(null)

    useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, supplierObj: IPerson) => {

        let updatedList = suppliers.map((item:IPerson) => 
        {
        if (item.id == supplierObj.id){
            if (inputTimeout) clearTimeout(inputTimeout)
            setInputTimeout(
                setTimeout(() => {
                    saveSupplierTariff(supplierObj.id, name, value)
                }, 1000)
            )
            return {...item, [name]: value}; //gets everything that was already in item, and updates "done"
        }
        return item; // else return unmodified item 
        });
        setSuppliers(updatedList);
    
    }


    async function saveSupplierTariff(id:number, name:string, value:string){
        let supplierObj = suppliers.find((s:IPerson) => s.id === id)
        let purchasePrice1:number = name=="priceMilkTomorrowByFortnight"?value:supplierObj.priceMilkTomorrowByFortnight;
        let purchasePrice2:number = name=="priceMilkAfternoonByFortnight"?value:supplierObj.priceMilkAfternoonByFortnight;

        let queryFetch = `
            mutation{
                saveSupplierTariff(
                    supplierId:${supplierObj.id}, productTariffId: ${5}, 
                    purchasePrice1:${purchasePrice1}, purchasePrice2:${purchasePrice2},
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
            fetchSuppliers();

        }).catch(e=>console.log(e));
    }

    return (
    <>

        <div className="relative overflow-x-auto mt-2">

            <div className="flex items-center justify-between bg-gray-200 p-2 border gap-2 border-gray-200">

                <div className=" ">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" id="table-search" placeholder="Buscar por nombres" onChange={(e)=>{
                            setSearch(e.target.value)
                        }} className="block w-96 p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                    </div>
                </div>

                <button  onClick={(e)=>{
                        modal.show();
                        document.getElementById("modal-title")!.innerHTML = "Nuevo proveedor";
                        document.getElementById("btn-save-product")!.innerHTML = "Guardar proveedor";
                        setSupplier(initialState);
                    
                        
                }} className="btn-cyan border px-5 py-2.5" type="button">
                Crear proveedor
                </button>



            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-4 border">ID</th>
                        <th scope="col" className="px-6 py-4 border">NOMBRES</th>
                        <th scope="col" className="px-6 py-4 border">PRECIO LECHE<br/>MAÑANA</th>
                        <th scope="col" className="px-6 py-4 border">PRECIO LECHE<br/>TARDE</th>
                        <th scope="col" className="px-6 py-4 border">ACCION</th>
                    </tr>
                </thead>
                <tbody>
                {suppliers
                .filter((item: IPerson)=>{return search.toLowerCase()===""?item:item.names.toLowerCase().includes(search);})
                
                .map((item: IPerson) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                        <td className="px-2 py-2 border">{item.names}</td>
                        <td className="px-2 py-2 border">
                        <input type='number' name='priceMilkTomorrowByFortnight' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} 
                        value={item.priceMilkTomorrowByFortnight} className='form-control text-xl' />
                        </td>
                        <td className="px-2 py-2 border">
                        <input type='number' name='priceMilkAfternoonByFortnight' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} 
                        value={item.priceMilkAfternoonByFortnight} className='form-control text-xl' />

                        </td>
                        
                        
                        <td className="px-2 py-2 border">
                            <div className="flex flex-row gap-1">
                                <button type="button" onClick={ async ()=>{

                                    await fetchSupplierByID(item.id);
                                    modal.show();
                                    document.getElementById("modal-title")!.innerHTML = "Editar proveedor";
                                    document.getElementById("btn-save-product")!.innerHTML = "Actualizar proveedor";
                                }} className="btn-green px-5 py-2.5">
                                    Editar
                                </button>


                            <button type="button" onClick={ ()=>{deleteSupplierByID(item.id)}} 
                            className="btn-blue px-5 py-2.5">
                                   Eliminar
                            </button>

                                
                            </div>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
            
        </div>

    </>
  )
}

export default SupplierList