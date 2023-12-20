"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,MouseEvent, useEffect, useState } from "react";
import { ICheeseSupplier, IPerson, IProductTariff, ISaleCenter } from '@/app/types';
import { toast } from "react-toastify";
import { initFlowbite} from "flowbite";


function OrderForm({modal, setModal, setOutput, output, fetchOutputs, setFilterObj, filterObj, suppliers, productTariffs, tempProductTariffs, salesCenter, clients, fetchClients, obtenerFechaInicioFin, fechaInicio, fechaFin }: any) {
    

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week"){
            obtenerFechaInicioFin (value);
            setFilterObj({...filterObj, [name]: value});
        }
        if(name=="saleCenterId"){
            fetchClients(value)
            let sc = salesCenter.find((item:ISaleCenter) =>  item.id == Number(value))
            setOutput({...output, saleCenterId: value, saleCenterName: sc.name});
        }else if(name=="clientId"){
            let c = clients.find((item:IPerson) =>  item.id == Number(value))
            setOutput({...output, [name]: value, lastSubtraction: c.lastSubtraction});
        }else{
            setOutput({...output, [name]: value});
        }
        
        
    }

    const handleClickButton = async (e: MouseEvent<HTMLElement>) => {
        if (output.supplierId && output.productTariffId && output.quantity && output.price) {
            // Actualiza el estado
            let productTariff = productTariffs.find((item:IProductTariff) => {
                return item.id == Number(output.productTariffId);
            });
            let supplier = suppliers.find((item:IPerson) => {
                return item.id == Number(output.supplierId);
            })
            console.log('productTariff', productTariff)
            console.log('supplier', supplier)

            setOutput((prevOutput: any) => ({
              ...prevOutput,
              suppliers: [...prevOutput.suppliers, output.supplierId],
              supplierNames: [...prevOutput.supplierNames, supplier.name],
              productNames: [...prevOutput.productNames, productTariff.productName],
              productTariffs: [...prevOutput.productTariffs, output.productTariffId],
              quantities: [...prevOutput.quantities, output.quantity],
              prices: [...prevOutput.prices, output.price],
            }));
        
            // Reinicia los campos
            setOutput((prevOutput: any) => ({
              ...prevOutput,
              supplierId: 0,
              productTariffId: 0,
              quantity: 0,
              price: 0,
            }));
            
            
        } else {
            toast("Todos los campos son obligatorios.", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
        
    }

    const handleCheckboxChange = ({target: { name, checked} }: ChangeEvent<HTMLInputElement>) => {
        let igv, total;

        if(checked){
            igv =  output.baseCost * 0.18;
            total =  output.baseCost + igv;
        }
        else{
            igv =  0;
            total =  output.baseCost;
        }

        setOutput({...output, [name]: checked, igvCost: igv, totalSale: total});
    }
    
    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if(output.clientId && output.userId && output.productTariffs.length){
        
            let queryFetch: String = "";

            queryFetch = `
                mutation{
                    saveSale(
                        warehouseId:${filterObj.warehouseId} 
                        operationDate: "${output.operationDate}", 
                        clientId: ${output.clientId}, 
                        userId: ${output.userId}, 
                        weekValue:${Number(filterObj.week.toString().replace("-W", ""))}

                        suppliers:[${output.suppliers}],
                        productTariffs:[${output.productTariffs}],
                        quantities:[${output.quantities}],
                        prices:[${output.prices}],
                        discounts:[${output.discounts}],

                        baseCost:${output.baseCost},
                        igvCost:${output.igvCost},
                        totalSale:${output.totalSale},

                        hasIgv:${output.hasIgv},
                        observation:"${output.observation}",
                        documentType:"${output.documentType}",
                        documentNumber:"${output.documentNumber}",
                        
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
                toast(data.data.saveSale.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

                setOutput({
                    ...output, 
                    id: 0,
                    saleCenterId: 0,
                    clientId: 0,
                    supplierId: 0,
                    // userId: 0,
                    productTariffId: 0,
                    quantity: 0,
                    price: 0,
                    productName: "",
                    discount: 0,
    
                    suppliers: [],
                    productTariffs: [],
                    quantities: [],
                    prices: [],
                    discounts: [],
                    productNames: [],
                    supplierNames: [],
                    
                    baseCost: 0,
                    igvCost: 0,  
                    totalSale: 0,

                    lastSubtraction: 0,
                    totalPreviousBalance: 0,
                    totalNet: 0,
                    cash: 0,
                    deposit: 0,
                    subtraction: 0,

                    hasIgv: false,
                    observation: "",
                    documentType: "01",
                    documentNumber: "",
                });

                modal.hide();
                fetchOutputs();
                initFlowbite();

            }).catch(e=>console.log(e))
        }else{
            console.log(output)
            toast("Verifique cliente o items", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
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


    const handleRemoveItem = (indexToRemove: number) => {
        const newSuppliers = output.suppliers.filter((_: any, index: number) => index !== indexToRemove);
        const newProductTariffs = output.productTariffs.filter((_: any, index: number) => index !== indexToRemove);
        const newQuantities = output.quantities.filter((_: any, index: number) => index !== indexToRemove);
        const newPrices = output.prices.filter((_: any, index: number) => index !== indexToRemove);
        const newDiscounts = output.discounts.filter((_: any, index: number) => index !== indexToRemove);
        const newProductNames = output.productNames.filter((_: any, index: number) => index !== indexToRemove);
        const newSupplierNames = output.supplierNames.filter((_: any, index: number) => index !== indexToRemove);
      
        setOutput({
          ...output,
          suppliers: newSuppliers,
          productTariffs: newProductTariffs,
          quantities: newQuantities,
          prices: newPrices,
          discounts: newDiscounts,
          productNames: newProductNames,
          supplierNames: newSupplierNames
        });
        
    };
     
    useEffect(() => {            
        calculateTotal();
    }, [output.productTariffs, output.discounts]);

    function calculateTotal(){
        const totalDiscountedSubtotal = output?.productTariffs?.reduce((total: number, _:any, index: number) => {
            const quantity = output.quantities[index];
            const price = output.prices[index];
            const discount = output.discounts[index] || 0;
            const subtotal = quantity * price;
            const discountedSubtotal = subtotal - Number(discount);
            
            return total + discountedSubtotal;
        }, 0);

        setOutput((prevOutput: any) => ({
            ...prevOutput,
            baseCost: totalDiscountedSubtotal,
            igvCost: output.hasIgv?(totalDiscountedSubtotal * 0.18):0,
            totalSale: output.hasIgv?(totalDiscountedSubtotal + totalDiscountedSubtotal * 0.18):totalDiscountedSubtotal
        }));
    }
        
    return (
        <>
            <div id="supplierFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-4xl max-h-full">

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

                            <div className="grid gap-4 mb-4 sm:grid-cols-4">
                                    <div className="sm:col-span-2">
                                    <label htmlFor="week" className="form-label">Semana:</label>

                                            <input type="week" name="week" value={filterObj.week } onChange={handleInputChange} className="form-control" />
                                     </div>

                                     <div className="sm:col-span-2 flex justify-end items-end pb-2.5">
                                        {fechaInicio && fechaFin && (
                                            <p className=" text-2xl font-thin">{`Del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`}</p>
                                        )}
                                    </div>

                                <div>
                                    <label htmlFor="saleCenterId" className="form-label">Centro de venta:</label>
                                    <select name="saleCenterId" id="saleCenterId" onChange={handleInputChange} value={output.saleCenterId || 0} className="form-control">
                                        <option value={0}>ELEGIR</option>
                                        {salesCenter.map((o: ISaleCenter,k: number)=>(
                                            <option key={k} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>

                                </div>

                               
                                <div className="sm:col-span-2">
                                    <label htmlFor="operationDate" className="form-label">Fecha:</label>
                                    <input type="date" name="operationDate" id="operationDate" value={output.operationDate || ""} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
                                    className="form-control" required />
                                </div>


                                <fieldset className='border p-3 sm:col-span-4 grid gap-4 mb-4 sm:grid-cols-3'>
                                     <legend>DATOS DEL CLIENTE</legend>

                                     
                                     <div className="sm:col-span-2">
                                        <label htmlFor="clientId" className="form-label">Cliente:</label>
                                        <select name="clientId" id="clientId" onChange={handleInputChange} value={output.clientId} className="form-control">
                                            <option value={0}>{"ELEGIR"}</option>
                                            {clients.map((o: IPerson,k: number)=>(
                                                    <option key={k} value={o.id}>{o.names}</option>
                                            ))}
                                        </select>
                                        <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Se encontraron <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">{clients.length}</a> resultados en centro de venta {output.saleCenterName}.</p>

                                    </div>

                                    
                                    <div className="">
                                        <label htmlFor="lastSubtraction" className="form-label">Saldo anterior:</label>
                                        <input type="text" name="lastSubtraction" id="lastSubtraction" readOnly={true} value={output.lastSubtraction || ""} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
                                        className="form-control text-red-500 font-bold"   />
                                    </div>
                                </fieldset>
                                <fieldset className='border p-3 sm:col-span-4 grid gap-4 mb-4 sm:grid-cols-4 items-end'>
                                     <legend></legend>

                                     
                                     

                                     <div className="sm:col-span-4">
                                        <label htmlFor="supplierId" className="form-label">Proveedor:</label>
                                        <select name="supplierId" id="supplierId" onChange={handleInputChange} value={output.supplierId} className="form-control">
                                            <option value={0}>{"ELEGIR"}</option>
                                            {suppliers.map((o: ICheeseSupplier,k: number)=>(
                                                    <option key={k} value={o.id}>{o.name}</option>
                                                ))}
                                        </select>
                                    </div>

                                     <div>
                                        <label htmlFor="productTariffId" className="form-label">Tipo de queso:</label>
                                        <select name="productTariffId" id="productTariffId" onChange={handleInputChange} value={output.productTariffId} className="form-control">
                                        <option value={0}>{"ELEGIR"}</option>
                                            {tempProductTariffs.map((o: IProductTariff,k: number)=>(
                                                <option key={k} value={o.id}>{o.productName}</option>
                                            ))}
                                        </select>
                                    </div>
                                     <div>
                                        <label htmlFor="quantity" className="form-label">Cantidad:</label>
                                        <input type="text" name="quantity" id="quantity" value={output.quantity || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
                                        className="form-control"   />
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="form-label">Precio de venta:</label>
                                        <input type="text" name="price" id="price" value={output.price || ''} onChange={handleInputChange} onFocus={(e) => e.target.select()} 
                                        className="form-control"   />
                                    </div>

                                    <div>
                                        <button type="button" className="btn-lime w-full px-5 py-3 border" onClick={handleClickButton}>
                                            AGREGAR ITEM
                                        </button>
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
                                    
                                    {output?.productTariffs?.map((o: IProductTariff,index: number)=>{
                                        const supplierName = output.supplierNames[index];
                                        const productName = output.productNames[index];
                                        const quantity = output.quantities[index];
                                        const price = output.prices[index];
                                        const subtotal = quantity * price;
                                        const discount = output.discounts[index] || "";
                                        const discountedSubtotal = subtotal - Number(discount);

                                        return (
                                            <tr key={index}>
                                                <td className='px-2 py-2 border font-bold uppercase text-xs'>{supplierName}</td>
                                                <td className='px-2 py-2 border font-bold uppercase'>{productName}</td>
                                                <td className='px-2 py-2 border text-center'>{quantity}</td>
                                                <td className='px-2 py-2 border text-right'>S/ {price}</td>
                                                <td className='px-2 py-2 border text-right'>S/ {subtotal}</td>
                                                <td className='px-2 py-2 border'>
                                                    <input
                                                        type="number"
                                                        value={discount}
                                                        className="form-control text-right text-red-500"
                                                        onFocus={(e) => e.target.select()}
                                                        onChange={(e) => {
                                                            const newDiscount = parseFloat(e.target.value);
                                                            const newDiscounts = [...output.discounts];
                                                            newDiscounts[index] = newDiscount;
                                                            setOutput({ ...output, discounts: newDiscounts });
                                                            
                                                        }}
                                                    />
                                                </td>
                                                <td className='px-2 py-2 border text-right'>S/ {discountedSubtotal.toFixed(2)}</td>
                                                <td className='px-2 py-2 border text-center'>
                                                    <button onClick={() => handleRemoveItem(index)} className='btn-light px-2 py-2 border'>
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
                                                <select name='documentType' className=' form-control col-span-1' value={output.documentType} onChange={handleInputChange}>
                                                    <option value={'01'}>TICKET</option>
                                                    <option value={'02'}>BOLETA</option>
                                                    <option value={'03'}>FACTURA</option>
                                                </select>
                                                <input 
                                                    type='text' 
                                                    name='documentNumber'
                                                    className='form-control  col-span-2' 
                                                    maxLength={20}
                                                    value={output.documentNumber} 
                                                    onChange={handleInputChange} 
                                                    placeholder='E001-01'
                                                    onFocus={(e) => e.target.select()}
                                                />
                                            </div>
                                        </td>
                                        <td className='px-2 py-2 border text-base uppercase font-medium text-right' colSpan={2}>BASE IMPONIBLE</td>
                                        <td className='px-2 py-2 border text-base font-medium text-right'>S/ {Number(output.baseCost).toFixed(2)}</td>
                                        <td className='px-2 py-2 border text-base'></td>
                                    </tr>

                                    <tr>
                                        <td className='px-2 py-2 border text-base  text-right font-thin' colSpan={4} rowSpan={2}>

                                            
                                            <textarea 
                                                    name='observation' 
                                                    rows={4} 
                                                    className='form-control' 
                                                    maxLength={400} 
                                                    onChange={handleInputChange} 
                                                    value={output.observation || ""}
                                                    placeholder='Escribe un comentario aquí' 
                                            ></textarea>

                                        </td>
                                        <td className='px-2 py-2 border text-base uppercase font-medium text-right' colSpan={2}>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    value="" 
                                                    name='hasIgv'
                                                    className="sr-only peer" 
                                                    checked={output.hasIgv} 
                                                    onChange={handleCheckboxChange}
                                                    />
                                                <div className="default-toggle peer "></div>
                                                <span className="ms-3">{output.hasIgv?"IGV 18%":"SIN IGV"}</span>
                                            </label>
                                        </td>
                                        <td className='px-2 py-2 border text-base font-medium text-right'>S/ {Number(output.igvCost).toFixed(2)}</td>
                                        <td className='px-2 py-2 border text-base'></td>
                                    </tr>
                                    <tr>
                                        
                                        <td className='px-2 py-2 border text-base uppercase font-medium text-right' colSpan={2}>TOTAL</td>
                                        <td className='px-2 py-2 border text-base font-medium text-right'>S/ {Number(output.totalSale).toFixed(2)}</td>
                                        <td className='px-2 py-2 border text-base'></td>
                                    </tr>

                                </tfoot>
                            </table>

                            <div className=" text-right">
                                <button id="btn-save-product" type="submit" className=" btn-green w-full px-5 py-2.5 border">
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

export default OrderForm