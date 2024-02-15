"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IUnit } from '@/app/types';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'

const initialState = {
    id: 0,
    shortName: "",
    description: ""
}

function UnitPage() {
    const [units, setUnits] = useState< IUnit[]>([]);
    const [unit, setUnit] = useState(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setUnit({...unit, [name]: value});
    }

    const handleSaveWarehouse = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";
        if(Number(unit.id)!==0){
            queryFetch = `
                mutation{
                    updateUnit(
                        id:${unit.id}, shortName: "${unit.shortName}", description: "${unit.description}"
                    ){
                        unit {
                            id
                            shortName
                            description
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
                toast(data.data.updateUnit.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setUnit(initialState);
                const closeModalElement = document.getElementById('btn-close-modal');
                closeModalElement?.click();
                fetchUnits();

            }).catch(e=>console.log(e))
        }
        else{
            queryFetch = `
                mutation{
                    createUnit(
                        shortName: "${unit.shortName}", description: "${unit.description}"
                    ){
                        unit {
                            id
                            shortName
                            description
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
                toast(data.data.createUnit.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setUnit(initialState);
                const closeModalElement = document.getElementById('btn-close-modal');
                closeModalElement?.click();
                fetchUnits();

            }).catch(e=>console.log(e))
        }

    }

    async function fetchUnits(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        units {
                            id
                            shortName
                            description
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setUnits(data.data.units);
        })
    }

    async function fetchUnitByID(pk: number=0){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        unitById(pk: ${pk}){
                            id
                            shortName
                            description
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setUnit(data.data.unitById);
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
        fetchUnits();
    }, []);

    return (
        <>
            <Breadcrumb section={"Logística"} article={"Unidades"} />

            <div className="relative overflow-x-auto mt-2">


                <div className="flex items-center justify-end bg-gray-200 p-2 border border-gray-200">
                    <button id="btn-new" onClick={(e)=>{
                        modal.show();
                        document.getElementById("modal-title")!.innerHTML = "Nuevo unidad";
                        document.getElementById("btn-save-product")!.innerHTML = "Guardar unidad";
                        setUnit(initialState);
                    }} className="btn-cyan px-2 py-2 border" type="button">
                    Crear unidad
                    </button>

                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">NOMBRE</th>
                            <th scope="col" className="px-6 py-3">DESCRIPCION</th>
                            <th scope="col" className="px-6 py-3">ACCION</th>
                        </tr>
                    </thead>
                    <tbody>
                    {units.map((item) => 
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                            <td className="px-4 py-2">{item.shortName}</td>
                            <td className="px-4 py-2">{item.description}</td>
                            <td className="px-4 py-2">
                                <button type="button" onClick={ async ()=>{
                                    await fetchUnitByID(item.id);
                                    modal.show();
                                    document.getElementById("modal-title")!.innerHTML = "Editar unidad";
                                    document.getElementById("btn-save-product")!.innerHTML = "Actualizar unidad";
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
                            onClick={()=>{modal.hide();}}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveWarehouse}>
                            <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre corto</label>
                                    <input type="text" name="shortName" id="shortName" value={unit.shortName} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type unidad name" required />
                                </div>

                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripcion</label>
                                    <input type="text" name="description" id="description" value={unit.description} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type unidad name" required />
                                </div>

                            </div>

                            

                            <button id="btn-save-product" type="submit" className="btn-blue">
                                <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                Actualizar unidad
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UnitPage