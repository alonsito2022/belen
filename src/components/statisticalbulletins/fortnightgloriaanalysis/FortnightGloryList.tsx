import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';

function FortnightGloryList({suppliers, summaryDailyEntries}: any) {
    return (
        <>
        
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-4 py-4 border">ID</th>
                            <th scope="col" className="px-4 py-4 border">PROVEEDOR</th>

                            <th scope="col" className="px-4 py-4 border text-center bg-gray-50">TOTAL<br/>LITROS MAÑANA</th>
                            <th scope="col" className="px-4 py-4 border text-center">VALOR LITRO</th>
                            <th scope="col" className="px-4 py-4 border text-center">TOTAL</th>

                            <th scope="col" className="px-4 py-4 border text-center bg-gray-50">TOTAL<br/>LITROS TARDE</th>
                            <th scope="col" className="px-4 py-4 border text-center">VALOR LITRO</th>
                            <th scope="col" className="px-4 py-4 border text-center">TOTAL</th>

                            <th scope="col" className="px-4 py-4 border text-center bg-gray-50">TOTAL LITROS<br/>TARDE Y<br/>MAÑANA</th>
                            <th scope="col" className="px-4 py-4 border text-center">MONTO TOTAL<br/>TARDE Y<br/>MAÑANA</th>
                            <th scope="col" className="px-4 py-4 border text-center">VALOR GLORIA</th>
                            <th scope="col" className="px-4 py-4 border text-center">TOTAL QUINCENA</th>
                        </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((item: IPerson) => 
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-3 py-0 border text-base uppercase">{item.id}</td>
                            <td className="px-3 py-0 border text-base uppercase">{item.names}</td>
                            <td className="px-3 py-0 border bg-gray-50 text-lg uppercase text-right">{item.totalQuantityTomorrowByFortnight}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(item.priceGloriaAveragePerLiterTomorrow).toFixed(4)}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.costTotalGloriaTomorrowByFortnight)* 100) / 100).toFixed(2)}</td>
                            
                            <td className="px-3 py-0 border bg-gray-50 text-lg uppercase text-right">{item.totalQuantityAfternoonByFortnight}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(item.priceGloriaAveragePerLiterAfternoon).toFixed(4)}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.costTotalGloriaAfternoonByFortnight)* 100) / 100).toFixed(2)}</td>

                            <td className="px-3 py-0 border bg-gray-50 text-lg uppercase text-right">{item.totalQuantityTomorrowByFortnight! + item.totalQuantityAfternoonByFortnight!}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(Math.round(Number(item.totalQuantityTomorrowByFortnight!*item.priceGloriaAveragePerLiterTomorrow! + item.totalQuantityAfternoonByFortnight!*item.priceGloriaAveragePerLiterAfternoon!)* 100) / 100).toFixed(2)}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(summaryDailyEntries.paymentCostOfGloriaPerLiter).toFixed(4)}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right">S/ {Number(summaryDailyEntries.paymentCostOfGloriaPerLiter*(item.totalQuantityTomorrowByFortnight! + item.totalQuantityAfternoonByFortnight!)).toFixed(2)}</td>
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold text-gray-900 dark:text-white">
                            <td className="px-6 py-3 border text-base bg-gray-100" colSpan={2}>TOTAL</td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg">{summaryDailyEntries.sumQuantityTotalTomorrow}</td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg" colSpan={2}></td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg">{summaryDailyEntries.sumQuantityTotalAfternoon}</td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg" colSpan={2}></td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg">{summaryDailyEntries.sumQuantityTotalTomorrowAndAfternoon}</td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg">S/ {summaryDailyEntries.sumCostTotalTomorrowAndAfternoon}</td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg" colSpan={1}></td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg">S/ {summaryDailyEntries.sumCostTotalGloriaPerFortnitght}</td>


                        </tr>
                    
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default FortnightGloryList