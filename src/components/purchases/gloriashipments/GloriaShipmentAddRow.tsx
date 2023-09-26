import { IPerson} from '@/app/types';
import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { toast } from "react-toastify";

const initialStateSelectedSupplier = {
    id: 0,
    names: "",
    priceTomorrow: 0,
    priceAfternoon: 0,
    returnTomorrow: 0,
    returnAfternoon: 0,
    returnTomorrowStatus: "NA",
    returnAfternoonStatus: "NA",
    quantityTomorrow: "",
    quantityAfternoon: "",
    supplierTariffId: 0,
    supplierTariffPriceTomorrow: 0,
    supplierTariffPriceAfternoon: 0,
    supplierTariffIdByFortnight: 0
}

function GloriaShipmentAddRow({filterObj, fort, getGloriaShipments, suppliers}:any) {
    const [filteredSuppliers, setFilteredSuppliers] = useState< IPerson[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any|IPerson>(initialStateSelectedSupplier);
    const [selectedItem, setSelectedItem]= useState(-1);
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
            getGloriaShipments()
            //getGloriaShipments()

        }).catch(e=>console.log(e))
        
    }
    const handleClickButtonAdd = (e: MouseEvent<HTMLButtonElement>) => {
        // console.log('selectedSupplier', selectedSupplier)
        save()
    }
    const handleInputChangeSelectedSupplier = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {

        setSelectedSupplier({...selectedSupplier, [name]: value});
        
        if(name==="names"){
            let dropdownEl = document.querySelector("#dropdown-supplier") as HTMLDivElement;
            dropdownEl.classList.remove("hidden");
            let filteredCountries = suppliers.filter((c:IPerson) => c.names.toLowerCase().includes(value.toLowerCase()));
            setFilteredSuppliers(filteredCountries)
        }
        
    }
    function supplierFound(i: IPerson){
        let dropdownEl = document.querySelector("#dropdown-supplier") as HTMLDivElement;
        dropdownEl.classList.add("hidden");
        setSelectedSupplier({...selectedSupplier, 
            id: i.id, names: i.names, 
            supplierTariffIdByFortnight:i.supplierTariffIdByFortnight!==null?i.supplierTariffIdByFortnight:0, 
            priceMilkTomorrowByFortnight:i.priceMilkTomorrowByFortnight!==null?i.priceMilkTomorrowByFortnight:0, 
            priceMilkAfternoonByFortnight:i.priceMilkAfternoonByFortnight!==null?i.priceMilkAfternoonByFortnight:0,
            quantityTomorrow:0, quantityAfternoon:0
        });
        // console.log("selection", i.names)
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if(selectedItem < filteredSuppliers.length){
            if(e.key === "ArrowUp" && selectedItem > 0){
                setSelectedItem((prev)=>prev-1);
            }else if (e.key==="ArrowDown" && selectedItem < filteredSuppliers.length - 1){
                setSelectedItem((prev)=>prev+1);
            }else if((e.key==="Enter" || e.key==="Tab") && selectedItem >= 0){
                supplierFound(filteredSuppliers[selectedItem]);
            }
        }
        else{
            let dropdownEl = document.querySelector("#dropdown-supplier") as HTMLDivElement;
            dropdownEl.classList.add("hidden");
            setSelectedItem(-1);
        }
    }
    return (
        
        <section className="dark:bg-gray-900 bg-green-50 mb-4">
            <div className="py-4 px-4 mx-auto max-w-5xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Añadir nuevo envio gloria</h2>

                <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>

                    <div className="sm:col-span-2 relative " onClick={(event)=>event.nativeEvent.stopImmediatePropagation()}>
                        <input type="hidden" id="autocompleteInputSupplierId" />
                        
                        <label htmlFor="autocompleteInputSupplierName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Proveedor</label>

                        <input
                            type="search"
                            id="autocompleteInputSupplierName"
                            name="names"
                            placeholder="Selecciona un proveedor"
                            className="w-full px-5 py-3 border border-gray-300 rounded-md font-normal"
                            onChange={handleInputChangeSelectedSupplier}
                            value={selectedSupplier.names}
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                        />

                        <div id="dropdown-supplier" className="w-full h-96 z-30 border border-gray-300 rounded-md bg-white absolute overflow-y-auto hidden">
                        {filteredSuppliers.map((i: IPerson, index) => 
                            <div key={index} onClick={()=>{
                                /*let dropdownEl = document.querySelector("#dropdown-supplier") as HTMLDivElement;
                                dropdownEl.classList.add("hidden");
                                setSelectedSupplier({...selectedSupplier, 
                                    id: i.id, names: i.names, 
                                    supplierTariffIdByFortnight:i.supplierTariffIdByFortnight!==null?i.supplierTariffIdByFortnight:0, 
                                    priceMilkTomorrowByFortnight:i.priceMilkTomorrowByFortnight!==null?i.priceMilkTomorrowByFortnight:0, 
                                    priceMilkAfternoonByFortnight:i.priceMilkAfternoonByFortnight!==null?i.priceMilkAfternoonByFortnight:0,
                                    quantityTomorrow:0, quantityAfternoon:0
                                });*/
                                supplierFound(i);
                            }} className={selectedItem === index ?
                                "px-5 py-3 border-b border-gray-200 text-white cursor-pointer hover:bg-slate-100 transition-colors bg-amber-500":
                                "px-5 py-3 border-b border-gray-200 text-stone-600 cursor-pointer hover:bg-slate-100 transition-colors"}>{i.names}
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="quantityTomorrow" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Cantidad mañana <span className=" text-blue-300 text-sm font-normal"> * S/ {selectedSupplier.priceMilkTomorrowByFortnight}</span>
                        </label>
                        <input type='number' name='quantityTomorrow' placeholder='C. M.' onWheel={(e)=> e.currentTarget.blur()} value={selectedSupplier.quantityTomorrow} onChange={e=>handleInputChangeSelectedSupplier(e)} onFocus={(e) => e.target.select()} 
                        className='w-full px-2 py-3 border border-gray-300 rounded-md font-normal text-center' />

                    </div>
                    <div className="w-full">
                        <label htmlFor="quantityAfternoon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Cantidad tarde <span className=" text-blue-300 text-sm font-normal text-center"> * S/ {selectedSupplier.priceMilkAfternoonByFortnight}</span>
                        </label>
                        <input type='number' name='quantityAfternoon' placeholder='C. T.' onWheel={(e)=> e.currentTarget.blur()} value={selectedSupplier.quantityAfternoon} onChange={e=>handleInputChangeSelectedSupplier(e)} onFocus={(e) => e.target.select()} 
                        className='w-full px-2 py-3 border border-gray-300 rounded-md font-normal text-center' />

                    </div>

                    {/*<th scope="col" className="px-3 py-3 align-bottom text-center">
                        <label htmlFor="priceTomorrow" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PRECIO MAÑANA</label>
                        <input type='number' name='priceTomorrow' onWheel={(e)=> e.currentTarget.blur()} value={selectedSupplier.priceTomorrow} onChange={e=>handleInputChangeSelectedSupplier(e)} onFocus={(e) => e.target.select()} className='w-24 px-2 py-3 w-full border border-gray-300 rounded-md' />

                            </th>*/}    

                    {/*<th scope="col" className="px-3 py-3 align-bottom">
                        <label htmlFor="priceAfternoon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PRECIO TARDE</label>
                        <input type='number' name='priceAfternoon' onWheel={(e)=> e.currentTarget.blur()} value={selectedSupplier.priceAfternoon} onChange={e=>handleInputChangeSelectedSupplier(e)} onFocus={(e) => e.target.select()} className='px-5 py-3 w-full border border-gray-300 rounded-md' />

                        </th>*/}
                </div>


                <button type="button" onClick={handleClickButtonAdd}
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800" >Nuevo Registro</button>
                        
            </div>
        </section>
    )
}

export default GloriaShipmentAddRow