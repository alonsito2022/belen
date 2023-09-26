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

            <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
                    <tr className='  '>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-50' rowSpan={2}></td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-200 text-black' colSpan={3}>MAÑANA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-300 text-black' colSpan={3}>TARDE</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-50'></td>
                    </tr>
                    <tr className=' '>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-200 text-black'>CANT.<br/>ENTREGADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-200 text-black'>PRECIO<br/>LITRO</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-200 text-black'>COSTO<br/>TOTAL</td>

                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-300 text-black'>CANT.<br/>ENTREGADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-300 text-black'>PRECIO<br/>LITRO</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-300 text-black'>COSTO<br/>TOTAL</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-green-50'></td>
                    </tr>

                </thead>
                
                <tbody>
                {suppliersWithGloriaShipments.map((item: IPerson) => 
                    updateState === item.id ? <GloriaShipmentEditRow key={item.id} item={item} setUpdateState={setUpdateState} filterObj={filterObj} fort={fort} getGloriaShipments={getGloriaShipments} />:
                    <tr key={item.id} className="border-b dark:bg-gray-800 dark:border-gray-700">
                        <th className="px-3 py-3 border border-gray-400 bg-green-50 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.names}</th>
                        <td className="px-3 py-3 border border-gray-400 bg-green-200 text-center text-green-800">{item.quantityTomorrow}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-green-200 text-center text-green-500">{item.priceTomorrow}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-green-200 text-center text-green-500">{Number(item.quantityTomorrow! * item.priceTomorrow!).toFixed(2)}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-green-300 text-center text-green-800">{item.quantityAfternoon}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-green-300 text-center text-green-500">{item.priceAfternoon}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-green-300 text-center text-green-500">{Number(item.quantityAfternoon! * item.priceAfternoon!).toFixed(2)}</td>
                        <td className="px-3 py-0 border border-gray-400 bg-green-50 text-center text-green-800">
                            <button type="button" onClick={ async ()=>{
                                setUpdateState(item.id)
                                // await fetchSupplierByID(item.id);
                                }} className="w-full inline-flex justify-center text-white bg-green-900 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                Editar
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <td className="px-3 py-3 border border-gray-400 bg-green-50 text-base " colSpan={1}>TOTAL</td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-200 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-200 text-center" colSpan={1}></td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-200 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow! * currentValue.priceTomorrow!), 0)).toFixed(2)}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-300 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-300 text-center" colSpan={1}></td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-300 text-center">{Number(suppliersWithGloriaShipments.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon! * currentValue.priceAfternoon!), 0)).toFixed(2)}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-green-50 text-center" colSpan={1}></td>
                </tr>
                </tfoot>
            </table>
            <GloriaPriceForm selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier} fort={fort} getGloriaShipments={getGloriaShipments} />
        </div>
        </>
    )
}

export default GloriaShipmentList