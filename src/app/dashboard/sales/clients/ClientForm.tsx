"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent, useEffect } from "react";
import { ISaleCenter } from '@/app/types';
import { toast } from "react-toastify";

const initialState = {
    id: 0,
    names: "",
    phone: "",
    email: "",
    address: "",
    district: "040601",
    documentType: "01",
    documentNumber: "",
    saleCenterId: 0,
    saleCenterName: "",
    isEnabled: true,
}

function ClientForm({modal, setModal, setClient, client, fetchClients, salesCenter, fetchSalesCenter}: any) {


    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setClient({...client, [name]: value});
    }

    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";
        if(client.id===0){
            queryFetch = `
                mutation{
                    createClient(
                        names: "${client.names}", 
                        phone:"${client.phone}",
                        address:"${client.address}", 
                        saleCenterName:"${client.saleCenterName}"
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
                toast(data.data.createClient.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setClient(initialState);
                modal.hide();
                fetchClients();
                fetchSalesCenter();

            }).catch(e=>console.log(e))
        }else{
            queryFetch = `
                mutation{
                    updateClient(
                        id:${client.id}, 
                        names: "${client.names}", 
                        phone:"${client.phone}",
                        address:"${client.address}", 
                        saleCenterName:"${client.saleCenterName}"
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
                toast(data.data.updateClient.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setClient(initialState);
                modal.hide();
                fetchClients();
                fetchSalesCenter();
            }).catch(e=>console.log(e))
        }
    };


    const handleAddCity = async () => {

        console.log('handleAddCity')
        let queryFetch = `
            mutation{
                saveSaleCenter(
                    id: ${client.saleCenterId}, 
                    name: "${client.saleCenterName}"
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
            toast(data.data.saveSaleCenter.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchSalesCenter();

        }).catch(e=>console.log(e))
    };

    useEffect(() => {
        
        if(modal == null){
            const $targetEl = document.getElementById('clientFormModal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,

            };
        
            setModal(new Modal($targetEl, options))
        }

    }, []);

  return (
    <>
        
        <div id="clientFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-md max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                                Editar proveedor
                            </h3>
                            <button type="button" id="btn-close-client-modal" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                             onClick={()=>{modal.hide();}}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveSupplier}>
                            <input type="hidden" name="id" id="id" value={client.id} />
                            <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                <div>
                                    <label htmlFor="names" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres y apellidos:</label>
                                    <input type="text" name="names" id="names" value={client.names} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Walter Raul" required />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular:</label>
                                    <input type="text" name="phone" id="phone" value={client.phone || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="921269795"  />
                                </div>
                                

                                <div>
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direccion:</label>
                                    <input type="text" name="address" id="address" value={client.address || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Av. Aviacion 145 AQP"  />
                                </div>

                                <div>
                                    <label htmlFor="saleCenterName" className="form-label">Centro de venta:</label>
                                    <input
                                        type="search"
                                        value={client.saleCenterName || ''}
                                        onChange={handleInputChange}
                                        list="cities"
                                        name="saleCenterName"
                                        id="saleCenterName"
                                        className='form-control uppercase'
                                        placeholder="Escribe un centro de venta"
                                        autoComplete='off'
                                    />

                                    <datalist id="cities">
                                        {salesCenter.map((c: ISaleCenter, index: number) => (
                                            <option key={index} value={c.name} />
                                        ))}
                                    </datalist>

                                    <button type='button' onClick={handleAddCity} className=' default-link text-xs'>Agregar centro de venta</button>
                                    
                                </div>

                            
                            </div>

                            <div className=" text-right">
                                <button id="btn-save-product" type="submit" className="btn-green px-5 py-2.5 ">
                                    Actualizar
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>

        
    </>
    )

}

export default ClientForm