import React from 'react'

function InventoryList() {
    return (
        <>
    <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3 border text-center font-bold" colSpan={4}>DESCRIPCION</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold" colSpan={3}>ENTRADA</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold" colSpan={3}>SALIDA</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold">SALDO</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold">ACCIONES</th>
            </tr>
            <tr>
                <th scope="col" className="px-6 py-3 border text-center font-normal">ID</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">FECHA</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">OPERACION</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">USUARIO</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">CANTIDAD</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">PRECIO</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">TOTAL</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">CANTIDAD</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">PRECIO</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">TOTAL</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal">CANTIDAD<br/>RESTANTE</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal"></th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white" scope="row">34043</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">2023-09-01</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">VENTA</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">MARILYN GIULIANAVARGAS</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">12 [UND]</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">S/1.083333</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">S/12.999996</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">1608 [UND]</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white" scope="row">34658</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">2023-09-04</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">LOGISTICA - CUADRE DE INVENTARIO</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">MARILYN GIULIANAVARGAS</td>
                
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">48 [UND]</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">S/1.083333</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">S/51.999996</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white">1560 [UND]</td>
                <td className="px-6 py-4 font-medium text-emerald-700 whitespace-nowrap dark:text-white"></td>
            </tr>



        </tbody>
    </table>
</div>
        </>
    )
}

export default InventoryList