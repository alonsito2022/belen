import { IOperationDetail} from '@/app/types';

function InventoryList({operationDetails}:any) {
    return (
        <>
    <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left">
        <thead className="">
            <tr>
                <th scope="col" className="px-6 py-3 border text-center font-bold bg-gray-100 text-black" colSpan={5}>DESCRIPCION</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold bg-lime-400" colSpan={3}>ENTRADA</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold bg-yellow-300" colSpan={3}>SALIDA</th>
                <th scope="col" className="px-6 py-3 border text-center font-bold bg-gray-100" colSpan={3}>SALDO</th>
            </tr>
            <tr>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100 text-black">ID</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100 text-black">FECHA</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100 text-black">OPERACION</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100 text-black">OBS.</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100 text-black">USUARIO</th>

                <th scope="col" className="px-6 py-3 border text-center font-normal bg-lime-400">CANTIDAD</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-lime-400">PRECIO</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-lime-400">TOTAL</th>

                <th scope="col" className="px-6 py-3 border text-center font-normal bg-yellow-300">CANTIDAD</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-yellow-300">PRECIO</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-yellow-300">TOTAL</th>

                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100">CANTIDAD</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100">PRECIO</th>
                <th scope="col" className="px-6 py-3 border text-center font-normal bg-gray-100">TOTAL</th>
            </tr>
        </thead>
        <tbody>

            {operationDetails.map((item: IOperationDetail) => 
            <tr key={item.id} className="bg-white">
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white" scope="row">{item.operation?.id}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.operationDate}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.operationTypeDisplay}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.observation}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.operation?.user?.firstName + " " + item.operation?.user?.lastName}</td>
                
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?Number(item.quantity):""}</td>
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?"S/ " +  Number(item.price).toFixed(2):""}</td>
                <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="E"?"S/ " +  Number(item.subtotal).toFixed(2):""}</td>
                
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?Number(item.quantity):""}</td>
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?"S/ " +  Number(item.price).toFixed(2):""}</td>
                <td className="px-2 py-1 font-normal bg-yellow-300 whitespace-nowrap border dark:text-white">{item.operation?.operationAction=="S"?"S/ " +  Number(item.subtotal).toFixed(2):""}</td>

                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{item.remainingQuantity}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{"S/ " +  item.remainingPrice}</td>
                <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">{"S/ " +  item.remainingPriceTotal}</td>
            </tr>
            )}


        </tbody>
    </table>
</div>
        </>
    )
}

export default InventoryList