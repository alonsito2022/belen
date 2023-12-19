"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IPerson, ICheeseSupplier } from '@/app/types';
import { toast } from "react-toastify";

function SupplierList({suppliers, setSuppliers, setSupplier, fetchSuppliers, fort, initialState, modal, setFilterObj, filterObj} : any) {
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

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, supplierObj: ICheeseSupplier) => {

        let updatedList = suppliers.map((item:ICheeseSupplier) => 
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
        let queryFetch = `
            mutation{
                saveCheeseSupplierTariff(
                    supplierId:${id}, 
                    productName: "${name}", 
                    purchasePrice1:${value},
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}
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
            toast(data.data.saveCheeseSupplierTariff.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchSuppliers();

        }).catch(e=>console.log(e));
    }

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }

    return (
    <>

        <div className="relative overflow-x-auto mt-2">

            <div className="flex items-center justify-between bg-gray-200 p-2 border gap-2 border-gray-200">
                <div className="">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" id="table-search" placeholder="Buscar por nombres" onChange={(e)=>{
                            setSearch(e.target.value)
                        }} className="block w-96 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                    </div>
                </div>
                <div className="">
                    <input type="week" name="week" value={filterObj.week } onChange={handleInputChangeWeek} className="form-control" />
                                
                </div>

                <button  onClick={(e)=>{
                        modal.show();
                        document.getElementById("modal-title")!.innerHTML = "Nuevo proveedor";
                        document.getElementById("btn-save-product")!.innerHTML = "Guardar proveedor";
                        setSupplier(initialState);
                    
                        
                }} className="btn-cyan border" type="button">
                Crear proveedor
                </button>

            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-4 border">ID</th>
                        <th scope="col" className="px-6 py-4 border">NOMBRES</th>
                        <th scope="col" className="px-6 py-4 border">Paria</th>
                        <th scope="col" className="px-6 py-4 border">Mozzarella</th>
                        <th scope="col" className="px-6 py-4 border">Tilsit</th>
                        <th scope="col" className="px-6 py-4 border">Andino</th>
                        <th scope="col" className="px-6 py-4 border">Edam</th>
                        <th scope="col" className="px-6 py-4 border">Gouda</th>
                        <th scope="col" className="px-6 py-4 border">ACCION</th>
                    </tr>
                </thead>
                <tbody>
                {suppliers
                .filter((item: ICheeseSupplier)=>{return search.toLowerCase()===""?item:item.name!.toLowerCase().includes(search);})
                .map((item: ICheeseSupplier) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                        <td className="px-2 py-2 border">{item.name}</td>
                        <td className="px-2 py-2 border">
                            <input type='number' name='pariah' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.pariah} className='form-control ' />
                        </td>
                        <td className="px-2 py-2 border">
                            <input type='number' name='mozzarella' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.mozzarella} className='form-control ' />
                        </td>
                        <td className="px-2 py-2 border">
                            <input type='number' name='tilsit' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.tilsit} className='form-control ' />
                        </td>
                        
                        <td className="px-2 py-2 border">
                            <input type='number' name='andean' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.andean} className='form-control ' />
                        </td>
                        <td className="px-2 py-2 border">
                            <input type='number' name='edam' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.edam} className='form-control ' />
                        </td>

                        <td className="px-2 py-2 border">
                            <input type='number' name='gouda' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.gouda} className='form-control ' />
                        </td>
                       
                        
                        <td className="px-2 py-2 border">
                            <div className="flex flex-row gap-1">
                                <button type="button" onClick={ async ()=>{

                                    await fetchSupplierByID(item.id);
                                    modal.show();
                                    document.getElementById("modal-title")!.innerHTML = "Editar proveedor";
                                    document.getElementById("btn-save-product")!.innerHTML = "Actualizar proveedor";
                                }} className="btn-green">
                                    Editar
                                </button>

                                {/*<button type="button" onClick={ async ()=>{

                                    document.getElementById("editSupplierTariffModalButton")?.click();
                                    setSupplier({...supplier, id:item.id})

                                }} className="inline-flex items-center text-white bg-green-600 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="mr-1 -ml-1 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z"/>
                                    </svg> Ver tarifas
                                        <span className="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-black bg-gray-200 rounded-full">
                                        {item.countSupplierTariffs}
                                        </span>
                                    
                            </button>*/}

                            <button type="button" onClick={ ()=>{deleteSupplierByID(item.id)}} className="btn-pink">
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