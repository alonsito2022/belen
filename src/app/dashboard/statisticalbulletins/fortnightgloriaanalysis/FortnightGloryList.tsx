import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';

function FortnightGloryList({suppliers, summaryDailyEntries}: any) {
    return (
        <>
        
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-black uppercase">
                        <tr>
                            <th scope="col" className="px-4 py-4 border">ID</th>
                            <th scope="col" className="px-4 py-4 border">PROVEEDOR</th>

                            <th scope="col" className="px-4 py-4 border text-center bg-lime-200">TOTAL<br/>LITROS MAÑANA</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-lime-300">VALOR LITRO</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-lime-400">TOTAL</th>

                            <th scope="col" className="px-4 py-4 border text-center bg-gray-400">TOTAL<br/>LITROS TARDE</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-gray-300">VALOR LITRO</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-gray-200">TOTAL</th>

                            <th scope="col" className="px-4 py-4 border text-center bg-yellow-100 ">TOTAL LITROS<br/>TARDE Y<br/>MAÑANA</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-yellow-200">MONTO TOTAL<br/>TARDE Y<br/>MAÑANA</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-yellow-300">VALOR GLORIA</th>
                            <th scope="col" className="px-4 py-4 border text-center bg-yellow-400">TOTAL QUINCENA</th>
                        </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((item: IPerson) => 
                        <tr key={item.id} className="text-black border-b">
                            <td className="px-3 py-0 border text-base uppercase">{item.id}</td>
                            <td className="px-3 py-0 border text-base uppercase">{item.names}</td>

                            <td className="px-3 py-0 border text-lg uppercase text-right bg-lime-200">{item.quantityTomorrowBySupplier}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right bg-lime-300 whitespace-nowrap">S/ {Number(item.averagePriceGeneralTomorrowBySupplier).toFixed(2)}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right bg-lime-400 whitespace-nowrap">S/ {Number(Math.round(Number(item.costGeneralTomorrowBySupplier)* 100) / 100).toFixed(2)}</td>
                            
                            <td className="px-3 py-0 border text-lg uppercase text-right bg-gray-400">{item.quantityAfternoonBySupplier}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right bg-gray-300 whitespace-nowrap">S/ {Number(item.averagePriceGeneralAfternoonBySupplier).toFixed(2)}</td>
                            <td className="px-3 py-0 border text-lg uppercase text-right bg-gray-200 whitespace-nowrap">S/ {Number(Math.round(Number(item.costGeneralAfternoonBySupplier)* 100) / 100).toFixed(2)}</td>

                            <td className="px-3 py-0 border bg-yellow-100  text-lg uppercase text-right">{item.quantityTomorrowBySupplier! + item.quantityAfternoonBySupplier!}</td>
                            <td className="px-3 py-0 border bg-yellow-200 text-lg uppercase text-right whitespace-nowrap">S/ {Number(Math.round(Number(item.quantityTomorrowBySupplier!*item.averagePriceGeneralTomorrowBySupplier! + item.quantityAfternoonBySupplier!*item.averagePriceGeneralAfternoonBySupplier!)* 100) / 100).toFixed(2)}</td>
                            <td className="px-3 py-0 border bg-yellow-300 text-lg uppercase text-right whitespace-nowrap">S/ {Number(item.averagePriceGloriaAfternoonBySupplier).toFixed(2)}</td>
                            <td className="px-3 py-0 border bg-yellow-400 text-lg uppercase text-right whitespace-nowrap">S/ {Number(item.averagePriceGloriaAfternoonBySupplier!*(item.quantityTomorrowBySupplier! + item.quantityAfternoonBySupplier!)).toFixed(2)}</td>
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
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg whitespace-nowrap">S/ {Number(summaryDailyEntries.sumCostTotalTomorrowAndAfternoon).toFixed(2)}</td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg" colSpan={1}></td>
                            <td className="px-3 py-3 border bg-gray-100 text-right text-lg whitespace-nowrap">S/ {Number(summaryDailyEntries.sumCostTotalGloriaPerFortnitght).toFixed(2)}</td>


                        </tr>
                    
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default FortnightGloryList