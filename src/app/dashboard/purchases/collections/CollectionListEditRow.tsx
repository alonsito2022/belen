import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { toast } from "react-toastify";
import { IPerson} from '@/app/types';
const initialStateSelectedSupplier = {
    id: 0,
    names: "",
    priceTomorrow: 0,
    priceAfternoon: 0,
    quantityTomorrow: 0,
    quantityAfternoon: 0
}

function CollectionListEditRow({item, setUpdateState, filterObj, fort, getSuppliersWithDailyEntries}: any) {
    const [selectedSupplier, setSelectedSupplier] = useState<any|IPerson>(initialStateSelectedSupplier);

    const handleInputChangeSelectedSupplier = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {

        setSelectedSupplier({...selectedSupplier, [name]: value});
        
    }

    async function save(){
        let queryFetch: String = `
            mutation{
                saveDailyEntryForProduction(
                    supplierId:${selectedSupplier.id},
                    warehouseId: ${filterObj.warehouseId}, 
                    collectDate:"${filterObj.collectDate}", collectType:"${filterObj.collectType}", fortnightValue:${fort},
                    priceTomorrow:${Number(selectedSupplier.priceTomorrow)!==0?selectedSupplier.priceTomorrow:0}, 
                    priceAfternoon:${Number(selectedSupplier.priceAfternoon)!==0?selectedSupplier.priceAfternoon:0}, 
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
            toast(data.data.saveDailyEntryForProduction.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            setSelectedSupplier(initialStateSelectedSupplier)
            getSuppliersWithDailyEntries()

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
                priceTomorrow:item.priceTomorrow!==null?item.priceTomorrow:0,
                priceAfternoon:item.priceAfternoon!==null?item.priceAfternoon:0,
                quantityTomorrow:item.quantityTomorrow!==null?item.quantityTomorrow:0, 
                quantityAfternoon:item.quantityAfternoon!==null?item.quantityAfternoon:0
            });
        }
    }, [item]);
    return (
        <tr key={selectedSupplier.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-3 py-1 border border-gray-200 align-middle font-medium text-gray-900 whitespace-nowrap dark:text-white">{selectedSupplier.id}</th>
            
            <td className="px-1 py-1 border border-gray-200 align-middle text-center">{selectedSupplier.names}</td>

            <td className="border-0"></td>
            
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
                    name='priceTomorrow' 
                    onWheel={(e)=> e.currentTarget.blur()} 
                    value={selectedSupplier.priceTomorrow} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='py-1 w-24 border border-gray-300 rounded-md text-center text-lg' />
            </td>
            <td className="px-1 py-1 border border-gray-200 align-middle text-center text-lg">{Number(selectedSupplier.quantityTomorrow*selectedSupplier.priceTomorrow).toFixed(2)}</td>
            <td className="border-0"></td>
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
                    name='priceAfternoon' 
                    onWheel={(e)=> e.currentTarget.blur()}
                    value={selectedSupplier.priceAfternoon} 
                    onChange={e=>handleInputChangeSelectedSupplier(e)} 
                    onFocus={(e) => e.target.select()} 
                    className='py-1 w-24 border border-gray-300 rounded-md text-center text-lg' />
            </td>
            <td className="px-1 py-1 border border-gray-200 align-middle text-center text-lg">{Number(selectedSupplier.quantityAfternoon*selectedSupplier.priceAfternoon).toFixed(2)}</td>

            <td className="px-2 py-0 border border-gray-200">
                <div className='grid grid-flow-col gap-2 justify-stretch'>
                <button type="button" onClick={ handleClickButtonAdd} 
                    className="text-white font-medium rounded-lg text-sm py-2">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                        </svg>
                    </button>
                    <button type="button" onClick={ async ()=>{
                        setUpdateState(-1);
                        }} className="text-white font-medium rounded-lg text-sm py-2">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                        </svg>
                    </button>
                </div>
            
            </td>
        </tr>
    )
}

export default CollectionListEditRow