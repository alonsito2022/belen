import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { toast } from "react-toastify";
import { IPerson} from '@/app/types';

const initialStateSelectedSupplier = {
    id: 0,
    names: "",
    priceTomorrow: 0,
    priceAfternoon: 0,
    returnTomorrow: 0,
    returnAfternoon: 0,
    returnTomorrowStatus: "NA",
    returnAfternoonStatus: "NA",
    quantityTomorrow: 0,
    quantityAfternoon: 0,
    quantityDeliveredTomorrow: 0,
    quantityDeliveredAfternoon: 0,
    supplierTariffId: 0,
    supplierTariffPriceTomorrow: 0,
    supplierTariffPriceAfternoon: 0,
    supplierTariffIdByFortnight: 0
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
                    supplierTariffId:${selectedSupplier.supplierTariffIdByFortnight}, warehouseId: ${filterObj.warehouseId}, 
                    collectDate:"${filterObj.collectDate}", collectType:"${filterObj.collectType}", fortnightValue:${fort},
                    priceTomorrow:${Number(selectedSupplier.priceMilkTomorrowByFortnight)!==0?selectedSupplier.priceMilkTomorrowByFortnight:0}
                    priceAfternoon:${Number(selectedSupplier.priceMilkAfternoonByFortnight)!==0?selectedSupplier.priceMilkAfternoonByFortnight:0}, 
                    quantityTomorrow:${Number(selectedSupplier.quantityTomorrow)}, 
                    quantityAfternoon:${Number(selectedSupplier.quantityAfternoon)},
                    quantityToReturnTomorrow:${Number(selectedSupplier.returnTomorrow)},
                    quantityToReturnAfternoon:${Number(selectedSupplier.returnAfternoon)},
                    returnStatusTomorrow:"${selectedSupplier.returnTomorrowStatus}", 
                    returnStatusAfternoon:"${selectedSupplier.returnAfternoonStatus}"
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
                supplierTariffIdByFortnight:item.supplierTariffId!==null?item.supplierTariffId:0, 
                priceMilkTomorrowByFortnight:item.supplierTariffPriceTomorrow!==null?item.supplierTariffPriceTomorrow:0, 
                priceMilkAfternoonByFortnight:item.supplierTariffPriceAfternoon!==null?item.supplierTariffPriceAfternoon:0,
                quantityTomorrow:item.quantityTomorrow!==null?item.quantityTomorrow:0, 
                quantityAfternoon:item.quantityAfternoon!==null?item.quantityAfternoon:0,
                returnTomorrow:item.quantityToReturnTomorrow!==null?item.quantityToReturnTomorrow:0,
                returnAfternoon:item.quantityToReturnAfternoon!==null?item.quantityToReturnAfternoon:0,
                returnTomorrowStatus:item.returnStatusTomorrow!==null?item.returnStatusTomorrow:"NA",
                returnAfternoonStatus:item.returnStatusAfternoon!==null?item.returnStatusAfternoon:"NA",
            });
        }
    }, [item]);
    return (
        <tr key={selectedSupplier.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-1 py-1 border border-gray-400 align-middle font-medium text-gray-900 whitespace-nowrap dark:text-white">{selectedSupplier.names}</th>
            
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <input type='number' 
                    name='quantityTomorrow' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.quantityTomorrow} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='px-1 py-3 w-24 border border-gray-300 rounded-md text-center' />
            </td>

            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <input type='number' 
                    name='priceMilkTomorrowByFortnight' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.priceMilkTomorrowByFortnight} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='px-1 py-3 w-24 border border-gray-300 rounded-md text-center' />
            </td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">{Number(selectedSupplier.quantityTomorrow*selectedSupplier.priceMilkTomorrowByFortnight).toFixed(2)}</td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <input type='number' 
                    name='quantityAfternoon' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.quantityAfternoon} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='px-1 py-3 w-24 border border-gray-300 rounded-md text-center' />
            </td>

            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <input type='number' 
                    name='priceMilkAfternoonByFortnight' 
                    onWheel={(e)=> e.currentTarget.blur()}
                    value={selectedSupplier.priceMilkAfternoonByFortnight} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='px-1 py-3 w-24 border border-gray-300 rounded-md text-center' />
            </td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">{Number(selectedSupplier.quantityAfternoon*selectedSupplier.priceMilkAfternoonByFortnight).toFixed(2)}</td>

            <td className="px-1 py-0 border border-gray-400">
                <div className='grid grid-flow-col gap-1 justify-stretch'>
                <button type="button" onClick={ handleClickButtonAdd} 
                    className="flex justify-center  text-white bg-green-600 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        GUARDAR
                    </button>
                    <button type="button" onClick={ async ()=>{
                        setUpdateState(-1);
                        }} className=" flex justify-center text-white bg-gray-600 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                        CANCELAR
                    </button>
                </div>
            
            </td>
        </tr>
    )
}

export default GloriaShipmentEditRow