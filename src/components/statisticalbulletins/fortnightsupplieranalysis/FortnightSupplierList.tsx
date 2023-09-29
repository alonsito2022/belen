import React from 'react'

function FortnightSupplierList() {
    return (
        <>
            
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 border text-center bg-gray-300" rowSpan={3}>FECHA</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300" colSpan={6}>MAÑANA</th>
                            <th scope="col" className="px-6 py-6 border text-center bg-sky-300" colSpan={6}>TARDE</th>
                        </tr>
                        <tr>
                            
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300" colSpan={3}>PRODUCCION</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300" colSpan={3}>GLORIA</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300" colSpan={3}>PRODUCCION</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300" colSpan={3}>GLORIA</th>
                        </tr>
                        <tr>

                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300">LITROS</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300">TOTAL</th>

                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300">LITROS</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-yellow-300">TOTAL</th>

                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300">LITROS</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300">TOTAL</th>

                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300">LITROS</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-6 py-3 border text-center bg-sky-300">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 border bg-gray-300 text-right">01/09</td>

                            <td className="px-6 py-4 border bg-yellow-300 text-center">76</td>
                            <td className="px-6 py-4 border bg-yellow-300">1.2</td>
                            <td className="px-6 py-4 border bg-yellow-300">45</td>

                            <td className="px-6 py-4 border bg-yellow-300"></td>
                            <td className="px-6 py-4 border bg-yellow-300"></td>
                            <td className="px-6 py-4 border bg-yellow-300"></td>

                            <td className="px-6 py-4 border bg-sky-300 text-center"></td>
                            <td className="px-6 py-4 border bg-sky-300"></td>
                            <td className="px-6 py-4 border bg-sky-300"></td>

                            <td className="px-6 py-4 border bg-sky-300"></td>
                            <td className="px-6 py-4 border bg-sky-300"></td>
                            <td className="px-6 py-4 border bg-sky-300"></td>
                        </tr>
                       
                    </tbody>
                    <tfoot>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 border bg-gray-300">TOTAL</td>

                            <td className="px-6 py-4 border bg-yellow-300 text-center">76</td>
                            <td className="px-6 py-4 border bg-yellow-300"></td>
                            <td className="px-6 py-4 border bg-yellow-300">45</td>

                            <td className="px-6 py-4 border bg-yellow-300">76</td>
                            <td className="px-6 py-4 border bg-yellow-300"></td>
                            <td className="px-6 py-4 border bg-yellow-300">76</td>

                            <td className="px-6 py-4 border bg-sky-300">76</td>
                            <td className="px-6 py-4 border bg-sky-300"></td>
                            <td className="px-6 py-4 border bg-sky-300">76</td>

                            <td className="px-6 py-4 border bg-sky-300">76</td>
                            <td className="px-6 py-4 border bg-sky-300"></td>
                            <td className="px-6 py-4 border bg-sky-300">76</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 border bg-gray-300">LITROS TOTALES</td>

                            <td className="px-6 py-4 border bg-yellow-300 text-center" colSpan={6}>76</td>
                            <td className="px-6 py-4 border bg-sky-300 text-center" colSpan={6}>76</td>
                        </tr>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 border bg-gray-300">MONTO FINAL</td>

                            <td className="px-6 py-4 border bg-gray-300 text-center" colSpan={12}>76</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default FortnightSupplierList