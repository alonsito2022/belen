"use client";
import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { IPerson} from '@/app/types';
import { toast } from "react-toastify";
import DailyEntryListAddRow from "@/components/purchases/dailyentries/DailyEntryListAddRow"
import DailyEntryListEditRow from "@/components/purchases/dailyentries/DailyEntryListEditRow"



function DailyEntryList({suppliers, suppliersWithDailyEntries, filterObj, fetchDailyEntries, fort}:any) {

    const [updateState, setUpdateState] = useState(-1);

    return (
    <>

        <DailyEntryListAddRow filterObj={filterObj}  fort={fort} fetchDailyEntries={fetchDailyEntries} suppliers={suppliers} />

        <div className="relative overflow-x-auto h-[100vh]">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
                    <tr className='  '>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400' rowSpan={2}></td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-200 text-black' colSpan={3}>MAÑANA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-300 text-black' colSpan={3}>TARDE</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400'></td>
                    </tr>
                    <tr className=' '>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-200 text-black'>CANT.<br/>ENTREGADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-200 text-black'>CANT.<br/>OBSERVADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-200 text-black'>CANT.<br/>APROBADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-300 text-black'>CANT.<br/>ENTREGADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-300 text-black'>CANT.<br/>OBSERVADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400 bg-gray-300 text-black'>CANT.<br/>APROBADA</td>
                        <td className='px-3 py-3 font-normal text-sm text-center border border-gray-400'></td>
                    </tr>
                </thead>

                <tbody>
                {suppliersWithDailyEntries.map((item: IPerson) => 
                updateState === item.id ? <DailyEntryListEditRow key={item.id} item={item} setUpdateState={setUpdateState} filterObj={filterObj} fort={fort} fetchDailyEntries={fetchDailyEntries} />:
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-3 py-3 border border-gray-400 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.names}</th>
                        <td className="px-3 py-3 border border-gray-400 bg-gray-200 text-center text-blue-500">{item.quantityDeliveredTomorrow}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-gray-200 text-center text-red-500">{item.quantityToReturnTomorrow} {item.returnStatusTomorrow==="02"?"(GLORIA)":item.returnStatusTomorrow==="01"?"(DEVOLUCION)":""}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-gray-200 text-center text-green-500">{item.quantityTomorrow}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-gray-300 text-center text-blue-500">{item.quantityDeliveredAfternoon}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-gray-300 text-center text-red-500">{item.quantityToReturnAfternoon} {item.returnStatusAfternoon==="02"?"(GLORIA)":item.returnStatusAfternoon==="01"?"(DEVOLUCION)":""}</td>
                        <td className="px-3 py-3 border border-gray-400 bg-gray-300 text-center text-green-500">{item.quantityAfternoon}</td>
                        <td className="px-1 py-0 border border-gray-400">
                        <button type="button" onClick={ async ()=>{setUpdateState(item.id)}} 
                            className="w-full inline-flex justify-center text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            EDITAR
                        </button>
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <td className="px-3 py-3 border border-gray-400 text-base " colSpan={1}>TOTAL</td>
                    <td className="px-3 py-3 border border-gray-400 bg-gray-200 text-center">{Number(suppliersWithDailyEntries.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityDeliveredTomorrow!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-gray-200 text-center">{Number(suppliersWithDailyEntries.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityToReturnTomorrow!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-gray-200 text-center">{Number(suppliersWithDailyEntries.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityTomorrow!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-gray-300 text-center">{Number(suppliersWithDailyEntries.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityDeliveredAfternoon!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-gray-300 text-center">{Number(suppliersWithDailyEntries.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityToReturnAfternoon!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 bg-gray-300 text-center">{Number(suppliersWithDailyEntries.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.quantityAfternoon!), 0))}</td>
                    <td className="px-3 py-3 border border-gray-400 text-center" colSpan={1}></td>
                </tr>
                </tfoot>
            </table>
        </div>


    </>

    )
}

export default DailyEntryList