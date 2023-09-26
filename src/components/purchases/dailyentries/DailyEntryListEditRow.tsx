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

function DailyEntryListEditRow({item, setUpdateState, filterObj, fort, fetchDailyEntries}: any) {

    const return_status_choices = [{id: '01', value:'DEVOLUCION'}, {id: '02', value:'GLORIA'}, {id: 'NA', value:'NO APLICA'}];

    const [selectedSupplier, setSelectedSupplier] = useState<any|IPerson>(initialStateSelectedSupplier);

    const handleInputChangeSelectedSupplier = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {

        if(name=="quantityDeliveredTomorrow"){
            let deliveredTomorrow = Number(value) - Number(selectedSupplier.returnTomorrow);
            setSelectedSupplier({...selectedSupplier, quantityTomorrow: deliveredTomorrow, [name]: value});
        }
        else if(name=="returnTomorrow"){
            let deliveredTomorrow = Number(selectedSupplier.quantityDeliveredTomorrow) - Number(value);
            setSelectedSupplier({...selectedSupplier, quantityTomorrow: deliveredTomorrow, [name]: value});
        }
        else if(name=="quantityDeliveredAfternoon"){
            let deliveredAfternoon= Number(value) - Number(selectedSupplier.returnAfternoon);
            setSelectedSupplier({...selectedSupplier, quantityAfternoon: deliveredAfternoon, [name]: value});
        }
        else if(name=="returnAfternoon"){
            let deliveredAfternoon= Number(selectedSupplier.quantityDeliveredAfternoon) - Number(value);
            setSelectedSupplier({...selectedSupplier, quantityAfternoon: deliveredAfternoon, [name]: value});
        }
        else{
            setSelectedSupplier({...selectedSupplier, [name]: value});
        }
        
    }

    async function save(){
        let queryFetch: String = "";
        
        queryFetch = `
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
            fetchDailyEntries()

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
                quantityDeliveredTomorrow:item.quantityDeliveredTomorrow!==null?item.quantityDeliveredTomorrow:0,
                quantityDeliveredAfternoon:item.quantityDeliveredAfternoon!==null?item.quantityDeliveredAfternoon:0,
                returnTomorrow:item.quantityToReturnTomorrow!==null?item.quantityToReturnTomorrow:0,
                returnAfternoon:item.quantityToReturnAfternoon!==null?item.quantityToReturnAfternoon:0,
                returnTomorrowStatus:item.returnStatusTomorrow!==null?item.returnStatusTomorrow:"NA",
                returnAfternoonStatus:item.returnStatusAfternoon!==null?item.returnStatusAfternoon:"NA",
            });
        }
    }, [item]);
    return (
        <tr key={selectedSupplier.id} className="  bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-3 py-3 border border-gray-400 align-middle font-medium text-gray-900 whitespace-nowrap dark:text-white">{selectedSupplier.names}</th>
            
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <input type='number' name='quantityDeliveredTomorrow' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.quantityDeliveredTomorrow} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='px-1 py-2 w-24 border border-gray-300 rounded-md text-center' />
            </td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <div className="flex justify-center">
                            
                    <input type='number' name='returnTomorrow' 
                        onWheel={(e)=> e.currentTarget.blur()} 
                        value={selectedSupplier.returnTomorrow} 
                        onChange={e=>handleInputChangeSelectedSupplier(e)} 
                        onFocus={(e) => e.target.select()} 
                        className=' px-1 py-2 w-24 font-normal text-center text-red-500  border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600' />

                    <label htmlFor="states" className="sr-only">escoge un estado</label>
                    <select name='returnTomorrowStatus' value={selectedSupplier.returnTomorrowStatus} 
                        onChange={e=>handleInputChangeSelectedSupplier(e)}
                        className=" text-xs bg-gray-50 border border-gray-300 text-gray-900 rounded-r-lg border-l-gray-100 dark:border-l-gray-700 border-l-2 focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {return_status_choices.map((o)=><option key={o.id} value={o.id}>{o.value}</option>)}
                    </select>
                </div>

            </td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center text-green-500">
                {selectedSupplier.quantityTomorrow} 
            </td>

            <td className="px-1 py-1 border border-gray-400 align-middle text-center">
                <input type='number' name='quantityDeliveredAfternoon' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.quantityDeliveredAfternoon} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} onFocus={(e) => e.target.select()} 
                    className='px-1 py-2 w-24 border border-gray-300 rounded-md text-center' />
            </td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center">

                <div className="flex justify-center">
                    <input type='number' name='returnAfternoon' 
                        onWheel={(e)=> e.currentTarget.blur()} 
                        value={selectedSupplier.returnAfternoon} 
                        onChange={e=>handleInputChangeSelectedSupplier(e)} 
                        onFocus={(e) => e.target.select()} 
                        className=' px-1 py-2 w-24 font-normal text-center text-red-500  border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600' />

                    <label htmlFor="states" className="sr-only">escoge un estado</label>
                    <select name='returnAfternoonStatus' value={selectedSupplier.returnAfternoonStatus} 
                        onChange={e=>handleInputChangeSelectedSupplier(e)}
                        className=" text-xs bg-gray-50 border border-gray-300 text-gray-900 rounded-r-lg border-l-gray-100 dark:border-l-gray-700 border-l-2 focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {return_status_choices.map((o)=><option key={o.id} value={o.id}>{o.value}</option>)}
                    </select>
                </div>
            </td>
            <td className="px-1 py-1 border border-gray-400 align-middle text-center text-green-500">
                {selectedSupplier.quantityAfternoon}
            </td>
            <td className="px-1 py-0 border border-gray-400">
                <div className='grid grid-flow-col gap-1 justify-stretch'>
                    <button type="button" onClick={ handleClickButtonAdd} 
                    className="flex justify-center  text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        GUARDAR
                    </button>
                    <button type="button" onClick={ async ()=>{
                        setUpdateState(-1);
                        }} className=" flex justify-center text-white bg-red-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                        CANCELAR
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default DailyEntryListEditRow