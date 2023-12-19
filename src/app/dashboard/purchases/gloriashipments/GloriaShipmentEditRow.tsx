import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { toast } from "react-toastify";
import { IPerson} from '@/app/types';

const initialStateSelectedSupplier = {
    id: 0,
    names: "",
    priceGloriaTomorrow: 0,
    priceGloriaAfternoon: 0,
    quantityTomorrow: 0,
    quantityAfternoon: 0,
    supplierTariffId: 0,
}

function GloriaShipmentEditRow({item, setUpdateState, filterObj, fort, getGloriaShipments}: any) {

    const [selectedSupplier, setSelectedSupplier] = useState<any|IPerson>(initialStateSelectedSupplier);

    const handleInputChangeSelectedSupplier = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {

        setSelectedSupplier({...selectedSupplier, [name]: value});
        
    }

    async function save(){
        let queryFetch: String = `
            mutation{
                saveCollectionOperation(
                    supplierId:${selectedSupplier.id},
                    supplierTariffId:${selectedSupplier.supplierTariffId}, warehouseId: ${filterObj.warehouseId}, 
                    collectDate:"${filterObj.collectDate}", collectType:"${filterObj.collectType}", fortnightValue:${fort},
                    priceGloriaTomorrow:${Number(selectedSupplier.priceGloriaTomorrow)!==0?selectedSupplier.priceGloriaTomorrow:0}, 
                    priceGloriaAfternoon:${Number(selectedSupplier.priceGloriaAfternoon)!==0?selectedSupplier.priceGloriaAfternoon:0}, 
                    quantityTomorrow:${Number(selectedSupplier.quantityTomorrow)}, 
                    quantityAfternoon:${Number(selectedSupplier.quantityAfternoon)}
                ){
                    message
                }
            }
        `;
        
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({query: queryFetch})
        })
        .then(res=>res.json())
        .then(data=>{
            toast(data.data.saveCollectionOperation.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            setSelectedSupplier(initialStateSelectedSupplier)
            getGloriaShipments()

        }).catch(e=>console.log(e))
        
    }
    const handleClickButtonAdd = (e: MouseEvent<HTMLButtonElement>) => {
        // console.log('selectedSupplier', selectedSupplier)
        setUpdateState(-1);
        save()
    }
    useEffect(() => {

        if(item.id !==0 )
        {
            // console.log(item)
            setSelectedSupplier({...selectedSupplier, 
                id: item.id, names: item.names, 
                supplierTariffId:item.supplierTariffId!==null?item.supplierTariffId:0, 
                priceGloriaTomorrow:item.priceGloriaTomorrow!==null?item.priceGloriaTomorrow:0,
                priceGloriaAfternoon:item.priceGloriaAfternoon!==null?item.priceGloriaAfternoon:0,
                quantityTomorrow:item.quantityTomorrow!==null?item.quantityTomorrow:0, 
                quantityAfternoon:item.quantityAfternoon!==null?item.quantityAfternoon:0
            });
        }
    }, [item]);
    return (
        <tr key={selectedSupplier.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-3 py-1 border border-gray-200 align-middle font-medium text-gray-900 whitespace-nowrap dark:text-white">{selectedSupplier.names}</th>
            
            <td className="px-1 py-1 border border-gray-200 align-middle text-center">
                <input type='number' 
                    name='quantityTomorrow' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.quantityTomorrow} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='py-1 w-24 border border-gray-300 rounded-md text-center text-lg' />
            </td>

            <td className="px-1 py-1 border border-gray-200 align-middle text-center">
                <input type='number' 
                    name='priceGloriaTomorrow' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.priceGloriaTomorrow} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='py-1 w-24 border border-gray-300 rounded-md text-center text-lg' />
            </td>
            <td className="px-1 py-1 border border-gray-200 align-middle text-center text-lg">{Number(selectedSupplier.quantityTomorrow*selectedSupplier.priceGloriaTomorrow).toFixed(2)}</td>
            <td className="px-1 py-1 border border-gray-200 align-middle text-center">
                <input type='number' 
                    name='quantityAfternoon' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.quantityAfternoon} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='py-1 w-24 border border-gray-300 rounded-md text-center text-lg' />
            </td>

            <td className="px-1 py-1 border border-gray-200 align-middle text-center">
                <input type='number' 
                    name='priceGloriaAfternoon' 
                    onWheel={(e)=> e.currentTarget.blur()}
                    value={selectedSupplier.priceGloriaAfternoon} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='py-1 w-24 border border-gray-300 rounded-md text-center text-lg' />
            </td>
            <td className="px-1 py-1 border border-gray-200 align-middle text-center text-lg">{Number(selectedSupplier.quantityAfternoon*selectedSupplier.priceGloriaAfternoon).toFixed(2)}</td>

            <td className="px-2 py-0 border border-gray-200">
                <div className='grid grid-flow-col gap-2 justify-stretch'>
                <button type="button" onClick={ handleClickButtonAdd} 
                    className=" text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        GUARDAR
                    </button>
                    <button type="button" onClick={ async ()=>{
                        setUpdateState(-1);
                        }} className=" text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm py-2  dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                        CANCELAR
                    </button>
                </div>
            
            </td>
        </tr>
    )
}

export default GloriaShipmentEditRow