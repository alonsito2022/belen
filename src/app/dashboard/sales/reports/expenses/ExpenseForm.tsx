"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { ICheeseSupplier, IPerson, IProductTariff, ISupplierTariff, IUser } from '@/app/types';
import { toast } from "react-toastify";

function ExpenseForm({modal, setModal, setExpense, expense, fetchExpensesByWeek, filterObj}: any) {


    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let queryFetch: String = "";

            queryFetch = `
                mutation{
                    createExpense(
                        userId: ${expense.userId}, 
                        weekValue:${Number(filterObj.week.toString().replace("-W", ""))},
                        description: "${expense.description}",
                        total: ${expense.total}, 
                        transactionDate: "${expense.transactionDate}",
                        transactionType: "${expense.transactionType}"
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
                toast(data.data.createExpense.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setExpense({
                    ...expense, 
                    id: 0,
                    description: "",
                    total: 0,
                });
                modal.hide();
                fetchExpensesByWeek();

            }).catch(e=>console.log(e))
        

    };

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setExpense({...expense, [name]: value});
    }

    useEffect(() => {
        
        if(modal == null){
            const $targetEl = document.getElementById('expenseFormModal');
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
            <div id="expenseFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
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
                                        id="transactionDate" value={expense.transactionDate || ""} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="form-label">Razon:</label>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        rows={4} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        required 
                                        placeholder="Escribe tus pensamientos aquí..."
                                    ></textarea>

                                </div>
                                
                                
                                <div>
                                    <label htmlFor="total" className="form-label">Total egreso:</label>
                                    <input type="text" name="total" id="total" value={expense.total || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
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

export default ExpenseForm