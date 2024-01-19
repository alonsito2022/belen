"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,MouseEvent, useEffect, useState } from "react";
import { IOperationDetail, ICashFlow } from '@/app/types';
import { toast } from "react-toastify";

function PaymentForm({modalPayment, setModalPayment, paymentObj, setPaymentObj, fetchOutputs, startDateOfWeek, endDateOfWeek, getWeekDatesOfStartEnd }: any) {

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week"){
            getWeekDatesOfStartEnd (value);
            setPaymentObj({...paymentObj, [name]: value});
        }
        else
            setPaymentObj({...paymentObj, [name]: value});

    }

    const handleSavePayment = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if(paymentObj.userId && paymentObj.description.length){
        
            let queryFetch: String = "";

            queryFetch = `
                mutation{
                    savePayment(
                        userId: ${paymentObj.userId}, 
                        operationId: ${paymentObj.operationId}, 
                        transactionDate: "${paymentObj.transactionDate}", 
                        transactionType:"${paymentObj.transactionType}",
                        description:"${paymentObj.description}",
                        total:${paymentObj.total},
                        
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
                toast(data.data.savePayment.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

                setPaymentObj({
                    ...paymentObj, 
                    operationId: 0,
                    transactionType: "E",
                    description: "PAGO DE LA VENTA",
                    total: 0
                });

                modalPayment.hide();
                fetchOutputs();

            }).catch(e=>console.log(e))
        }else{
            
            toast("Verifique usuario o items", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
    };

    useEffect(() => {
        
        if(modalPayment == null){
            const $targetEl = document.getElementById('paymentFormModal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,

            };
        
            setModalPayment(new Modal($targetEl, options))
        }
       

    }, []);
    
    return (
        <>
        <div id="paymentFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-xl max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Pagos de venta realizada
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                             onClick={()=>{modalPayment.hide();}}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSavePayment}>

                            <div className="grid gap-4 mb-4 sm:grid-cols-2">

                                {/* <div className="sm:col-span-2">
                                    <label htmlFor="week" className="form-label">Semana:</label>

                                    <input type="week" name="week" value={paymentObj.week } onChange={handleInputChange} className="form-control" />
                                    {startDateOfWeek && endDateOfWeek && (
                                        <p id="helper-text" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            {`Del ${startDateOfWeek.toLocaleDateString()} al ${endDateOfWeek.toLocaleDateString()}`}
                                        </p>
                                    )}

                                </div> */}

                                <div className="sm:col-span-2">
                                    <label htmlFor="transactionDate" className="form-label">Fecha:</label>
                                    <input type="date" id="transactionDate" name='transactionDate' value={paymentObj.transactionDate} onChange={handleInputChange} className="form-control" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="transactionType" className="form-label">Tipo de egreso:</label>
                                        <select id="transactionType" name='transactionType' className=' form-control col-span-1' value={paymentObj.transactionType} onChange={handleInputChange}>
                                            <option value={'E'}>EFECTIVO</option>
                                            <option value={'D'}>DEPOSITO</option>
                                        </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="description3" className="form-label">Descripcion:</label>
                                    <textarea 
                                            id='description3' 
                                            name='description' 
                                            rows={4} 
                                            className='form-control' 
                                            maxLength={400} 
                                            onChange={handleInputChange} 
                                            value={paymentObj.description || ""}
                                            placeholder='Escribe un comentario aquí' 
                                    ></textarea>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="debt3" className="form-label">Debe:</label>
                                    <input type="number" id="debt3" name="debt" value={paymentObj.debt} onChange={handleInputChange} readOnly className="form-control text-red-500" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="total3" className="form-label">Total a pagar:</label>
                                    <input type="number" id="total3" name="total" value={paymentObj.total}  onChange={handleInputChange} onFocus={(e) => e.target.select()} className="form-control" />
                                </div>

                            </div>
                                

     
     
                                <div className=" text-right">
                                    <button id="btn-save-payment" type="submit" className=" btn-green w-full px-5 py-2.5 border">
                                        Guardar Pago
                                    </button>
                                </div>
                            
                        </form>
                    </div>
                    

                </div>
            </div>
        </>
    )
}

export default PaymentForm