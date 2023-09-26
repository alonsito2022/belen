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
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">NUMERO DE MOLDES</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalMolds}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">COSTO PROMEDIO DE LECHE POR MOLDE</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.costPerformancePerLiter}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">PROMEDIO DE COSTO POR LITRO DE LECHE PARA QUESO</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.costAveragePerLiterUsed}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">CANTIDAD LITROS POR MOLDE (PROMEDIO RENDIMIENTO MENSUAL)</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalPerformance}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900" colSpan={3}></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">LITROS LECHE UTILIZADOS PARA PROCESO DE ELABORACION</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalQuantityLitersUsed}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.costTotalLitersUsed}</td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">LITROS DE LECHE ENVIADOS A GLORIA</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalQuantitySendFromBelenToGloria}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right"></td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">PROMEDIO DE COSTOS POR LITRO DE LECHE A GLORIA PAGADO POR GLORIA</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.costAveragePerLiterGloria}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalQuantitySendFromBelenToGloria * summaryDailyEntries.costAveragePerLiterGloria}</td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">PROMEDIO DE COSTOS POR LITRO DE LECHE A GLORIA PAGADO POR BELEN</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.costAveragePerLiterAfternoon}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalQuantitySendFromBelenToGloria * summaryDailyEntries.costAveragePerLiterAfternoon}</td>
                        </tr>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="align-middle px-4 py-4 border font-medium text-gray-900">DIFERENCIA DE PAGOS</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.sumCostTotalTomorrowAndAfternoon}</td>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{summaryDailyEntries.totalQuantitySendFromBelenToGloria * summaryDailyEntries.costAveragePerLiterGloria - summaryDailyEntries.totalQuantitySendFromBelenToGloria * summaryDailyEntries.costAveragePerLiterAfternoon}</td>
                        </tr>

                        
                    </tbody>
                
                </table>

                
                <div className="relative overflow-hidden bg-white rounded-b-lg shadow-md dark:bg-gray-800">
                    <nav className="flex flex-row items-center justify-between p-4"
                        aria-label="Table navigation">

                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400">ACIDEZ: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">35</span>
                        </p>
                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400">DENSIDAD: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">18</span>
                        </p>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default FortnightProductionSummary