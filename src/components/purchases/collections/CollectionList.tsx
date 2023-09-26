import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';
import { ChangeEvent, MouseEvent ,useState, useEffect } from "react";
import { toast } from "react-toastify";

function CollectionList({suppliers, summaryDailyEntries}: any) {


    return (
    <>
        <div className="relative overflow-x-auto mx-auto max-w-5xl p-4 bg-white">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    CUADRO REGISTRO DIARIO
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-4 border">ID</th>
                        <th scope="col" className="px-4 py-4 border">NOMBRES</th>
                        <th scope="col" className="px-4 py-4 border text-center bg-gray-50">LITROS<br/>MAÑANA</th>
                        <th scope="col" className="px-4 py-4 border text-center">COSTO POR<br/>LITRO<br/>MAÑANA</th>
                        <th scope="col" className="px-4 py-4 border text-center">COSTO TOTAL<br/>MAÑANA</th>
                        <th scope="col" className="px-4 py-4 border text-center bg-gray-50">LITROS<br/>TARDE</th>
                        <th scope="col" className="px-4 py-4 border text-center">COSTO POR<br/>LITRO<br/>TARDE</th>
                        <th scope="col" className="px-4 py-4 border text-center">COSTO TOTAL<br/>TARDE</th>
                    </tr>
                </thead>
                <tbody>
                {suppliers.map((item: IPerson) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-0 border text-base uppercase">{item.id}</td>
                        <td className="px-4 py-0 border text-base uppercase">{item.names}</td>
                        <td className="px-4 py-0 border bg-gray-50 text-lg uppercase text-right">{item.quantityTomorrow}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(item.supplierTariffPriceTomorrow).toFixed(2)}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.quantityTomorrow!*item.supplierTariffPriceTomorrow!)* 100) / 100).toFixed(2)}</td>
                        <td className="px-4 py-0 border bg-gray-50 text-lg uppercase text-right">{item.quantityAfternoon}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(item.supplierTariffPriceAfternoon).toFixed(2)}</td>
                        <td className="px-4 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.quantityAfternoon!*item.supplierTariffPriceAfternoon!)* 100) / 100).toFixed(2)}</td>
                        
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr className="font-semibold text-gray-900 dark:text-white">
                    <td className="px-6 py-3 border text-base bg-gray-100" colSpan={2}>TOTAL</td>
                    <td className="px-4 py-3 border bg-gray-100 text-right text-lg">{summaryDailyEntries.quantityTotalTomorrow}</td>
                    <td className="px-4 py-3 border bg-gray-100 text-right text-lg" colSpan={1}></td>
                    <td className="px-4 py-3 border bg-gray-100 text-right text-lg">S/ {summaryDailyEntries.costTotalTomorrow}</td>
                    <td className="px-4 py-3 border bg-gray-100 text-right text-lg" colSpan={1}>{summaryDailyEntries.quantityTotalAfternoon}</td>
                    <td className="px-4 py-3 border bg-gray-100 text-right text-lg" colSpan={1}></td>
                    <td className="px-4 py-3 border bg-gray-100 text-right text-lg">S/ {summaryDailyEntries.costTotalAfternoon}</td>
                </tr>
                
                </tfoot>
            </table>
        </div>
    </>
    )
}

export default CollectionList