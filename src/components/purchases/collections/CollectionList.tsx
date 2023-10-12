import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { IPerson} from '@/app/types';
import CollectionListEditRow from "@/components/purchases/collections/CollectionListEditRow"

function CollectionList({suppliers, summaryDailyEntries, fort, filterObj, getSuppliersWithDailyEntries}: any) {

    const [updateState, setUpdateState] = useState(-1);

    return (
    <>
        <div className="relative overflow-x-auto mx-auto max-w-5xl p-4 bg-white">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    CUADRO REGISTRO DIARIO
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                    <tr>
                        <th className="px-4 py-4 border bg-gray-100" rowSpan={2}>ID</th>
                        <th className="px-4 py-4 border bg-gray-100" rowSpan={2}>NOMBRES</th>
                        <th className="px-1 border-0"></th>
                        <th className="px-4 py-4 border text-center text-white bg-lime-500" colSpan={3}>MAÑANA</th>
                        <th className="px-1 border-0"></th>
                        <th className="px-4 py-4 border text-center text-white bg-black" colSpan={3}>TARDE DIA ANTERIOR</th>
                        <th className="px-4 py-4 border bg-gray-100" rowSpan={2}></th>
                    </tr>
                    <tr>
                        <th className="border-0"></th>
                        <th className="px-4 py-4 border text-center text-white bg-lime-500">LITROS</th>
                        <th className="px-4 py-4 border text-center text-white bg-lime-500">COSTO POR<br/>LITRO</th>
                        <th className="px-4 py-4 border text-center text-white bg-lime-500">COSTO TOTAL</th>
                        <th className="border-0"></th>
                        <th className="px-4 py-4 border text-center text-white bg-black">LITROS</th>
                        <th className="px-4 py-4 border text-center text-white bg-black">COSTO POR<br/>LITRO</th>
                        <th className="px-4 py-4 border text-center text-white bg-black">COSTO TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                {suppliers.map((item: IPerson) => 
                    updateState === item.id ? <CollectionListEditRow key={item.id} item={item} setUpdateState={setUpdateState} filterObj={filterObj} fort={fort} getSuppliersWithDailyEntries={getSuppliersWithDailyEntries} />:

                    <tr key={item.id} className="bg-white dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-0 border text-base uppercase">{item.id}</td>
                        <td className="px-4 py-0 border text-base uppercase">{item.names}</td>
                        <td className="border-0"></td>
                        <td className="px-4 py-0 border bg-gray-50 text-lg uppercase text-right">{item.quantityTomorrow}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(item.priceTomorrow).toFixed(2)}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.quantityTomorrow!*item.priceTomorrow!)* 100) / 100).toFixed(2)}</td>
                        <td className="border-0"></td>
                        <td className="px-4 py-0 border bg-gray-50 text-lg uppercase text-right">{item.quantityAfternoon}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(item.priceAfternoon).toFixed(2)}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.quantityAfternoon!*item.priceAfternoon!)* 100) / 100).toFixed(2)}</td>
                        <td className="px-4 py-0 border border-gray-200 text-center">
                            <button type="button" onClick={ async ()=>{
                                setUpdateState(item.id)
                                // await fetchSupplierByID(item.id);
                                }} className="text-white font-medium rounded-lg text-sm">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                                    <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <td className="px-6 py-3 border text-base bg-gray-100" colSpan={2}>TOTAL</td>
                    <td className="border-0"></td>

                    <td className="px-4 py-3 border text-white bg-lime-500 text-right text-lg">{summaryDailyEntries.quantityTotalTomorrow}</td>
                    <td className="px-4 py-3 border text-white bg-lime-500 text-right text-lg" colSpan={1}></td>
                    <td className="px-4 py-3 border text-white bg-lime-500 text-right text-lg">S/ {summaryDailyEntries.costTotalTomorrow}</td>
                    <td className="border-0"></td>
                    <td className="px-4 py-3 border text-white bg-black text-right text-lg" colSpan={1}>{summaryDailyEntries.quantityTotalAfternoon}</td>
                    <td className="px-4 py-3 border text-white bg-black text-right text-lg" colSpan={1}></td>
                    <td className="px-4 py-3 border text-white bg-black text-right text-lg">S/ {summaryDailyEntries.costTotalAfternoon}</td>
                    <td className="px-6 py-3 border text-base bg-gray-100"></td>
                    
                </tr>
                
                </tfoot>
            </table>
        </div>
    </>
    )
}

export default CollectionList