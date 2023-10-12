import { ChangeEvent, MouseEvent, FormEvent ,useState, useEffect } from "react";
import { IPerson, IProductTariff, ISupplierTariff } from '@/app/types';
import { toast } from "react-toastify";
function FortnightGlorySummary({filterObj, setSummaryDailyEntries, summaryDailyEntries, fort}: any) {

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        let valueBaseCost = 0, valueIgvCost = 0, valueGrossCost = 0, valuePaymentUncleMichael = 0, valueTotalNetIncome = 0;
        if(name==="igvCost"){
            valueTotalNetIncome = summaryDailyEntries.grossCost + Number(value) - Number(summaryDailyEntries.paymentUncleMichael);

            setSummaryDailyEntries({...summaryDailyEntries, 
                igvCost: value,
                totalNetIncome: Math.round(valueTotalNetIncome * 100) / 100,
            });
        }
        else if(name==="paymentUncleMichael"){
            valueTotalNetIncome = summaryDailyEntries.grossCost + Number(summaryDailyEntries.igvCost) - Number(value);

            setSummaryDailyEntries({...summaryDailyEntries, 
                paymentUncleMichael: value,
                totalNetIncome: Math.round(valueTotalNetIncome * 100) / 100,
            });
        }
        else if(name==="quantityLiter"){
           
            valueBaseCost = summaryDailyEntries.paymentCostOfGloriaPerLiter * Number(value);
            valueGrossCost = valueBaseCost - summaryDailyEntries.sumCostTotalTomorrowAndAfternoon;
            valueIgvCost = valueBaseCost * 0.18;
            valuePaymentUncleMichael = valueIgvCost;
            valueTotalNetIncome = valueGrossCost + valueIgvCost - valuePaymentUncleMichael;

            setSummaryDailyEntries({...summaryDailyEntries, 
                quantityLiter: value,
                baseCost: Math.round(valueBaseCost * 100) / 100,
                grossCost: Math.round(valueGrossCost * 100) / 100,
                igvCost: Math.round(valueIgvCost * 100) / 100,
                paymentUncleMichael: Math.round(valuePaymentUncleMichael * 100) / 100,
                totalNetIncome: Math.round(valueTotalNetIncome * 100) / 100,
            });
        }else if (name=="baseCost"){
            valueGrossCost = Number(value) - summaryDailyEntries.sumCostTotalTomorrowAndAfternoon;
            valueIgvCost = Number(value) * 0.18;
            valuePaymentUncleMichael = valueIgvCost;
            valueTotalNetIncome = valueGrossCost + valueIgvCost - valuePaymentUncleMichael;

            setSummaryDailyEntries({...summaryDailyEntries, 
                baseCost: value,
                grossCost: Math.round(valueGrossCost * 100) / 100,
                igvCost: Math.round(valueIgvCost * 100) / 100,
                paymentUncleMichael: Math.round(valuePaymentUncleMichael * 100) / 100,
                totalNetIncome: Math.round(valueTotalNetIncome * 100) / 100,
            });
        
        }else if (name=="documentNumber"){

            setSummaryDailyEntries({...summaryDailyEntries, 
                documentNumber: value
            });
        }
        

    

        // setSummaryDailyEntries(prev => ({...prev, paymentCostOfGloriaPerLiter: data.data.clientTariffById.salePrice1}));
    }

    const handleButtonOnClick = async (e: MouseEvent<HTMLButtonElement>) => {
        
        if(fort>0 ){
            console.log('CLIC')
            if(Number(summaryDailyEntries.quantityLiter)>0)
                saveGloriaInvoice();
        }
    }

    async function saveGloriaInvoice(){
        let queryFetch: String = "";
        
        queryFetch = `
            mutation{
                saveGloriaInvoiceOfTheFortnight(
                    warehouseId:${filterObj.warehouseId}, productTariffId: ${filterObj.productTariffId}, 
                    quantityLiter:${Number(summaryDailyEntries.quantityLiter)}, 
                    paymentCostOfGloriaPerLiter:${Number(summaryDailyEntries.paymentCostOfGloriaPerLiter)}, 
                    baseCost:${Number(summaryDailyEntries.baseCost)}, 
                    igvCost:${Number(summaryDailyEntries.igvCost)}, 
                    paymentUncleMichael:${Number(summaryDailyEntries.paymentUncleMichael)}, 
                    fortnightValue:${fort},
                    documentNumber:"${summaryDailyEntries.documentNumber}"

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
            toast(data.data.saveGloriaInvoiceOfTheFortnight.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })

        }).catch(e=>console.log(e))
        
    }
    

    return (
        <>

            <div className="relative overflow-x-auto p-4 mx-auto max-w-5xl bg-white">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white">
                    CUADRO RESUMEN QUINCENA
                </caption>

                    <tbody>
                        
                        <tr className="bg-blue-800 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium " rowSpan={5}>

                                FACTURA GLORIA<br/><br/>
                                <input type='text' name='documentNumber' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} value={summaryDailyEntries.documentNumber} 
                                    placeholder="FK01-00355105"
                                    className=' w-60 px-1 py-1 text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />

                            </td>
                            <td className="align-middle px-4 py-1 border-x font-medium">LITROS TOTALES</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">
                                <input type='number' name='quantityLiter' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} value={summaryDailyEntries.quantityLiter} 
                                    className='w-36 px-1 py-1 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                        </tr>
                        
                        <tr className="bg-blue-800 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium">PRECIO POR LITRO</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">{summaryDailyEntries.paymentCostOfGloriaPerLiter}</td>
                        </tr>
                        
                        
                        <tr className="bg-blue-800 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium">MONTO SIN IGV</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">
                                <input type='number' name='baseCost' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} value={summaryDailyEntries.baseCost} 
                                    className='w-36 px-1 py-1 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                        </tr>
                        
                        
                        <tr className="bg-blue-800 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium">IGV</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">
                                <input type='number' name='igvCost' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} value={summaryDailyEntries.igvCost} 
                                    className='w-36 px-1 py-1 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                        </tr>
                        
                        <tr className="bg-blue-800 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium">IMPORTE TOTAL</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">
                                {summaryDailyEntries.baseCost + summaryDailyEntries.igvCost} 
                            </td>
                        </tr>
                        
                        <tr className=" bg-gray-500 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium" rowSpan={2}>DATOS BELEN</td>
                            <td className="align-middle px-4 py-1 border-x font-medium">LITROS TOTALES MAÑANA Y TARDE</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">{summaryDailyEntries.sumQuantityTotalTomorrowAndAfternoon}</td>
                        </tr>
                        
                        <tr className=" bg-gray-500 text-white">
                            <td className="align-middle px-4 py-1 border-x font-medium">PAGO PROVEEDORES</td>
                            <td className="align-middle px-4 py-1 border-x text-lg text-right">{summaryDailyEntries.sumCostTotalTomorrowAndAfternoon}</td>
                        </tr>

                        
                    </tbody>
                
                </table>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white">
                    CUADRO GANANCIA ACOPIO GLORIA
                </caption>

                    <tbody>
                        
                        <tr className=" bg-gray-100 text-black">
                            <td className="align-middle px-4 py-1 border font-medium text-gray-900">BRUTO</td>
                            <td className="align-middle px-4 py-1 border text-lg text-right">{summaryDailyEntries.grossCost}</td>
                        </tr>
                        
                        <tr className=" bg-gray-100 text-black">
                            <td className="align-middle px-4 py-1 border font-medium text-gray-900">IGV</td>
                            <td className="align-middle px-4 py-1 border text-lg text-right">
                                {summaryDailyEntries.igvCost} 
                            </td>
                        </tr>
                        
                        
                        <tr className=" bg-gray-100 text-black">
                            <td className="align-middle px-4 py-1 border font-medium text-gray-900">PAGO TIO MIGUEL</td>
                            <td className="align-middle px-4 py-1 border text-lg text-right">
                                <input type='number' name='paymentUncleMichael' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e)} value={summaryDailyEntries.paymentUncleMichael} 
                                    className='w-36 px-1 py-1 text-right text-lg text-gray-900 border border-gray-800 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' />
                            </td>
                        </tr>
                        
                        
                        <tr className=" bg-gray-100 text-black">
                            <td className="align-middle px-4 py-1 border font-medium text-gray-900">GANANCIA NETA</td>
                            <td className="align-middle px-4 py-1 border text-lg text-right">{Number(summaryDailyEntries.totalNetIncome).toFixed(2)}</td>
                        </tr>

                        
                    </tbody>
                
                </table>

                <div className="relative overflow-hidden bg-white rounded-b-lg shadow-md">
                    <nav className="flex flex-row items-center justify-between p-4"
                        aria-label="Table navigation">
                        <button type="button" onClick={handleButtonOnClick}
                        className="px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Guardar cambios
                        </button>
                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400"></span>
                        <span className="font-semibold text-gray-900 dark:text-white"></span>
                        </p>
                        <p className="text-sm">
                        <span className="font-normal text-gray-500 dark:text-gray-400"></span>
                        <span className="font-semibold text-gray-900 dark:text-white"></span>
                        </p>
                    </nav>
                </div>
            </div>
            
        </>
    )
}

export default FortnightGlorySummary