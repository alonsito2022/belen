"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';
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
    isEnabled: true,
}

function SupplierForm({modal, setModal, setSupplier, supplier, fetchSuppliers, fort, filterObj}: any) {
    const options = [
        {id: "040601", value: "CHUQUIBAMBA"},

        {id: "040129", value: "JOSE LUIS BUSTAMANTE Y RIVERO"},
        {id: "040128", value: "ALTO SELVA ALEGRE"},
        {id: "040127", value: "JACOBO HUNTER"},
        {id: "040126", value: "MARIANO MELGAR"},
        {id: "040125", value: "YURA"},
        {id: "040124", value: "YARABAMBA"},
        {id: "040123", value: "YANAHUARA"},
        {id: "040122", value: "VITOR"},
        {id: "040121", value: "UCHUMAYO"},
        {id: "040120", value: "TIABAYA"},
        {id: "040119", value: "SOCABAYA"},
        {id: "040118", value: "STA RITA DE SIGUAS"},
        {id: "040117", value: "SANTA ISABEL DE SIGUAS"},
        {id: "040116", value: "SAN JUAN DE TARUCANI"},
        {id: "040115", value: "SAN JUAN DE SIGUAS"},
        {id: "040114", value: "SACHACA"},
        {id: "040113", value: "SABANDIA"},
        {id: "040112", value: "QUEQUENA"},
        {id: "040111", value: "POLOBAYA"},
        {id: "040110", value: "POCSI"},
        {id: "040109", value: "PAUCARPATA"},
        {id: "040108", value: "MOLLEBAYA"},
        {id: "040107", value: "MIRAFLORES"},
        {id: "040106", value: "LA JOYA"},
        {id: "040105", value: "CHIGUATA"},
        {id: "040104", value: "CHARACATO"},
        {id: "040103", value: "CERRO COLORADO"},
        {id: "040102", value: "CAYMA"},
        {id: "040101", value: "AREQUIPA"},
    ];
    

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setSupplier({...supplier, [name]: value});
    }

    const handleCheckboxChange = ({target: { name, checked} }: ChangeEvent<HTMLInputElement>) => {
        setSupplier({...supplier, [name]: checked});
    }

    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";
        if(supplier.id===0){
            queryFetch = `
                mutation{
                    createSupplier(
                        names: "${supplier.names}", documentType: "${supplier.documentType}", documentNumber: "${supplier.documentNumber}", 
                        phone:"${supplier.phone}", email:"${supplier.email}", address:"${supplier.address}", district:"${supplier.district}", 
                        isEnabled:${supplier.isEnabled}, typeOfDairyProduct:"03", fortnightValue:${0}, weekValue:${Number(filterObj.week.toString().replace("-W", ""))}
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
                toast(data.data.createSupplier.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setSupplier(initialState);
                modal.hide();
                fetchSuppliers();

            }).catch(e=>console.log(e))
        }else{
            queryFetch = `
                mutation{
                    updateSupplier(
                        id:${supplier.id}, names: "${supplier.names}", documentType: "${supplier.documentType}", documentNumber: "${supplier.documentNumber}", 
                        phone:"${supplier.phone}", email:"${supplier.email}", address:"${supplier.address}", district:"${supplier.district}", isEnabled:${supplier.isEnabled}
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
                toast(data.data.updateSupplier.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setSupplier(initialState);
                modal.hide();
                fetchSuppliers();

            }).catch(e=>console.log(e))

        }

    };


    useEffect(() => {
        
        if(modal == null){
            const $targetEl = document.getElementById('supplierFormModal');
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
        
        <div id="supplierFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-md max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                                Editar proveedor
                            </h3>
                            <button type="button" id="btn-close-supplier-modal" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                             onClick={()=>{modal.hide();}}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveSupplier}>
                            <input type="hidden" name="id" id="id" value={supplier.id} />
                            <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                <div>
                                    <label htmlFor="names" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres y apellidos:</label>
                                    <input type="text" name="names" id="names" value={supplier.names} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Walter Raul" required />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular:</label>
                                    <input type="text" name="phone" id="phone" value={supplier.phone || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="921269795"  />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                                    <input type="text" name="email" id="email" value={supplier.email || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="walt.r@gmail.com"  />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Direccion:</label>
                                    <input type="text" name="address" id="address" value={supplier.address || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Av. Aviacion 145 AQP"  />
                                </div>

                                <div className="">
                                    <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Distrito:</label>
                                    
                                    <select name="district" id="district" onChange={handleInputChange} value={supplier.district?supplier.district.replace("A_", ""):"040601"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {options.map((o,k)=>(
                                            <option key={k} value={o.id}>{o.value}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end w-full">
                                    <ul className="text-sm font-medium text-gray-900">
                                        
                                        <li className="">
                                            <div className="flex items-center">
                                                <input name="isEnabled" id="isEnabled" type="checkbox" checked={supplier.isEnabled} onChange={handleCheckboxChange} className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="isEnabled" className="w-full py-3 ml-2 text-lg font-medium text-gray-900 dark:text-gray-300">{supplier.isEnabled?"Activo":"Inactivo"}</label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>

                            <div className=" text-right">
                                <button id="btn-save-product" type="submit" className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ">
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

export default SupplierForm