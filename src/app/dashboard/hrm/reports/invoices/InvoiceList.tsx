"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IEntry, IOperation } from '@/app/types';
import { toast } from "react-toastify";

const initialStateSalesSummary = {
    salesSummaryBase: 0,
    salesSummaryIgv: 0,
    salesSummaryTotal: 0
}


function InvoiceList({invoices, setFilterObj, filterObj, modalReview, getOutputById}:any) {
    const [salesSummary, setSalesSummary] = useState(initialStateSalesSummary);

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }
    
    useEffect(() => {
        const sumValues = invoices.reduce((acc: IEntry, sale: IEntry) => {
            acc.baseCost! += Number(sale.baseCost) || 0;
            acc.igvCost! += Number(sale.igvCost) || 0;
            acc.totalSale! += Number(sale.totalSale) || 0;
            return acc;
        }, { baseCost: 0, igvCost: 0, totalSale: 0 });

        setSalesSummary({...salesSummary, 
            salesSummaryBase: sumValues.baseCost!,
            salesSummaryIgv: sumValues.igvCost!,
            salesSummaryTotal: sumValues.totalSale!
        });
    }, [invoices]);

    return (
        <>
        <div className="relative overflow-x-auto mt-2">

            <div className="flex items-center justify-end bg-gray-100 p-2 border gap-2 border-gray-200">

                    <div className="">
                        <input 
                            type="date" 
                            name="startDate" 
                            value={filterObj.startDate} 
                            onChange={handleInputChangeWeek} 
                            onFocus={(e) => e.target.select()} 
                            className="form-control"
                        />
                    </div>

                    <div className="">
                        <input 
                            type="date" 
                            name="endDate" 
                            value={filterObj.endDate} 
                            onChange={handleInputChangeWeek} 
                            onFocus={(e) => e.target.select()} 
                            className="form-control"
                        />
                    </div>

            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-3">
                    <caption>LISTA DE FACTURAS</caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="text-center font-bold">
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300" colSpan={9}>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600" rowSpan={2}>ACCIONES</td>
                        </tr>
                        <tr>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">FECHA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">TIPO<br/>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">CENTRO DE<br/>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">CLIENTE</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">TIP DOC</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">NUM DOC</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">BASE</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">IGV</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">TOTAL VENTA</td>

                            
                            
                        </tr>
                    </thead>
                    <tbody>
                    {invoices.map((item: IOperation) => 
                         <tr key={item.id}>

                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.formattedDate?.toString().replace("Dec", "Dic").replace("Jan", "Ene")}</td>
                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.isFictitious?"NORMAL":"FICTICIA"}</td>
                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.client?.saleCenter?.name}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.client?.names}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.documentTypeReadable}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.documentNumber}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold">S/ {item.baseCost}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold">S/ {item.igvCost}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold">S/ {item.totalSale}</td>
                            <td className="px-2 py-2 border border-gray-600">
                                
                            <button 
                                            type="button" 
                                            className="btn-blue px-2 pt-1"
                                            onClick={()=>{
                                                modalReview.show();
                                                getOutputById(item.id);
                                            }}
                                        >Ver Detalles</button>
                            </td>
                         </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-300 font-semibold text-lg" colSpan={6}>TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 font-bold text-base text-right whitespace-nowrap">S/ {Number(salesSummary.salesSummaryBase).toFixed(2)}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 font-bold text-base text-right whitespace-nowrap">S/ {Number(salesSummary.salesSummaryIgv).toFixed(2)}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 font-bold text-base text-right whitespace-nowrap">S/ {Number(salesSummary.salesSummaryTotal).toFixed(2)}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 font-bold text-base text-center"></td>
                        </tr>
                    </tfoot>
                </table>
        </div>
            
        </>
    )
}

export default InvoiceList