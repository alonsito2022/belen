"use client";
import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { IPerson} from '@/app/types';
import { toast } from "react-toastify";
import GloriaPriceForm from "@/components/purchases/gloriashipments/GloriaPriceForm"
import GloriaShipmentAddRow from "@/components/purchases/gloriashipments/GloriaShipmentAddRow"
import GloriaShipmentEditRow from "@/components/purchases/gloriashipments/GloriaShipmentEditRow"

const initialStateSelectedSupplier = {
    id: 0,
    names: "",
    priceTomorrow: 0,
    priceAfternoon: 0,
    quantityTomorrow: 0,
    quantityAfternoon: 0,
    supplierTariffId: 0,
    supplierTariffPriceTomorrow: 0,
    supplierTariffPriceAfternoon: 0,
    priceGloriaTomorrow: 0,
    priceGloriaAfternoon: 0,
    priceGloria: 0
}


function GloriaShipmentList({suppliers, suppliersWithGloriaShipments, filterObj, getGloriaShipments, fort}:any) {
    const [selectedSupplier, setSelectedSupplier] = useState<any|IPerson>(initialStateSelectedSupplier);

    const [updateState, setUpdateState] = useState(-1);

    return (
        <>

            <GloriaShipmentAddRow filterObj={filterObj}  fort={fort} getGloriaShipments={getGloriaShipments} suppliers={suppliers} />


<div className="relative overflow-x-auto h-[100vh]">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

            <thead className="text-xs text-gray-700 uppercase">
                    <tr className='  '>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-lime-500' rowSpan={2}></td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-300 text-gray-500' colSpan={3}>MAÑANA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-800 text-gray-200' colSpan={3}>TARDE</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-lime-500'></td>
                    </tr>
                    <tr className=' '>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-300 text-gray-500'>CANT.<br/>ENTREGADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-300 text-gray-500'>PRECIO<br/>LITRO</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-300 text-gray-500'>COSTO<br/>TOTAL</td>

                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-800 text-gray-200'>CANT.<br/>ENTREGADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-800 text-gray-200'>PRECIO<br/>LITRO</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-gray-800 text-gray-200'>COSTO<br/>TOTAL</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-200 bg-lime-500'></td>
                    </tr>

                </thead>
                
                <tbody>
                {suppliersWithGloriaShipments.map((item: IPerson) => 
                    updateState === item.id ? <GloriaShipmentEditRow key={item.id} item={item} setUpdateState={setUpdateState} filterObj={filterObj} fort={fort} getGloriaShipments={getGloriaShipments} />:
                    <tr key={item.id} className="border-b dark:bg-gray-800 dark:border-gray-700">
                        <th className="px-3 py-2 border border-gray-200 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.names}</th>
                        <td className="px-3 py-2 border border-gray-200 text-lg text-center">{item.quantityTomorrow}</td>
                        <td className="px-3 py-2 border border-gray-200 text-lg text-center">{item.priceGloriaTomorrow}</td>
                        <td className="px-3 py-2 border border-gray-200 text-lg text-center">{Number(item.quantityTomorrow! * item.priceGloriaTomorrow!).toFixed(2)}</td>
                        
                        <td className="px-3 py-2 border border-gray-200 text-lg text-center">{item.quantityAfternoon}</td>
                        <td className="px-3 py-2 border border-gray-200 text-lg text-center">{item.priceGloriaAfternoon}</td>
                        <td className="px-3 py-2 border border-gray-200 text-lg text-center">{Number(item.quantityAfternoon! * item.priceGloriaAfternoon!).toFixed(2)}</td>
                        <td className="px-2 py-0 border border-gray-200 text-center">
                            <button type="button" onClick={ async ()=>{
                                setUpdateState(item.id)
                                // await fetchSupplierByID(item.id);
                                }} className="w-full inline-flex justify-center text-white bg-gray-500 border border-gray-400 hover:bg-gray-800 focusblack-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm py-1.5 text-center dark:bg-gray-600 dark:hover:bg-yellow-400 dark:black:ring-gray-800">
                                EDITAR
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <td className="px-3 py-2 border border-gray-200 bg-lime-500 text-white text-base " colSpan={1}>TOTAL</td>
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-gray-300 text-gray-500 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow!), 0))}</td>
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-gray-300 text-gray-500 text-center" colSpan={1}></td>
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-gray-300 text-gray-500 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow! * currentValue.priceGloriaTomorrow!), 0)).toFixed(2)}</td>
                    
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-gray-800 text-gray-200 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon!), 0))}</td>
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-gray-800 text-gray-200 text-center" colSpan={1}></td>
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-gray-800 text-gray-200 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon! * currentValue.priceGloriaAfternoon!), 0)).toFixed(2)}</td>
                    <td className="px-3 py-2 border border-gray-200 text-lg bg-lime-500 text-center" colSpan={1}></td>
                </tr>
                </tfoot>
            </table>
            <GloriaPriceForm selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier} fort={fort} getGloriaShipments={getGloriaShipments} />
        </div>
        </>
    )
}

export default GloriaShipmentList