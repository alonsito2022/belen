"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { ICategory, IElement, IPerson, IProductTariff, ISubcategory, ISubsidiary, IUser } from '@/app/types';
import { toast } from "react-toastify";

function PettyCashControlForm({ modal, setModal, setCashFlow, cashFlow, cashFlowCurrent, fetchCashFlows, filterObj, subsidiaries, fetchCashFlowPreviousBalance, fetchCashFlowCurrentBalance}: any) {

    const [categories, setCategories] = useState< ICategory[]>([]);
    const [subcategories, setSubcategories] = useState< ISubcategory[]>([]);
    const [elements, setElements] = useState< IElement[]>([]);

    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let queryFetch: String = "";

            queryFetch = `
                mutation{
                    createCashFlow(
                        userId: ${cashFlow.userId}, 
                        description: "${cashFlow.description}",
                        total: ${cashFlow.total}, 
                        transactionDate: "${cashFlow.transactionDate}",
                        transactionType: "${cashFlow.transactionType}",
                        subsidiaryId: ${cashFlow.subsidiaryId},
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
                toast(data.data.createCashFlow.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setCashFlow({
                    ...cashFlow, 
                    id: 0,
                    name: "",
                    total: 0,
                });
                modal.hide();
                fetchCashFlows();
                fetchCashFlowPreviousBalance();
                fetchCashFlowCurrentBalance();

            }).catch(e=>console.log(e))
        

    };

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {

        // setExpense({...expense, [name]: value});


        if(name=="subsidiaryId"){
            // fetchCategoriesBySubsidiary(Number(value))
            setCashFlow({...cashFlow, subsidiaryId: value, name: "",});
        }
        else if(name=="transactionType"){
            // fetchSubcategoriesByCategory(Number(value))
            setCashFlow({...cashFlow, transactionType: value, name: "",});
        }
        else if(name=="transactionDate"){
            // fetchElementsBySubcategory(Number(value))
            setCashFlow({...cashFlow, transactionDate: value, name: ""});
        }
        else if(name=="description"){
            setCashFlow({...cashFlow, description: value});
        }
        else if(name=="total"){
            setCashFlow({...cashFlow, total: value});
        }
        else{
            setCashFlow({...cashFlow, [name]: value});
        }
        
    }

    

    async function fetchCategoriesBySubsidiary(id: number){
        let queryfecth = `
            query {
                categoriesBySubsidiaryId(subsidiaryId:${id}) {
                    id
                    name
                    subsidiary {
                        id
                        name
                    }
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
            setCategories(data.data.categoriesBySubsidiaryId);
        })
        
    }

    async function fetchSubcategoriesByCategory(id: number){
        let queryfecth = `
            query {
                subcategoriesByCategoryId(categoryId:${id}) {
                    id
                    name
                    category {
                        id
                        name
                    }
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
            setSubcategories(data.data.subcategoriesByCategoryId);
        })
        
    }

    async function fetchElementsBySubcategory(id: number){
        let queryfecth = `
            query {
                cashFlowsByDescription(cashId:${id}) {
                    id
                    name
                    subcategory {
                        id
                        name
                    }
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
            setElements(data.data.elementsBySubcategoryId);
        })
        
    }

    
    useEffect(() => {
        
        if(modal == null){
            
            // fetchCategoriesBySubsidiary(cashFlow.subsidiaryId)
            const $targetEl = document.getElementById('cashFormModal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,
            };
        
            setModal(new Modal($targetEl, options))
        }

    }, []);

    useEffect(()=>{

        // fetchCashFlowPreviousBalance()
    }, [])


    return (
        <>
            <div id="cashFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
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
                                    <label htmlFor="transactionDate" className="form-label">Fecha:</label>
                                    <input type="date" 
                                        name="transactionDate" 
                                        id="transactionDate" value={cashFlow.transactionDate || ""} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subsidiaryId6" className="form-label">Sede:</label>
                                    <select name="subsidiaryId" id="subsidiaryId6" onChange={handleInputChange} value={cashFlow.subsidiaryId} className="form-control">
                                        <option value={0}>{"ELEGIR"}</option>
                                        {subsidiaries.map((o: ISubsidiary,k: number)=>(
                                                <option key={k} value={o.id}>{o.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="transactionType3" className="form-label">Tipo:</label>
                                    <select name="transactionType" id="transactionType3" onChange={handleInputChange} value={cashFlow.transactionType} className="form-control">
                                        <option value={"E"}>{"ENTRADA"}</option>
                                        <option value={"S"}>{"SALIDA"}</option>
                                    </select>
                                </div>
          
                                {/* <div>
                                    <label htmlFor="description" className="form-label">Razon:</label>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        rows={4} 
                                        onChange={handleInputChange} 
                                        value={expense.name}
                                        className="form-control uppercase" 
                                        required 
                                        maxLength={100}
                                        placeholder="Escribe una descripcion aquí..."
                                    ></textarea>

                                </div> */}

                                <div>
                                    <label htmlFor="description3" className="form-label">Razon:</label>
                                    <input
                                        type="text"
                                        value={cashFlow.description || ''}
                                        onChange={handleInputChange}
                                        // list="listOfElements"
                                        name="description"
                                        id="description3"
                                        className='form-control uppercase'
                                        placeholder="Escribe una razon"
                                        // autoComplete='off'
                                    />

                                    {/* <datalist id="listOfElements">
                                        {elements.map((c: IElement, index: number) => (
                                            <option key={index} value={c.name} />
                                        ))}
                                    </datalist> */}

                                    
                                </div>
                                
                                
                                <div>
                                    <label htmlFor="balance" className="form-label">Saldo actual:</label>
                                    <input type="text" name="balance" id="balance" value={Number(cashFlowCurrent.remainingTotal || '').toFixed(2)} readOnly
                                    className="form-control"   />
                                </div>
                                
                                
                                <div>
                                    <label htmlFor="total" className="form-label">Total egreso:</label>
                                    <input type="text" 
                                    name="total" id="total" 
                                    value={cashFlow.total || ''} 
                                    onChange={handleInputChange} 
                                    onFocus={(e) => e.target.select()} 
                                    autoComplete='off'
                                    className="form-control"   />
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

export default PettyCashControlForm