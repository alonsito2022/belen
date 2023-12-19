"use client";
import { ChangeEvent ,useState, useEffect } from "react";
import { IOperation, ICheeseSupplier, ISaleCenter } from '@/app/types';
import { toast } from "react-toastify";

function OrderList({outputs, setOutputs, output, setOutput, fetchOutputs, modal, setFilterObj, filterObj, salesCenter, getOutputById, annulSaleById, modalReview, obtenerFechaInicioFin, fechaInicio, fechaFin}: any) {
        
    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week")
            obtenerFechaInicioFin (value)
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

        }).catch(e=>console.log(e));
    }

    return (
        <>
            <div className="relative overflow-x-auto mt-2">

                <div className="flex items-center justify-around bg-gray-200 p-2 border gap-2 border-gray-200">
                   
                        <div className="">
                            <input type="week" name="week" value={filterObj.week } onChange={handleInputChangeWeek} className="form-control" />
                        </div>

                        <div className="">
                        {fechaInicio && fechaFin && (
                            <p className=" text-2xl font-thin">{`Del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`}</p>
                        )}
                        </div>
                   
                    
                 
                    <div className="">
                        <input 
                            type="date" 
                            name="searchDate" 
                            value={filterObj.searchDate} 
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
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300" colSpan={6}>VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" rowSpan={2}>SALDO ANTERIOR</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" rowSpan={2}>TOTAL</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" colSpan={2}>A CUENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-yellow-300" rowSpan={2}>RESTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600" rowSpan={2}>ACCIONES</td>
                        </tr>
                        <tr>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">FECHA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">CENTRO DE VENTA</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">CLIENTE</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">TIP DOC</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300">NUM DOC</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-gray-300 text-black font-bold">TOTAL VENTA</td>

                            
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-lime-500 w-24">EFECTIVO</td>
                            <td scope="col" className="px-6 py-4 border border-gray-600 bg-orange-400 w-24">DEPO</td>
                            
                        </tr>
                    </thead>
                    <tbody>
                    
                    {outputs.map((item: IOperation) => 

                        <tr key={item.id} className={Number(item.totalSale)<=Number(item.cash!)+Number(item.deposit!)?"bg-green-300":"bg-red-500 border-b dark:bg-gray-800 dark:border-gray-700"}>

                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.formattedDate}</td>
                            <td className="px-2 py-2 border border-gray-600 font-medium text-gray-900 whitespace-nowrap text-center dark:text-white">{item.client?.saleCenter?.name}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.client?.names}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.documentTypeReadable}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">{item.documentNumber}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black font-bold">S/ {item.totalSale}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.previousBalance}</td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.totalNet}</td>
                            <td className="px-2 py-2 border border-gray-600 text-black">
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
                            </td>
                            <td className="px-2 py-2 border border-gray-600 text-right text-black">S/ {item.subtraction}</td>
                            <td className="px-2 py-2 border border-gray-600">
                                <button 
                                    id={"dropdownDefaultButton" + item.id}
                                    data-dropdown-toggle={"dropdown" + item.id} 
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    type="button"
                                >Acciones
                                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>

                                <div id={"dropdown" + item.id} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby={"dropdownDefaultButton" + item.id}>
                                        <li>
                                            <button 
                                                type="button" 
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={()=>{
                                                    modalReview.show();
                                                    getOutputById(item.id);
                                                }}
                                            >Ver detalles</button>
                                        </li>
                                        <li>
                                        <button 
                                            type="button"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={()=>{
                                                if (window.confirm("Realmente desea anular la venta?"))
                                                    annulSaleById(item.id);
                                            }}
                                        >Anular</button>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

            </div>
        </>
    )
}

export default OrderList