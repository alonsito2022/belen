"use client";
import { IChoice } from '@/app/types';
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent, useEffect } from "react";
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

function SupplierForm({modal, setModal, setSupplier, supplier, fetchSuppliers, fort, districts}: any) {

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
                        isEnabled:${supplier.isEnabled}, typeOfDairyProduct:"01", fortnightValue:${fort}, weekValue:${0}
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

                            <div className="grid gap-4 mb-4 sm:grid-cols-1">
                                <div>
                                    <label htmlFor="names" className="form-label">Nombres y apellidos:</label>
                                    <input type="text" name="names" id="names" value={supplier.names} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="form-control" placeholder="Walter Raul" required />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="form-label">Celular:</label>
                                    <input type="text" name="phone" id="phone" value={supplier.phone || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="form-control" placeholder="921269795"  />
                                </div>
                                <div>
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="text" name="email" id="email" value={supplier.email || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="form-control" placeholder="walt.r@gmail.com"  />
                                </div>
                                <div>
                                    <label htmlFor="address" className="form-label">Direccion:</label>
                                    <input type="text" name="address" id="address" value={supplier.address || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="form-control" placeholder="Av. Aviacion 145 AQP"  />
                                </div>

                                <div className="">
                                    <label htmlFor="district" className="form-label">Distrito:</label>
                                    
                                    <select name="district" id="district" onChange={handleInputChange} value={supplier.district?supplier.district.replace("A_", ""):"040601"} className="form-control">
                                        {districts.map((o:IChoice,k: number)=>(
                                            <option key={k} value={o.id}>{o.value}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end w-full">
                                    <ul className="text-sm font-medium text-gray-900">
                                        
                                        <li className="">
                                            <div className="flex items-center">
                                                <input name="isEnabled" id="isEnabled" type="checkbox" checked={supplier.isEnabled} onChange={handleCheckboxChange} className="form-check-input" />
                                                <label htmlFor="isEnabled" className="form-check-label">{supplier.isEnabled?"Activo":"Inactivo"}</label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>

                            <div className=" text-right">
                                <button id="btn-save-product" type="submit" className="btn-blue px-5 py-2.5">
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