"use client";
import Breadcrumb from "@/components/Breadcrumb"
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { ISubsidiary, IWarehouse } from '@/app/types';
import { toast } from "react-toastify";
import { Modal, ModalOptions } from 'flowbite'

const initialState = {
    id: 0,
    name: "",
    category: "NA",
    subsidiaryId: 0
}

function WarehousePage() {
    const options = [
        {id: '01', value: 'COMPRA'}, {id: '02', value: 'INSUMO'}, {id: '03', value: 'VENTA'},  {id: '04', value: 'VEHICULO'}, {id: '05', value: 'ACOPIO'}, {id: 'NA', value: 'NO APLICA'},
    ];
    const [subsidiaries, setSubsidiaries] = useState< ISubsidiary[]>([]);
    const [warehouses, setWarehouses] = useState< IWarehouse[]>([]);
    const [warehouse, setWarehouse] = useState(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setWarehouse({...warehouse, [name]: value});
    }

    const handleSaveWarehouse = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";
        if(Number(warehouse.id)!==0){
            queryFetch = `
                mutation{
                    updateWarehouse(
                        id:${warehouse.id}, name: "${warehouse.name}", category: "${warehouse.category}", subsidiaryId: ${warehouse.subsidiaryId}
                    ){
                        warehouse {
                            id
                            name
                            category
                        }
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
                toast(data.data.updateWarehouse.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setWarehouse(initialState);
                modal.hide();
                fetchWarehouses();

            }).catch(e=>console.log(e))
        }
        else{
            queryFetch = `
                mutation{
                    createWarehouse(
                        name: "${warehouse.name}", category: "${warehouse.category}", subsidiaryId: ${warehouse.subsidiaryId}
                    ){
                        warehouse {
                            id
                            name
                            category
                        }
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
                toast(data.data.createWarehouse.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setWarehouse(initialState);
                modal.hide();
                fetchWarehouses();

            }).catch(e=>console.log(e))
        }

    }

    async function fetchSubsidiaries(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        subsidiaries {
                            id
                            name
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSubsidiaries(data.data.subsidiaries);
        })
    }

    async function fetchWarehouses(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        warehouses {
                            id
                            name
                            category
                            categoryReadable
                            subsidiaryId
                            subsidiaryName
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setWarehouses(data.data.warehouses);
        })
    }

    async function fetchWarehouseByID(pk: number=0){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        warehouseById(pk: ${pk}){
                            id
                            name
                            category
                            subsidiaryId
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setWarehouse(data.data.warehouseById);
        })
    }

    useEffect(() => {
        
        if(modal == null){

            const $targetEl = document.getElementById('defaultModal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,

            };

            setModal(new Modal($targetEl, options))
        }

        fetchWarehouses();
        fetchSubsidiaries();
    }, []);


    return (
        <>

        <Breadcrumb section={"Logística"} article={"Almacenes"} />




        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">



            <div className="flex items-center justify-end bg-gray-200 p-2 border border-gray-200">
                <button id="btn-new" onClick={(e)=>{
                            modal.show();
                            document.getElementById("modal-title")!.innerHTML = "Nuevo almacen";
                            document.getElementById("btn-save-product")!.innerHTML = "Guardar almacen";
                            setWarehouse(initialState);

                }} className="btn-cyan px-2 py-2" type="button">
                Crear almacen
                </button>


            </div>


            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-2">ID</th>
                        <th scope="col" className="px-4 py-2">NOMBRE</th>
                        <th scope="col" className="px-4 py-2">CATEGORIA</th>
                        <th scope="col" className="px-4 py-2">SEDE</th>
                        <th scope="col" className="px-4 py-2">ACCION</th>
                    </tr>
                </thead>
                <tbody>
                {warehouses.map((item) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.categoryReadable}</td>
                        <td className="px-4 py-2">{item.subsidiaryName}</td>
                        <td className="px-4 py-2">
                            <button type="button" onClick={ async ()=>{
                                await fetchWarehouseByID(item.id);
                                modal.show();
                                
                                document.getElementById("modal-title")!.innerHTML = "Editar almacen";
                                document.getElementById("btn-save-product")!.innerHTML = "Actualizar almacen";
                                
                            }}
                            className="btn-green px-2 py-2">Editar</button>
                        
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>



        <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto mt-16">

                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                            Editar
                        </h3>
                        <button type="button" id="btn-close-modal" 
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                        onClick={()=>{modal.hide();}} >
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSaveWarehouse}>
                        <input type="hidden" name="id" id="id" value={warehouse.id} />
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input type="text" name="name" id="name" value={warehouse.name} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="form-control" placeholder="Type almacen name" required />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="category" className="form-label">Categoria</label>
                                <select name="category" id="category" onChange={handleInputChange} value={warehouse.category.replace("A_", "")} className="form-control">
                                    {options.map((o,k)=>(
                                        <option key={k} value={o.id}>{o.value}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="subsidiaryId" className="form-label">Sede</label>
                                <select name="subsidiaryId" id="subsidiaryId" onChange={handleInputChange} value={warehouse.subsidiaryId} className="form-control">
                                    {subsidiaries.map((o,k)=>(
                                        <option key={k} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        

                        <button id="btn-save-product" type="submit" 
                        className="btn-blue ">
                            <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                            Actualizar alamcen
                        </button>
                    </form>
                </div>
            </div>
        </div>




        </>
        

    )
}

export default WarehousePage