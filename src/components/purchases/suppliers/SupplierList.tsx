"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IPerson } from '@/app/types';
import { toast } from "react-toastify";

function SupplierList({suppliers, setSuppliers, setSupplier, setPage, page, totalPages, totalSuppliers, pageSize, setPageSize, fetchSuppliers, fort} : any) {

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

    const selectPageHandler = (selectedPage: number) =>{
        if(
            selectedPage >= 1 &&
            selectedPage<= totalPages &&
            selectedPage !== page
        )
        setPage(selectedPage)
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
            // setsupplierTariff(initialStateSupplierTariff);
            fetchSuppliers();

        }).catch(e=>console.log(e));
    }

    return (
    <>

        <div className="relative overflow-x-auto ">

            <div className="flex justify-between pb-4">
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

                <div className="grid grid-cols-2 gap-4 items-stretch">
                    <label htmlFor="page-size" className="self-center text-zinc-900">Registros:</label>
                    <select id="page-size" onChange={(e)=>{setPageSize(e.target.value)}} value={pageSize} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-4 border">ID</th>
                        <th scope="col" className="px-6 py-4 border">NOMBRES</th>
                        <th scope="col" className="px-6 py-4 border">PRECIO LECHE<br/>MAÑANA</th>
                        <th scope="col" className="px-6 py-4 border">PRECIO LECHE<br/>TARDE</th>
                        {/*<th scope="col" className="px-6 py-4 border">DOC TIP</th>
                        <th scope="col" className="px-6 py-4 border">DOC NUM</th>
                        <th scope="col" className="px-6 py-4 border">CELULAR</th>
                        <th scope="col" className="px-6 py-4 border">EMAIL</th>
                        <th scope="col" className="px-6 py-4 border">DIRECCION</th>
                        <th scope="col" className="px-6 py-4 border">DISTRITO</th>
                        <th scope="col" className="px-6 py-4 border">ESTADO</th>
                        */}
                        
                        <th scope="col" className="px-6 py-4 border">ACCION</th>
                    </tr>
                </thead>
                <tbody>
                {suppliers
                .filter((item: IPerson)=>{return search.toLowerCase()===""?item:item.names.toLowerCase().includes(search);})
                //.slice(page * 10 - 10, page * 10)
                .map((item: IPerson) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                        <td className="px-2 py-2 border">{item.names}</td>
                        <td className="px-2 py-2 border">
                        <input type='number' name='priceMilkTomorrowByFortnight' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.priceMilkTomorrowByFortnight} className='block w-full p-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 lg:text-xl sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />

                        </td>
                        <td className="px-2 py-2 border">
                        <input type='number' name='priceMilkAfternoonByFortnight' onFocus={(e) => e.target.select()} onChange={e=>handleInputChange(e, item)} value={item.priceMilkAfternoonByFortnight} className='block w-full p-2 text-gray-900 border border-gray-200 rounded-lg bg-gray-50 lg:text-xl sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />

                        </td>
                        {/*<td className="px-2 py-2 border">{item.documentTypeReadable}</td>
                        <td className="px-2 py-2 border">{item.documentNumber}</td>
                        <td className="px-2 py-2 border">{item.phone}</td>
                        <td className="px-2 py-2 border">{item.email}</td>
                        <td className="px-2 py-2 border">{item.address}</td>
                        <td className="px-2 py-2 border">{item.districtReadable}</td>
                        <td className="px-2 py-2 border">{item.isEnabled?"ACTIVO":"INACTIVO"} </td>
                        */}
                        
                        
                        <td className="px-2 py-2 border">
                            <div className="flex flex-row gap-1">
                                <button type="button" onClick={ async ()=>{

                                    await fetchSupplierByID(item.id);
                                    document.getElementById("editSupplierModalButton")?.click();
                                    document.getElementById("modal-title")!.innerHTML = "Editar proveedor";
                                    document.getElementById("btn-save-product")!.innerHTML = "Actualizar proveedor";
                                }} className="inline-flex items-center text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="mr-1 -ml-1 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-1.391 7.361.707-3.535a3 3 0 0 1 .82-1.533L7.929 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h4.259a2.975 2.975 0 0 1-.15-1.639ZM8.05 17.95a1 1 0 0 1-.981-1.2l.708-3.536a1 1 0 0 1 .274-.511l6.363-6.364a3.007 3.007 0 0 1 4.243 0 3.007 3.007 0 0 1 0 4.243l-6.365 6.363a1 1 0 0 1-.511.274l-3.536.708a1.07 1.07 0 0 1-.195.023Z"/>
                                    </svg> Editar
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

                            <button type="button" onClick={ ()=>{deleteSupplierByID(item.id)}} className="inline-flex items-center text-white bg-red-600 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                   Eliminar
                            </button>

                                
                            </div>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
            {totalSuppliers>0 &&
            <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Mostrando <span className="font-semibold text-gray-900 dark:text-white">1-{totalPages}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalSuppliers}</span></span>
                <ul className="inline-flex -space-x-px text-sm h-8">
                    {page > 1 ?(<li>
                        <a href="#" onClick={()=>selectPageHandler(page - 1)} className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Anterior</a>
                    </li>):""}
                    {
                        [...Array(totalPages)].map((_,i)=>{
                            return (
                                <li key={i}>
                                    <a href="#" onClick={()=>selectPageHandler(i + 1)}  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{ i + 1}</a>
                                </li>
                            )
                        })
                    }
                    
                    {/*
                    <li>
                        <a href="#" 
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                    </li>
                    <li>
                        <a href="#" aria-current="page" 
                        className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                    </li>
                */}

                    {page < totalPages ?(<li>
                        <a href="#" onClick={()=>selectPageHandler(page + 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Siguiente</a>
                    </li>):""}
                </ul>
            </nav>}
        </div>

    </>
  )
}

export default SupplierList