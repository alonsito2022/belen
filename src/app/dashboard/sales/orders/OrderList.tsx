"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IOperation, ICheeseSupplier, ISaleCenter } from '@/app/types';
import { toast } from "react-toastify";
import { initFlowbite} from "flowbite";
import {getWeekDayInSpanish} from '@/libs/functions'

const initialStateBalanceSummary = {

        summaryTotalSale: 0,
        summaryTotalNet: 0,
        summaryTotalPreviousBalance: 0,
        summaryCash: 0,
        summaryDeposit: 0,
        summarySubtraction: 0,
}

function OrderList({outputs, setOutputs, output, setOutput, fetchOutputs, modal, setFilterObj, filterObj, salesCenter, getOutputById, annulSaleById, modalReview, modalPayment, paymentObj, setPaymentObj}: any) {
    
    const [balanceSummary, setBalanceSummary] = useState(initialStateBalanceSummary);

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        
        setFilterObj({...filterObj, [name]: value});
    }

    const [inputTimeout, setInputTimeout] = useState<any>(null)

    useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, operationObj: IOperation) => {

        let updatedList = outputs.map((item:IOperation) => {
            if (item.id == operationObj.id){
                if (inputTimeout) clearTimeout(inputTimeout)
                setInputTimeout(
                    setTimeout(() => {
                        saveSalePayment(operationObj.id, name, value)
                    }, 1000)
                )
                return {...item, [name]: value}; //gets everything that was already in item, and updates "done"
            }
            return item; // else return unmodified item 
        });
        setOutputs(updatedList);
    
    }

    function formatarFecha(fechaString:string) {
        const meses = [
          "ene", "feb", "mar", "abr", "may", "jun",
          "jul", "ago", "sep", "oct", "nov", "dic"
        ];
      
        const fecha = new Date(`${fechaString}T00:00:00-05:00`);
        // fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
      
        return `${dia}-${mes}`;
      }

    async function saveSalePayment(id:number, name:string, value:string){
        let operationObj = outputs.find((s:IOperation) => s.id === id)
        let cash:number = name=="cash"?value:operationObj.cash;
        let deposit:number = name=="deposit"?value:operationObj.deposit;

        let queryFetch = `
            mutation{
                saveSalePayment(
                    operationId:${operationObj.id}, cash:${cash}, deposit:${deposit},
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
            toast(data.data.saveSalePayment.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchOutputs();
            initFlowbite();

        }).catch(e=>console.log(e));
    }

    const handleRemoveItem = async (indexToRemove: number) => {
        let queryFetch = `
            mutation{
                deletePayment(
                    cashFlowId:${indexToRemove},
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
            toast(data.data.deletePayment.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchOutputs();
            initFlowbite();

        }).catch(e=>console.log(e));
        
    };

    useEffect(() => {
        const sumValues = outputs.reduce((acc: any, week: any) => {
            acc.totalPreviousBalance += Number(week.totalPreviousBalance) || 0;
            acc.totalNet += Number(week.totalNet) || 0;
            acc.cash += Number(week.cash) || 0;
            acc.deposit += Number(week.deposit) || 0;
            acc.subtraction += Number(week.subtraction) || 0;
            acc.totalSale += Number(week.totalSale) || 0;
            return acc;
        }, { totalPreviousBalance: 0, totalNet: 0, cash: 0, deposit:0, subtraction:0, totalSale: 0 });
          
        setBalanceSummary({...balanceSummary, 
            summaryTotalSale: sumValues.totalSale!,
            summaryTotalPreviousBalance: sumValues.totalPreviousBalance!,
            summaryTotalNet: sumValues.totalNet!,
            summaryCash: sumValues.cash!,
            summaryDeposit: sumValues.deposit!,
            summarySubtraction: sumValues.subtraction!,
        })

    }, [outputs]);

    let tbodies; 
    tbodies= outputs.map((operationData: IOperation, index: number) => {
        const maxRows = Math.max(operationData?.cashflowSet!.length || 1);
        const rows: JSX.Element[] = [];
        for (let i = 0; i < maxRows; i++) {
            const cashFlow = operationData?.cashflowSet![i];

            const formattedDate = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}> {operationData.outputType==="V"?(operationData.formattedDate?.toString().replace("Dec", "Dic").replace("Jan", "Ene")):null}</td>) : null;
            const isFictitious = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}> {operationData.outputType==="V"?(operationData.isFictitious?"FICTICIA":"NORMAL"):null}</td>) : null;
            const outputType = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right font-bold text-black" rowSpan={maxRows}> {operationData.outputType==="V"?"VENTA":"DEUDA"}</td>) : null;
            const saleCenterName = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}> {operationData.outputType==="V"?(operationData.client?.saleCenter?.name):null}</td>) : null;
            const clientName = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right font-bold uppercase text-black" rowSpan={maxRows}> {operationData.client?.names}</td>) : null;
            const documentTypeReadable = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}> {operationData.outputType==="V"?(operationData.documentTypeReadable):null}</td>) : null;
            const documentNumber = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}> {operationData.documentNumber}</td>) : null;
            const baseCost = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + operationData.baseCost):null}</td>) : null;
            const igvCost = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + operationData.igvCost):null}</td>) : null;
            const totalSale = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + operationData.totalSale):null}</td>) : null;
            const previousBalance = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + operationData.previousBalance):null}</td>) : null;
            const totalNet = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + operationData.totalNet):null}</td>) : null;
            const payedInCash = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + Number(operationData.payedInCash).toFixed(2)):null}</td>) : null;
            const payedInDeposit = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>{operationData.outputType==="V"?("S/" + Number(operationData.payedInDeposit)):null}</td>) : null;
            const subtraction = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right font-bold text-black" rowSpan={maxRows}>S/ {operationData.subtraction}</td>) : null;
            const actions = i === 0 ? (<td className="px-2 py-2 border border-gray-600 text-right text-black" rowSpan={maxRows}>
                <div className="flex gap-1 justify-center">
                    {operationData.outputType==="V"?(
                    <button 
                        type="button" 
                        className="btn-blue px-3 py-2"
                        onClick={()=>{
                            modalReview.show();
                            getOutputById(operationData.id);
                        }}
                    >Ver</button>):null}

                    {Number(operationData.paymentRemaining)>0?(<button 
                        type="button" 
                        className="btn-green px-3 py-2"
                        onClick={()=>{
                            modalPayment.show();
                            setPaymentObj( (prev : any) => ({...prev, operationId: operationData?.id, debt: operationData.subtraction}))
                        }}
                    >Pagar</button>):null}

                    {operationData.outputType==="V"&&!cashFlow?(
                    <button 
                        type="button"
                        className="btn-red px-3 py-2"
                        onClick={()=>{
                            if (window.confirm("Realmente desea anular la venta?"))
                                annulSaleById(operationData.id);
                        }}
                    >Anular</button>
                    ):null}
                </div>

            </td>) : null;
            rows.push(
                <tr key={i} className={Number(operationData.totalSale)<=Number(operationData.cash!)+Number(operationData.deposit!)?"bg-green-300":"bg-red-200 border-b dark:bg-gray-800 dark:border-gray-700"}>
                    {formattedDate}
                    {isFictitious}
                    {outputType}
                    {saleCenterName}
                    {clientName}
                    {documentTypeReadable}
                    {documentNumber}
                    {baseCost}
                    {igvCost}
                    {totalSale}
                    {actions}
                    {previousBalance}
                    {totalNet}
                    {payedInCash}
                    {payedInDeposit}
                    {subtraction}
                    <td className="px-1 py-1 border border-gray-600 text-right text-black whitespace-nowrap">{cashFlow?(`${cashFlow?.transactionType=="E"?"EFECTIVO":"DEPOSITO"}`):null}</td>
                    <td className="px-1 py-1 border border-gray-600 text-right text-black whitespace-nowrap">{cashFlow?(`${formatarFecha(cashFlow?.transactionDate!.toString())}`):null}</td>
                    <td className="px-1 py-1 border border-gray-600 text-right text-black whitespace-nowrap">{cashFlow?(`S/ ${Number(cashFlow?.total).toFixed(2)}`):null}</td>
                    <td className="px-1 py-1 border border-gray-600 text-right text-black whitespace-nowrap">

                        {cashFlow?(<button onClick={() => handleRemoveItem(cashFlow?.id)} className=' btn-purple px-2 py-2 border'>
                        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        </button>):null}
                    </td>
                    
                </tr>
            )
        }
        return rows;
    });

    return (
        <>
            <div className="relative overflow-x-auto mt-2">

                <div className="flex items-center justify-around bg-gray-200 p-2 border gap-2 border-gray-200">
                   
                    
                    <div>
                        <select name="outputType"  onChange={handleInputChangeWeek} value={filterObj.outputType} className="form-control">
                            
                                <option value="V">VER VENTAS</option>
                                <option value="D">VER DEUDAS</option>
                            
                        </select>

                    </div>
                 
                    {filterObj.outputType==="V"?(
                        <>
                        <div className="">
                            <input 
                                type="date" 
                                name="startDate" 
                                value={filterObj.startDate} 
                                onChange={handleInputChangeWeek} 
                                onFocus={(e) => e.target.select()} 
                                className="form-control"
                            />
                        </div>
                    
                        <div className="">
                            <input 
                                type="date" 
                                name="endDate" 
                                value={filterObj.endDate} 
                                onChange={handleInputChangeWeek} 
                                onFocus={(e) => e.target.select()} 
                                className="form-control"
                            />
                        </div>


                        <div>
                            <select name="searchSaleCenterId"  onChange={handleInputChangeWeek} value={output.searchSaleCenterId} className="form-control">
                                <option value={0}>ELEGIR CENTRO DE VENTA</option>
                                {salesCenter.map((o: ISaleCenter,k: number)=>(
                                    <option key={k} value={o.id}>{o.name}</option>
                                ))}
                            </select>

                        </div>
                        
                        </>
                    ):null}

                    <button  onClick={(e)=>{
                            modal.show();
                            document.getElementById("modal-title")!.innerHTML = "Nueva venta";
                            document.getElementById("btn-save-product")!.innerHTML = "Guardar venta";
                            setOutput({...output, 
                                id: 0,
                                saleCenterId: 0,
                                clientId: 0,
                                supplierId: 0,
                                // userId: 0,
                                productTariffId: 0,
                                quantity: 0,
                                price: 0,
                                productName: "",
                                discount: 0,
                
                                suppliers: [],
                                productTariffs: [],
                                quantities: [],
                                prices: [],
                                discounts: [],
                                productNames: [],
                                supplierNames: [],
                                
                                baseCost: 0,
                                igvCost: 0,  
                                totalSale: 0,

                                totalPreviousBalance: 0,
                                totalNet: 0,
                                cash: 0,
                                deposit: 0,
                                subtraction: 0,

                                hasIgv: false,
                                isFictitious: false,
                                observation: "",
                                documentType: "01",
                                documentNumber: "",


                            });
                        
                            
                    }} className="btn-green border  px-5 py-2.5" type="button">
                    Crear pedido
                    </button>

                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="text-center font-bold">
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300" colSpan={10}>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600" rowSpan={2}>ACCIONES</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" rowSpan={2}>SALDO ANTERIOR</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" rowSpan={2}>TOTAL</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" colSpan={2}>A CUENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" rowSpan={2}>RESTA</td>
                            {/* <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" colSpan={2}>PAGADO</td> */}
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-purple-300" colSpan={4}  rowSpan={2}>DETALLE DE PAGOS</td>
                            
                        </tr>
                        <tr>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">FECHA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">TIPO<br/>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">TIPO<br/>SALIDA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">CENTRO DE<br/>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">CLIENTE</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">TIP DOC</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">NUM DOC</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">BASE</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">IGV</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">TOTAL VENTA</td>

                            
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-lime-500 w-24">EFECTIVO</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-orange-400 w-24">DEPO</td>
                            
                            {/* <td scope="col" className="px-6 py-4 border border-gray-600 bg-lime-500 w-24">Cash</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-orange-400 w-24">Deposit</td> */}
                            
                        </tr>
                    </thead>
                    <tbody>
                    {tbodies}
                    {/* {outputs.map((item: IOperation) => 

                        <tr key={item.id} className={Number(item.totalSale)<=Number(item.cash!)+Number(item.deposit!)?"bg-green-300":"bg-red-500 border-b dark:bg-gray-800 dark:border-gray-700"}>

                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.formattedDate?.toString().replace("Dec", "Dic").replace("Jan", "Ene")}</td>
                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.isFictitious?"FICTICIA":"NORMAL"}</td>
                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.client?.saleCenter?.name}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.client?.names}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.documentTypeReadable}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.documentNumber}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold whitespace-nowrap">S/ {item.baseCost}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold whitespace-nowrap">S/ {item.igvCost}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold whitespace-nowrap">S/ {item.totalSale}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.previousBalance}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.totalNet}</td>
                            
                            {/* <td className="px-2 py-2 border border-gray-600 text-black">
                                <input 
                                    type="number" 
                                    name='cash' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e, item)} 
                                    value={item.cash} 
                                    className='form-control text-base' 
                                />
                            </td> 
                            <td className="px-2 py-2 border border-gray-600 text-black">
                                <input 
                                    type="number" 
                                    name='deposit' 
                                    onFocus={(e) => e.target.select()} 
                                    onChange={e=>handleInputChange(e, item)} 
                                    value={item.deposit}
                                    className='form-control text-base' 
                                />
                            </td> */}
                            {/* <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.payedInCash}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.payedInDeposit}</td>

                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold">S/ {item.subtraction}</td> */}

                            {/* <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.payedInCash}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.payedInDeposit}</td> */}

                            {/* <td className="px-2 py-2 border border-gray-600">
                                
                                <div className="flex gap-1">
                                    
                                        <button 
                                            type="button" 
                                            className="btn-blue px-2 pt-1"
                                            onClick={()=>{
                                                modalReview.show();
                                                getOutputById(item.id);
                                            }}
                                        >Ver Detalles</button>
                                    
                                        <button 
                                            type="button" 
                                            className="btn-green px-2 pt-1"
                                            onClick={()=>{
                                                modalPayment.show();
                                                setPaymentObj( (prev : any) => ({...prev, operationId: item?.id}))
                                            }}
                                        >Pagar</button>
                                      
                                        <button 
                                            type="button"
                                            className="btn-red px-2 pt-1"
                                            onClick={()=>{
                                                if (window.confirm("Realmente desea anular la venta?"))
                                                    annulSaleById(item.id);
                                            }}
                                        >Anular</button>
                                        
                                </div>
                            </td>
                        </tr>
                    )}*/  }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="border">TOTALES</td>
                            <td className="border" colSpan={8}></td>
                            <td className="px-2 border text-right font-bold text-black">{filterObj.outputType==="V"?("S/ " + Number(balanceSummary.summaryTotalSale).toFixed(2)):null}</td>
                            <td className="border"></td>
                            <td className="px-2 border text-right font-bold text-black">{filterObj.outputType==="V"?("S/ " + Number(balanceSummary.summaryTotalPreviousBalance).toFixed(2)):null}</td>
                            <td className="px-2 border text-right font-bold text-black">{filterObj.outputType==="V"?("S/ " + Number(balanceSummary.summaryTotalNet).toFixed(2)):null}</td>
                            <td className="px-2 border text-right font-bold text-black">{filterObj.outputType==="V"?("S/ " + Number(balanceSummary.summaryCash).toFixed(2)):null}</td>
                            <td className="px-2 border text-right font-bold text-black">{filterObj.outputType==="V"?("S/ " + Number(balanceSummary.summaryDeposit).toFixed(2)):null}</td>
                            <td className="px-2 border text-right font-bold text-black">S/ {Number(balanceSummary.summarySubtraction).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </>
    )
}

export default OrderList