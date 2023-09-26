
import { ChangeEvent, MouseEvent, FormEvent ,useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';
import { toast } from "react-toastify";

function CollectionSummary({filterObj, setSummaryDailyEntries, summaryDailyEntries, fort}: any) {
    
    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setSummaryDailyEntries({...summaryDailyEntries, [name]: value});
    }

    const handleButtonOnClick = async (e: MouseEvent<HTMLButtonElement>) => {
        
        if(fort>0 ){
            console.log('CLIC')
            if(Number(summaryDailyEntries.quantitySendToGloria)>0)
                saveShipmentToGloria();
            if(Number(summaryDailyEntries.quantityFermented)>0)
                saveShipmentToFermentation();
            if(Number(summaryDailyEntries.quantityMoldsProduced)>0)
                saveShipmentToMoldProduction();
        }
    }

    async function saveShipmentToGloria(){
        let queryFetch: String = "";
        
        queryFetch = `
            mutation{
                saveShipmentsToGloria(
                    warehouseId:${filterObj.warehouseId}, productTariffId: ${filterObj.productTariffId}, 
                    collectDate:"${filterObj.collectDate}", 
                    quantitySendToGloria:${Number(summaryDailyEntries.quantitySendToGloria)}, 
                    averageCostPerLiterAfternoon:${Number(summaryDailyEntries.averageCostPerLiterAfternoon)}, 
                    fortnightValue:${fort}
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
            toast(data.data.saveShipmentsToGloria.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

        }).catch(e=>console.log(e))
        
    }
    
    async function saveShipmentToFermentation(){
        let queryFetch: String = "";
        
        queryFetch = `
            mutation{
                saveShipmentsToFermentation(
                    warehouseId:${filterObj.warehouseId}, productTariffId: ${filterObj.productTariffId}, 
                    collectDate:"${filterObj.collectDate}", 
                    quantitySendToFerment:${Number(summaryDailyEntries.quantityFermented)}, 
                    fortnightValue:${fort}
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
            toast(data.data.saveShipmentsToFermentation.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

        }).catch(e=>console.log(e))
        
    }

    async function saveShipmentToMoldProduction(){
        let queryFetch: String = "";
        
        queryFetch = `
            mutation{
                saveShipmentsToMoldProduction(
                    warehouseId:${filterObj.warehouseId}, productTariffId: ${6}, 
                    collectDate:"${filterObj.collectDate}", 
                    quantityOfMoldsProduced:${Number(summaryDailyEntries.quantityMoldsProduced)}, 
                    priceOfMoldProduced:${Number(summaryDailyEntries.costRealPerformancePerLiter)}, 
                    fortnightValue:${fort}
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
            toast(data.data.saveShipmentsToMoldProduction.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

        }).catch(e=>console.log(e))
        
    }
    
    /*useEffect(() => {
        if(Number(summaryDailyEntries.quantitySendToGloria)>0 && fort>0 )
        saveShipmentToGloria()
    }, [summaryDailyEntries.quantitySendToGloria]);

    useEffect(() => {
        if(Number(summaryDailyEntries.quantityFermented)>0 && fort>0 )
        saveShipmentToFermentation()
    }, [summaryDailyEntries.quantityFermented]);

    useEffect(() => {
        if(Number(summaryDailyEntries.quantityMoldsProduced)>0 && fort>0 )
        saveShipmentToMoldProduction()
    }, [summaryDailyEntries.quantityMoldsProduced]);*/
    
    return (
        <>

            <div className="relative overflow-x-auto p-4 mx-auto max-w-5xl bg-white">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    CUADRO PRODUCCION Y RENDIMIENTO
                </caption>

                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-2 py-4 border "></th>
                            <th scope="col" className=" w-48 px-2 py-4 border text-center">LITROS</th>
                            <th scope="col" className=" w-48 px-2 py-4 border text-center">COSTO<br/>REAL</th>
                            <th scope="col" className=" w-48 px-2 py-4 border text-center">PROMEDIO COSTO<br/>POR LITRO</th>
                            {/*<th scope="col" className="w-36 px-2 py-4 border ">COSTO PAGO<br/>DE GLORIA<br/>POR LITRO</th>
                            <th scope="col" className="w-36 px-2 py-4 border rounded-tr-lg">DIFERENCIA<br/>REAL VS GLORIA</th>*/}
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-4 border font-medium text-gray-900 whitespace-nowrap dark:text-white">LECHE TARDE</th>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{Number(summaryDailyEntries.quantityTotalAfternoon).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg text-right">S/ {Number(summaryDailyEntries.costTotalAfternoon).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg text-center">S/ {Number(summaryDailyEntries.averageCostPerLiterAfternoon).toFixed(4)}</td>
                            {/*<td className="align-middle px-2 py-4 border text-lg text-center">{Number(summaryDailyEntries.paymentCostOfGloriaPerLiter).toFixed(4)}</td>
                            <td className="align-middle px-2 py-4 border text-center" colSpan={1}></td>*/}
                        </tr>

                        
                        
                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">ENVÍO A GLORIA</th>
                            <td className="align-middle px-2 py-2 border text-right">
                                <input type='number' name='quantitySendToGloria' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} value={summaryDailyEntries.quantitySendToGloria} 
                                    className='w-36 p-2 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                            <td className="align-middle px-2 py-2 border text-lg text-right">S/ {Number(summaryDailyEntries.costTotalRealToGloria).toFixed(2)}</td>
                            <td className="align-middle px-2 py-2 border text-lg text-center"></td>
                            {/*<td className="align-middle px-2 py-2 border text-lg text-center">{Number(summaryDailyEntries.costTotalEstimatedByGloria).toFixed(2)}</td>
                            <td className="align-middle px-2 py-2 border text-lg text-center">{Number(summaryDailyEntries.realVsGloriaDifference).toFixed(2)}</td>*/}
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-4 border font-medium text-gray-900 whitespace-nowrap dark:text-white">ENFRIADORA TARDE</th>
                            <td className="align-middle px-4 py-4 border text-lg  text-right">{Number(summaryDailyEntries.quantityInChiller).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg  text-right">S/ {Number(summaryDailyEntries.costRealInChiller).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg  text-center" colSpan={1}></td>
                            {/*<td className="align-middle px-2 py-4 border text-lg  text-center" colSpan={2}></td>*/}
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-4 border font-medium text-gray-900 whitespace-nowrap dark:text-white">LECHE MAÑANA</th>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{Number(summaryDailyEntries.quantityTotalTomorrow).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg text-right">S/ {Number(summaryDailyEntries.costTotalTomorrow).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg text-center">S/ {Number(summaryDailyEntries.averageCostPerLiterTomorrow).toFixed(4)}</td>
                            {/*<td className="align-middle px-2 py-4 border text-center" colSpan={1}></td>
                            <td className="align-middle px-2 py-4 border text-lg text-center" colSpan={1}></td>*/}
                        </tr>

                        <tr className=""><td className="px-6 py-3 text-base " colSpan={6}></td></tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-4 border font-medium text-gray-900 whitespace-nowrap dark:text-white">LITROS USADOS</th>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{Number(summaryDailyEntries.litersUsed).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg text-right">S/ {Number(summaryDailyEntries.costTotalLitersUsed).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-lg text-center">S/ {Number(summaryDailyEntries.averageCostPerLiterUsed).toFixed(4)}</td>
                            {/*<td className="align-middle px-2 py-4 border text-lg text-center" colSpan={2}></td>*/}
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">FERMENTO</th>
                            <td className="align-middle px-2 py-2 border text-right">
                                <input type='number' name='quantityFermented' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} 
                                    value={summaryDailyEntries.quantityFermented}
                                    className='w-36 p-2 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                            <td className="align-middle px-2 py-2 border text-center"></td>
                            <td className="align-middle px-2 py-2 border text-center"></td>
                            {/*<td className="align-middle px-2 py-2 border text-center" colSpan={2}></td>*/}
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-4 border font-medium text-gray-900 whitespace-nowrap dark:text-white">LITROS CORTADOS</th>
                            <td className="align-middle px-4 py-4 border text-lg text-right">{Number(summaryDailyEntries.litersCut).toFixed(2)}</td>
                            <td className="align-middle px-2 py-4 border text-center"></td>
                            <td className="align-middle px-2 py-4 border text-center"></td>
                            {/*<td className="align-middle px-2 py-4 border text-center" colSpan={2}></td>*/}
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">CANTIDAD DE MOLDES</th>
                            <td className="align-middle px-2 py-2 border text-right">
                                <input type='number' 
                                name='quantityMoldsProduced' 
                                onFocus={(e) => e.target.select()} 
                                onChange={e=>handleInputChange(e)} 
                                value={summaryDailyEntries.quantityMoldsProduced} 
                                className='w-36 p-2 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                            <td className="align-middle px-2 py-2 border text-center"></td>
                            <td className="align-middle px-2 py-2 border text-center"></td>
                            {/*<td className="align-middle px-2 py-2 border text-center" colSpan={2}></td>*/}
                        </tr>

                        <tr className="bg-white dark:bg-gray-800">
                            <th className="align-middle px-4 py-4 border font-medium text-gray-900 whitespace-nowrap dark:text-white">RENDIMIENTO</th>
                            <td className="align-middle px-4 py-4 border text-lg  text-right">{Number(summaryDailyEntries.performance).toFixed(9)}</td>
                            <td className="align-middle px-2 py-4 border text-lg  text-right">S/ {Number(summaryDailyEntries.costRealPerformancePerLiter)}</td>
                            <td className="align-middle px-2 py-4 border text-center" colSpan={1}></td>
                            {/*<td className="align-middle px-2 py-4 border text-center" colSpan={2}></td>*/}
                        </tr>

                    </tbody>
                
                </table>

                <div className="relative overflow-hidden bg-white rounded-b-lg shadow-md dark:bg-gray-800">
                    <nav className="flex flex-row items-center justify-between p-4"
                        aria-label="Table navigation">
                        <button type="button" onClick={handleButtonOnClick}
                        className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Guardar cambios
                        </button>
                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400">ACIDEZ: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">35</span>
                        </p>
                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400">DENSIDAD: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">18</span>
                        </p>
                    </nav>
                </div>
            </div>
            
        </>
    )
}

export default CollectionSummary