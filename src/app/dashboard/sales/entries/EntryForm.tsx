"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { ICheeseSupplier, IPerson, IProductTariff, ISupplierTariff, IUser } from '@/app/types';
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
    
    observation: "",
    employeeId: 0,
}


function EntryForm({modal, setModal, setEntry, entry, fetchEntries, filterObj, suppliers, productTariffs, setProductTariffs, tempProductTariffs, setTempProductTariffs, users}: any) {

    async function fetchProductTariffsBySupplierId(id: number){
        let queryfecth = `
            query {
                suppliersByWeekAndTypeOfDairyProduct(
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, 
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    allSuppliers:${false}, supplierId:${id}, includeWeek:${true}
                ) {
                    id
                    name
                    pariah
                    mozzarella
                    tilsit
                    andean
                    edam
                    gouda
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
            if(data.data.suppliersByWeekAndTypeOfDairyProduct){
                let obj = data.data.suppliersByWeekAndTypeOfDairyProduct[0];
                let array = [];
                let pariahObj = productTariffs.find((s:IProductTariff) => s.productName?.toLowerCase() === "paria");
                let mozzarellaObj = productTariffs.find((s:IProductTariff) => s.productName?.toLowerCase() === "mozzarella");
                let tilsitObj = productTariffs.find((s:IProductTariff) => s.productName?.toLowerCase() === "tilsit");
                let andeanObj = productTariffs.find((s:IProductTariff) => s.productName?.toLowerCase() === "andino");
                let edamObj = productTariffs.find((s:IProductTariff) => s.productName?.toLowerCase() === "edam");
                let goudaObj = productTariffs.find((s:IProductTariff) => s.productName?.toLowerCase() === "gouda");
                
                // if (obj.pariah > 0) {
                    pariahObj.purchasePrice1 = obj.pariah;
                    array.push(pariahObj);
                // }
                // if (obj.mozzarella > 0) {
                    mozzarellaObj.purchasePrice1 = obj.mozzarella;
                    array.push(mozzarellaObj);
                // }
                // if (obj.tilsit > 0) {
                    tilsitObj.purchasePrice1 = obj.tilsit;
                    array.push(tilsitObj);
                // }
                // if (obj.andean > 0) {
                    andeanObj.purchasePrice1 = obj.andean;
                    array.push(andeanObj);
                // }
                // if (obj.edam > 0) {
                    edamObj.purchasePrice1 = obj.edam;
                    array.push(edamObj);
                // }
                // if (obj.gouda > 0) {
                    goudaObj.purchasePrice1 = obj.gouda;
                    array.push(goudaObj);
                // }
                setTempProductTariffs(array)
            }
        })
        
    }

    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let queryFetch: String = "";

            queryFetch = `
                mutation{
                    createEntry(
                        
                        supplierId: ${entry.supplierId}, 
                        productTariffId: ${entry.productTariffId}, 
                        quantityMold: ${entry.quantityMold}, 
                        price: ${entry.price}, 
                        weekValue:${Number(filterObj.week.toString().replace("-W", ""))},
                        warehouseId:${filterObj.warehouseId}, 
                        employeeId: ${entry.employeeId}, 
                        observation: "${entry.observation}"
                        operationDate: "${entry.operationDate}"
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
                toast(data.data.createEntry.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                // setEntry(initialState);
                setEntry({
                    ...entry, 
                    id: 0,
                    names: "",
                    phone: "",
                    email: "",
                    address: "",
                    district: "040601",
                    documentType: "01",
                    documentNumber: "",
                    isEnabled: true,
                    
                    observation: "",
                    employeeId: 0,
                });
                modal.hide();
                fetchEntries();

            }).catch(e=>console.log(e))
        

    };

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        
        if(name=="supplierId" && Number(value)>0){
            setEntry({...entry, [name]: value, productTariffId: 0, price: 0});
            fetchProductTariffsBySupplierId(Number(value))
        }
        else if(name=="productTariffId"){
            if(Number(value)>0){
                let productTariffObj = tempProductTariffs.find((s:IProductTariff) => s.id.toString() === value.toString());
                setEntry({...entry, [name]: value, price: productTariffObj.purchasePrice1});
            }
            else{
                setEntry({...entry, [name]: value, price: 0});
            }
            
        }
        else{
            setEntry({...entry, [name]: value});
        }
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
                                    <label htmlFor="operationDate" className="form-label">Fecha:</label>
                                    <input type="date" 
                                        name="operationDate" 
                                        id="operationDate" value={entry.operationDate || ""} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="supplierId" className="form-label">Proveedor:</label>
                                    <select name="supplierId" id="supplierId" onChange={handleInputChange} value={entry.supplierId} className="form-control">
                                    <option value={0}>{"ELEGIR"}</option>
                                        {suppliers.map((o: ICheeseSupplier,k: number)=>(
                                            <option key={k} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="productTariffId" className="form-label">Tipo de queso:</label>
                                    <select name="productTariffId" id="productTariffId" onChange={handleInputChange} value={entry.productTariffId} className="form-control">
                                    <option value={0}>{"ELEGIR"}</option>
                                        {tempProductTariffs.map((o: IProductTariff,k: number)=>(
                                            <option key={k} value={o.id}>{o.productName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="quantityMold" className="form-label">Cantidad moldes:</label>
                                    <input type="text" name="quantityMold" id="quantityMold" value={entry.quantityMold || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
                                    className="form-control"   />
                                </div>

                                <div>
                                    <label htmlFor="price" className="form-label">Precio ingreso:</label>
                                    <input type="text" name="price" id="price" value={entry.price || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
                                    className="form-control"   />
                                </div>

                                <div>
                                    <label htmlFor="driverId" className="form-label">Conductor:</label>
                                    <select name="driverId" id="driverId" onChange={handleInputChange} value={entry.driverId} className="form-control">
                                    <option value={0}>{"ELEGIR"}</option>
                                        {users.map((o: IUser,k: number)=>(
                                            <option key={k} value={o.id}>{o.lastName}, {o.firstName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="observation" className="form-label">Observaciones:</label>
                                    <textarea id="observation" name="observation" rows={4} className=" form-control" placeholder="Escribe tus pensamientos aquí..."></textarea>

                                </div>

                            </div>

                            <div className=" text-right">
                                <button id="btn-save-product" type="submit" className="btn-green px-5 py-2.5">
                                    Guardar
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EntryForm