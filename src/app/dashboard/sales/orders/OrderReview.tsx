"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,MouseEvent, useEffect, useState } from "react";
import { IOperationDetail } from '@/app/types';


function OrderReview({modalReview, setModalReview, outputFound }: any) {
    
    useEffect(() => {
        
        if(modalReview == null){
            const $targetEl = document.getElementById('entryFormModalReview');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,

            };
        
            setModalReview(new Modal($targetEl, options))
        }
       

    }, []);
    
    return (

        <>
            <div id="entryFormModalReview" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-4xl max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Editar proveedor
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                             onClick={()=>{modalReview.hide();}}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form>

                            <div className="grid gap-4 mb-4 sm:grid-cols-4">

                                <div>
                                    <label htmlFor="saleCenterId2" className="form-label">Centro de venta:</label>
                                    <input type="text" id="saleCenterId2" value={outputFound.client?.saleCenter?.name} className="form-control" readOnly />


                                </div>

                               
                                <div className="sm:col-span-2">
                                    <label htmlFor="operationDate2" className="form-label">Fecha:</label>
                                    <input type="date" id="operationDate2" value={outputFound.operationDate} className="form-control" readOnly />
                                </div>


                                <fieldset className='border p-3 sm:col-span-4 grid gap-4 mb-4 sm:grid-cols-3'>
                                     <legend>DATOS DEL CLIENTE</legend>

                                     
                                     <div className="sm:col-span-2">
                                        <label htmlFor="clientId2" className="form-label">Cliente:</label>
                                        <input type="text" id="clientId2" value={outputFound.client?.names} className="form-control" readOnly />

                                    </div>

                                    
                                    <div className="">
                                        <label htmlFor="previousBalance2" className="form-label">Saldo anterior:</label>
                                        <input type="text" id="previousBalance2" value={outputFound.previousBalance} className="form-control" readOnly />
                                    </div>
                                </fieldset>
                            </div>
                                

                            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-3'>
                                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                    <tr>
                                        <td className='px-2 py-3 text-center border'>PROVEEDOR</td>
                                        <td className='px-2 py-3 text-center border'>PRODUCTO</td>
                                        <td className='px-2 py-3 text-center border w-24'>CANTIDAD</td>
                                        <td className='px-2 py-3 text-center border w-24'>PRECIO</td>
                                        <td className='px-2 py-3 text-center border'>MONTO</td>
                                        <td className='px-2 py-3 text-center border w-24'>DESCUENTO</td>
                                        <td className='px-2 py-3 text-center border w-36'>TOTAL</td>
                                        <td className='px-2 py-3 text-center border w-20'>ACCIONES</td>
                                    </tr>
                                    
                                </thead>
                                <tbody>
                                    
                                    {outputFound?.operationdetailSet?.map((o: IOperationDetail,index: number)=>{
                                        const supplierName = o.supplier?.names;
                                        const productName = o.productTariff?.productName;
                                        const quantity = Number(o.quantity);
                                        const price = Number(o.price);
                                        const subtotal = quantity * price;
                                        const discount = Number(o.discount);
                                        const discountedSubtotal = subtotal - Number(discount);

                                        
                                        return (
                                            <tr key={index}>
                                                <td className='px-2 py-2 border font-bold uppercase text-xs'>{supplierName}</td>
                                                <td className='px-2 py-2 border font-bold uppercase'>{productName}</td>
                                                <td className='px-2 py-2 border text-center'>{quantity}</td>
                                                <td className='px-2 py-2 border text-right'>S/ {price}</td>
                                                <td className='px-2 py-2 border text-right'>S/ {subtotal}</td>
                                                <td className='px-2 py-2 border text-right'>S/ {discount.toFixed(2)}</td>
                                                <td className='px-2 py-2 border text-right'>S/ {discountedSubtotal.toFixed(2)}</td>
                                                <td className='px-2 py-2 border text-center'>
                                                    <button className='btn-light px-2 py-2 border' disabled>
                                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                    </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    
                                </tbody>
                                <tfoot>
                                    
                                    <tr>
                                        <td className='px-2 py-2 border text-lg text-right font-thin' colSpan={4}>
                                            
                                            <div className='grid grid-cols-3 gap-4'>

                                                <input type="text" value={outputFound.documentTypeReadable} className="form-control" readOnly />
                                                <input type="text" value={outputFound.documentNumber} className="form-control" readOnly />

                                            </div>
                                        </td>
                                        <td className='px-2 py-2 border text-base uppercase font-medium text-right' colSpan={2}>BASE IMPONIBLE</td>
                                        <td className='px-2 py-2 border text-base font-medium text-right'>S/ {outputFound.baseCost || ""}</td>
                                        <td className='px-2 py-2 border text-base'></td>
                                    </tr>

                                    <tr>
                                        <td className='px-2 py-2 border text-base  text-right font-thin' colSpan={4} rowSpan={2}>
                                            <textarea 
                                                    rows={4} 
                                                    className='form-control' 
                                                    value={outputFound.observation || ""}
                                                    readOnly
                                            ></textarea>

                                        </td>
                                        <td className='px-2 py-2 border text-base uppercase font-medium text-right' colSpan={2}>IGV</td>
                                        <td className='px-2 py-2 border text-base font-medium text-right'>S/ {outputFound.igvCost || ""}</td>
                                        <td className='px-2 py-2 border text-base'></td>
                                    </tr>
                                    <tr>
                                        
                                        <td className='px-2 py-2 border text-base uppercase font-medium text-right' colSpan={2}>TOTAL</td>
                                        <td className='px-2 py-2 border text-base font-medium text-right'>S/ {outputFound.totalSale || ""}</td>
                                        <td className='px-2 py-2 border text-base'></td>
                                    </tr>

                                </tfoot>
                            </table>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderReview