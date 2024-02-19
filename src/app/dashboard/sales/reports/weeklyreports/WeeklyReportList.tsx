"use client";
import { ChangeEvent ,useState, FormEvent, useEffect } from "react";
import { IBalanceByWeek, ISaleOfWeekDay, ICheeseSupplier, IPerson, IDateAndWeekday } from '@/app/types';
import { toast } from "react-toastify";
import {obtenerSemanaActual, traducirFechaAlEspanol} from '@/libs/functions'


function WeeklyReportList({suppliers, setFilterObj, filterObj, obtenerFechaInicioFin, fechaInicio, fechaFin, balancesByWeek, setBalancesByWeek, fetchBalancesByWeek} : any) {
    
    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week") obtenerFechaInicioFin (value);
        setFilterObj({...filterObj, [name]: value});
    }

    const [inputTimeout, setInputTimeout] = useState<any>(null)

    useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

    async function saveWeekBalance(productTariffId:number, totalEntries: Number, totalRemnants: number, totalLosses: number, totalReturns: number, totalSales: number, totalGeneral: number){
        let queryFetch: String = "";
        queryFetch = `
            mutation{
                saveWeekBalance(
                    userId: ${filterObj.userId}, 
                    supplierId: ${filterObj.supplierId}, 
                    productTariffId: ${productTariffId}, 
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))},
                    entries:${Number(totalEntries)},
                    remnants:${Number(totalRemnants)},
                    losses:${Number(totalLosses)},
                    returns:${Number(totalReturns)},
                    sales:${Number(totalSales)},
                    general:${Number(totalGeneral)},
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
            toast(data.data.saveWeekBalance.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchBalancesByWeek()

        }).catch(e=>console.log(e))
    }

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, weekItem: IBalanceByWeek) => {

        if(filterObj.supplierId > 0){
            

            let updatedList = balancesByWeek?.map((item:IBalanceByWeek) => {
                if (item.productTariffId === weekItem.productTariffId){
                    let totalLosses = 0;
                    let totalReturns = 0;

                    let totalEntries = weekItem.totalEntries!;
                    let totalRemnants = weekItem.totalRemnants!;
                    let totalSales = weekItem.totalSales!;
                    let totalGeneral = 0;
                    if(name==="totalLosses"){
                        totalLosses = Number(value);
                        totalReturns = weekItem.totalReturns!;
                    }
                    if(name==="totalReturns"){
                        totalReturns = Number(value);
                        totalLosses = weekItem.totalLosses!;
                    }
                    totalGeneral = totalEntries + totalRemnants - totalLosses - totalReturns - totalSales;
                    if (inputTimeout) clearTimeout(inputTimeout)
                    setInputTimeout(
                        setTimeout(() => {
                            saveWeekBalance(weekItem.productTariffId!, totalEntries, totalRemnants, totalLosses, totalReturns, totalSales, totalGeneral)
                        }, 1000)
                    )
                    return {...item, totalLosses: totalLosses, totalReturns: totalReturns, totalGeneral: totalGeneral};
                }
                return item; // else return unmodified item 
            });
            setBalancesByWeek(updatedList);


        }
        else{
            toast("Eliga proveedor", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
        
    
    }
    let tbodies; 
    const rows: JSX.Element[] = [];

    tbodies= balancesByWeek?.map((weekData: IBalanceByWeek, index: number) => {

        
        const productName = weekData.productName;
        const totalEntries = weekData.totalEntries;
        const totalRemnants = weekData.totalRemnants;
        const totalLosses = weekData.totalLosses;
        const totalReturns = weekData.totalReturns;
        const totalSales = weekData.totalSales;
        const totalGeneral = weekData.totalGeneral;
                       
        rows.push(
            <tr key={index}>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-base uppercase font-semibold text-center">{productName}</td>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap bg-lime-200 text-black text-base font-semibold text-center">{totalEntries}</td>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap bg-lime-200 text-black text-base font-semibold text-center">{totalRemnants}</td>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap bg-red-200 text-black text-base font-semibold text-center">
                    {(filterObj.supplierId>0)?(
                        <input 
                            type="text" 
                            className="form-control text-center"
                            name="totalLosses"
                            value={totalLosses} 
                            onFocus={(e) => e.target.select()}
                            onChange={e=>handleInputChange(e, weekData)} 
                        />
                    ):null}
                    
                </td>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap bg-red-200 text-black text-base font-semibold text-center">

                    {(filterObj.supplierId>0)?(
                        <input 
                            type="text" 
                            className="form-control text-center" 
                            name="totalReturns"
                            value={totalReturns} 
                            onFocus={(e) => e.target.select()}
                            onChange={e=>handleInputChange(e, weekData)} 
                        />
                    ):null}
                </td>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap bg-red-200 text-black text-base font-semibold text-center">{totalSales}</td>
                <td className="px-2 py-2 border border-gray-400 whitespace-nowrap bg-blue-200 text-black text-base font-semibold text-center">{totalGeneral}</td>
            </tr>
        )
    
        return rows;
    });
    return (
        <>
            <div className="relative overflow-x-auto mt-2">
                <div className="flex items-center justify-between bg-gray-100 p-2 border gap-2 border-gray-200">
                    <div className="">
                        <input type="week" name="week" value={filterObj.week } onChange={handleInputChangeWeek} className="form-control" />
                    </div>

                    <div className="">
                        {fechaInicio && fechaFin && (
                            <p className=" text-2xl font-thin">{`Del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`}</p>
                        )}
                    </div>
                    <div className="">
                        <select name="supplierId" onChange={handleInputChangeWeek} value={filterObj.supplierId} className=" form-control mb-3">
                            <option value={0}>ELEGIR PROVEEDOR</option>
                            {suppliers.map((o: ICheeseSupplier,k: number)=>(
                                <option key={k} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className="">Reporte semanal</caption>
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-4 border border-gray-400 text-center font-bold text-lg">PRODUCTO</th>
                            
                            <th className="px-6 py-4 border border-gray-400 bg-lime-200 text-center font-bold text-lg">TOTAL<br/>ENTRADAS</th>
                            <th className="px-6 py-4 border border-gray-400 bg-lime-200 text-center font-bold text-lg">TOTAL<br/>SALDO</th>
                            <th className="px-6 py-4 border border-gray-400 bg-red-200 text-center font-bold text-lg">TOTAL<br/>MERMA</th>
                            <th className="px-6 py-4 border border-gray-400 bg-red-200 text-center font-bold text-lg">TOTAL<br/>DEVOLUCION</th>
                            <th className="px-6 py-4 border border-gray-400 bg-red-200 text-center font-bold text-lg">TOTAL<br/>VENTAS</th>
                            <th className="px-6 py-4 border border-gray-400 bg-blue-200 text-center font-bold text-lg">TOTAL<br/>GENERAL</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                    
                </table>
            </div>
            
        </>
    )
}

export default WeeklyReportList