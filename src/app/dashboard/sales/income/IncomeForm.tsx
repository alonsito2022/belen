"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff, ICheeseSupplier } from '@/app/types';
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

function IncomeForm({modal, setModal, setSupplier, supplier, fetchSuppliers, filterObj}: any) {
    const [suppliersWithoutWeek, setSuppliersWithoutWeek] = useState< ICheeseSupplier[]>([]);
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setSupplier({...supplier, [name]: value});
    }

    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";
        if(supplier.id>0){
            queryFetch = `
                mutation{
                    saveSupplierWithWeek(
                        supplierId:${supplier.id},
                        typeOfDairyProduct:"03", 
                        weekValue:${Number(filterObj.week.toString().replace("-W", ""))}
                    ){
                        message
                    }
                }
            `;
            console.log(queryFetch)
            
            await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({query: queryFetch})
            })
            .then(res=>res.json())
            .then(data=>{
                toast(data.data.saveSupplierWithWeek.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setSupplier(initialState);
                modal.hide();
                fetchSuppliers();

            }).catch(e=>console.log(e))
        }

    };
    
    async function fetchDairySuppliers(){
        let queryfecth = `
            query {
                suppliersByWeekAndTypeOfDairyProduct(
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, 
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    allSuppliers:${false}
                    supplierId:${0}
                    includeWeek:${false}
                ) {
                    id
                    name
                }
            }
        `;
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSuppliersWithoutWeek(data.data.suppliersByWeekAndTypeOfDairyProduct);
        })
        
    }


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

    useEffect(() => {
        if(filterObj.week.length > 0)
        fetchDairySuppliers();
    }, [filterObj]);

    return (
        <>
        <div id="supplierFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-md max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-2 mb-2 rounded-t ">
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

                                    
                                    <select name="id" id="id" onChange={handleInputChange} value={supplier.id} className=" form-control mb-3">
                                        {suppliersWithoutWeek.map((o,k)=>(
                                            <option key={k} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>


                            <div className=" text-right">
                                <button id="btn-save-product" type="submit" className=" btn-blue px-5 py-2.5 ">
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

export default IncomeForm