import { ChangeEvent, MouseEvent, FormEvent ,useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';
import { toast } from "react-toastify";
function FortnightProductionSummary({filterObj, setSummaryDailyEntries, summaryDailyEntries, fort}: any) {
    return (
        <>
            <div className="relative overflow-x-auto p-4 mx-auto max-w-5xl bg-white">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    CUADRO RESUMEN
                </caption>

                    <tbody>
                        
                        <tr className="bg-sky-50 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">NUMERO DE MOLDES</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{summaryDailyEntries.sumQuantityMolds}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-sky-100 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">COSTO PROMEDIO DE LECHE POR MOLDE</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePerformancePerLiter).toFixed(3)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-righ"></td>
                        </tr>
                        
                        <tr className="bg-sky-200 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">PROMEDIO DE COSTO POR LITRO DE LECHE PARA QUESO</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePerLiterUsed).toFixed(4)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-sky-300 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">CANTIDAD LITROS POR MOLDE (PROMEDIO RENDIMIENTO MENSUAL)</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{Number(summaryDailyEntries.costAveragePerformance).toFixed(9)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900" colSpan={3}></td>
                        </tr>
                        
                        <tr className="bg-gray-50 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">LITROS LECHE UTILIZADOS PARA PROCESO DE ELABORACION</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{summaryDailyEntries.sumQuantityLitersUsed}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.sumTotalLitersUsed).toFixed(2)}</td>
                        </tr>
                        
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">LITROS DE LECHE ENVIADOS A GLORIA</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black">{summaryDailyEntries.sumQuantitySendToGloria}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-gray-200 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">PROMEDIO DE COSTOS POR LITRO DE LECHE A GLORIA PAGADO POR GLORIA</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePriceGloria).toFixed(4)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.averagePricePerLiterPaidByGloria).toFixed(4)}</td>
                        </tr>
                        
                        <tr className="bg-gray-300 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-gray-900">PROMEDIO DE COSTOS POR LITRO DE LECHE A GLORIA PAGADO POR BELEN</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.costAveragePriceAfternoon).toFixed(4)}</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-black whitespace-nowrap">S/ {Number(summaryDailyEntries.averagePricePerLiterPaidByBelen).toFixed(4)}</td>
                        </tr>
                        
                        <tr className="bg-gray-400 dark:bg-gray-800">
                            <td className="align-middle px-2 py-1 border font-medium text-white">DIFERENCIA DE PAGOS</td>
                            <td className="align-middle px-2 py-1 border text-lg text-right"></td>
                            <td className="align-middle px-2 py-1 border text-lg text-right text-white whitespace-nowrap">S/ {Number(summaryDailyEntries.paymentDifference).toFixed(4)}</td>
                        </tr>

                        
                    </tbody>
                
                </table>

                
                <div className="relative overflow-hidden bg-white rounded-b-lg shadow-md dark:bg-gray-800">
                    <nav className="flex flex-row items-center justify-between p-4"
                        aria-label="Table navigation">

                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400"></span>
                        <span className="font-semibold text-gray-900 dark:text-white"></span>
                        </p>
                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400"></span>
                        <span className="font-semibold text-gray-900 dark:text-white"></span>
                        </p>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default FortnightProductionSummary