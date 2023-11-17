"use client";
import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent, FocusEvent } from "react";
import { IPerson } from '@/app/types';

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


function FortnightSupplierList({suppliers, filterObj, setFilterObj, totalSuppliers, supplierWithData, fort} : any) {
    const [filteredSuppliers, setFilteredSuppliers] = useState< IPerson[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any|IPerson>(initialStateSelectedSupplier);
    const [selectedItem, setSelectedItem]= useState(-1);

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
        console.log("selection", i.names, i.id)
        setFilterObj({...filterObj, supplierId: i.id});
        
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
        <>
            
            <div className="relative overflow-x-auto">


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
                    }} 
                    
                    className={selectedItem === index ?
                        "px-5 py-3 border-b border-gray-200 text-white cursor-pointer hover:bg-slate-100 transition-colors bg-amber-500":
                        "px-5 py-3 border-b border-gray-200 text-stone-600 cursor-pointer hover:bg-slate-100 transition-colors"}>{i.names}
                    </div>
                )}
                </div>
            </div>
            <div>
            <button onClick={()=>{}}>Export to Word</button>
            </div>

                <table className="w-full">
                    <thead className="text-xs text-gray-900 uppercase ">
                        <tr>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-gray-300" rowSpan={3}>FECHA</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-yellow-500" colSpan={6}>MAÑANA</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-sky-400" colSpan={6}>TARDE</th>
                        </tr>
                        <tr>
                            
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-yellow-400" colSpan={3}>PRODUCCION</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-400" colSpan={3}>GLORIA</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-sky-300" colSpan={3}>PRODUCCION</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-300" colSpan={3}>GLORIA</th>
                        </tr>
                        <tr>

                            <th scope="col" className="px-2 py-2 border border-black text-center bg-yellow-300">LITROS</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-yellow-300">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-yellow-300">TOTAL</th>

                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-300">LITROS</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-300">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-300">TOTAL</th>

                            <th scope="col" className="px-2 py-2 border border-black text-center bg-sky-200">LITROS</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-sky-200">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-sky-200">TOTAL</th>

                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-200">LITROS</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-200">MONTO<br/>VALOR<br/>LITRO</th>
                            <th scope="col" className="px-2 py-2 border border-black text-center bg-red-200">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>

                    {supplierWithData.map((item: IPerson, index: number) => 

                        <tr key={index}  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-1 py-1 border border-black bg-yellow-300 text-center">{item.date}</td>

                            <td className="px-1 py-1 border border-black text-center">{Number(item.productionQuantityTomorrow)>0?item.productionQuantityTomorrow:""}</td>
                            <td className="px-1 py-1 border border-black text-right">{Number(item.productionPriceTomorrow)>0?"S/ " + Number(item.productionPriceTomorrow).toFixed(1):""}</td>
                            <td className="px-1 py-1 border border-black text-right">{Number(item.productionTotalTomorrow)>0?"S/ " + Number(item.productionTotalTomorrow).toFixed(1):""}</td>

                            <td className="px-1 py-1 border border-black text-center text-red-600">{Number(item.gloriaShipmentQuantityTomorrow)>0?item.gloriaShipmentQuantityTomorrow:""}</td>
                            <td className="px-1 py-1 border border-black text-right text-red-600">{Number(item.gloriaShipmentPriceTomorrow)>0?"S/ " + Number(item.gloriaShipmentPriceTomorrow).toFixed(1):""}</td>
                            <td className="px-1 py-1 border border-black text-right text-red-600">{Number(item.gloriaShipmentTotalTomorrow)>0?"S/ " + Number(item.gloriaShipmentTotalTomorrow).toFixed(1):""}</td>

                            <td className="px-1 py-1 border border-black text-center ">{Number(item.productionQuantityAfternoon)>0?item.productionQuantityAfternoon:""}</td>
                            <td className="px-1 py-1 border border-black text-right ">{Number(item.productionPriceAfternoon)>0?"S/ " + Number(item.productionPriceAfternoon).toFixed(1):""}</td>
                            <td className="px-1 py-1 border border-black text-right ">{Number(item.productionTotalAfternoon)>0?"S/ " + Number(item.productionTotalAfternoon).toFixed(1):""}</td>


                            <td className="px-1 py-1 border border-black text-center  text-red-600">{Number(item.gloriaShipmentQuantityAfternoon)>0?item.gloriaShipmentQuantityAfternoon:""}</td>
                            <td className="px-1 py-1 border border-black text-right  text-red-600">{Number(item.gloriaShipmentPriceAfternoon)>0?"S/ " + Number(item.gloriaShipmentPriceAfternoon).toFixed(1):""}</td>
                            <td className="px-1 py-1 border border-black text-right  text-red-600">{Number(item.gloriaShipmentTotalAfternoon)>0?"S/ " + Number(item.gloriaShipmentTotalAfternoon).toFixed(1):""}</td>
                        </tr>
                        )}
                       
                    </tbody>
                    <tfoot>
                        <tr className="">
                            <td className="px-1 py-1 border border-black bg-gray-300 text-center font-semibold">TOTAL</td>

                            <td className="px-1 py-1 border border-black bg-yellow-300 text-center">
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionQuantityTomorrow!), 0))}
                            </td>
                            <td className="px-1 py-1 border border-black bg-yellow-300"></td>
                            <td className="px-1 py-1 border border-black bg-yellow-300 text-right">
                            S/ {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionTotalTomorrow!), 0)).toFixed(1)}
                            </td>
                            <td className="px-1 py-1 border border-black bg-red-300 text-red-800 text-center">
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.gloriaShipmentQuantityTomorrow!), 0))}
                            </td>
                            <td className="px-1 py-1 border border-black bg-red-300 text-red-800"></td>
                            <td className="px-1 py-1 border border-black bg-red-300 text-red-800 text-right">
                            S/ {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.gloriaShipmentTotalTomorrow!), 0)).toFixed(1)}
                            </td>
                            <td className="px-1 py-1 border border-black bg-sky-300 text-center">
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionQuantityAfternoon!), 0))}
                            </td>
                            <td className="px-1 py-1 border border-black bg-sky-300"></td>
                            <td className="px-1 py-1 border border-black bg-sky-300 text-right">
                            S/ {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionTotalAfternoon!), 0)).toFixed(1)}
                            </td>
                            <td className="px-1 py-1 border border-black bg-red-300 text-red-800 text-center">
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.gloriaShipmentQuantityAfternoon!), 0))}
                            </td>
                            <td className="px-1 py-1 border border-black bg-red-300 text-red-800"></td>
                            <td className="px-1 py-1 border border-black bg-red-300 text-red-800 text-right">
                            S/ {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.gloriaShipmentTotalAfternoon!), 0)).toFixed(1)}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="px-1 py-1 border border-black bg-gray-300 text-center font-semibold">LITROS TOTALES</td>
                            <td className="px-1 py-1 border border-black bg-yellow-300 text-center" colSpan={6}>
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionQuantityTomorrow + currentValue.gloriaShipmentQuantityTomorrow), 0))}
                            </td>
                            <td className="px-1 py-1 border border-black bg-sky-300 text-center" colSpan={6}>
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionQuantityAfternoon + currentValue.gloriaShipmentQuantityAfternoon), 0))}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="px-1 py-1 border border-black bg-gray-300 text-center font-semibold">LITROS QUINCENALES</td>
                            <td className="px-1 py-1 border border-black bg-gray-300 text-center" colSpan={12}>
                            {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionQuantityTomorrow + currentValue.gloriaShipmentQuantityTomorrow + currentValue.productionQuantityAfternoon + currentValue.gloriaShipmentQuantityAfternoon), 0))}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="px-1 py-1 border border-black bg-gray-300 text-center font-semibold">PAGO FINAL</td>

                            <td className="px-1 py-1 border border-black bg-gray-300 text-center" colSpan={12}>
                            S/ {Number(supplierWithData.reduce((previousValue:any, currentValue:any) => previousValue + Number(currentValue.productionTotalTomorrow + currentValue.gloriaShipmentTotalTomorrow + currentValue.productionTotalAfternoon + currentValue.gloriaShipmentTotalAfternoon), 0)).toFixed(1)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </>
    )
}

export default FortnightSupplierList