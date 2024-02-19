import { IOperationDetail} from '@/app/types';

function InventoryList({operationDetails}:any) {
    return (
        <>
    <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left">
        <thead className="">
            <tr>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-300 text-black" colSpan={4}>DESCRIPCION</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-600" colSpan={4}>ENTRADA</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-yellow-500" colSpan={4}>SALIDA</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-300" colSpan={4}>SALDO POR LOTE</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-red-400" rowSpan={2}>RESTANTE<br/>EN PLANTA</th>
            </tr>
            <tr>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200 text-black">ID</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200 text-black">FECHA</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200 text-black">DESCRIPCION</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200 text-black">USUARIO</th>

                <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">LOT</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">CANTIDAD</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">PRECIO</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">TOTAL</th>

                <th scope="col" className="px-2 py-2 border text-center font-bold bg-yellow-400">LOT</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-yellow-400">CANTIDAD</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-yellow-400">PRECIO</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-yellow-400">TOTAL</th>

                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200">LOT</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200">CANTIDAD</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200">PRECIO</th>
                <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-200">TOTAL</th>
            </tr>
        </thead>
        <tbody>

            {operationDetails.map((item: IOperationDetail) => 
            <tr key={item.id} className="bg-white">
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white" scope="row">{item.operation?.id}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.operationDate}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.observation}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.user?.firstName + " " + item.operation?.user?.lastName}</td>
                
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?item.batchCode:""}</td>
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?Number(item.quantity).toFixed(2):""}</td>
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?"S/ " +  Number(item.price).toFixed(2):""}</td>
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?"S/ " +  Number(item.subtotal).toFixed(2):""}</td>
                
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?item.batchCode:""}</td>
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?Number(item.quantity).toFixed(2):""}</td>
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?"S/ " +  Number(item.price).toFixed(2):""}</td>
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?"S/ " +  Number(item.subtotal).toFixed(2):""}</td>

                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{item.batchCode}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{Number(item.batchStock).toFixed(2)}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{"S/ " +  Number(item.batchPrice).toFixed(2)}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{"S/ " +  Number(item.batchPriceTotal).toFixed(2)}</td>
                <td className="px-2 py-1 font-normal bg-red-300 whitespace-nowrap border dark:text-white">{Number(item.remainingQuantity).toFixed(2)}</td>
            </tr>
            )}


        </tbody>
    </table>
</div>
        </>
    )
}

export default InventoryList