"use client";
import { ChangeEvent ,useState, FormEvent, useEffect } from "react";
import { IEntriesByWeek, ISaleOfWeekDay, IPerson, IEntryAndSaleByWeek } from '@/app/types';
import { toast } from "react-toastify";
import {getShortNameMonth, getWeekDayInSpanish} from '@/libs/functions'

function MonthlySaleList({filterObj, setFilterObj, suppliers, entriesAndSalesByMonth, fetchEntriesAndSalesByMonth, setEntriesAndSalesByMonth} :any) {
    const getFirstMondayOfMonth = (date: Date): Date => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay();
        const daysUntilMonday = (8 - dayOfWeek) % 7;
        firstDayOfMonth.setDate(1 + daysUntilMonday);
        return firstDayOfMonth;
    };
    
    const getLastDayOfMonth = (date: Date): Date => {
        const lastDayOfWeek = getFirstMondayOfMonth(date);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() - 1);
        return lastDayOfWeek
    };
    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }

    useEffect(() => {
        if(filterObj.month.length > 0){

            const [year, month] = filterObj.month.split('-');
            const firstDayOfMonth = getFirstMondayOfMonth(new Date(Number(year), Number(month) - 1));
            const lastDayOfMonth = getLastDayOfMonth(new Date(Number(year), Number(month)));

            setFilterObj({...filterObj, 
                firstDayOfMonth: firstDayOfMonth.toISOString().split('T')[0], 
                lastDayOfMonth: lastDayOfMonth.toISOString().split('T')[0]
            });
        }

    }, [filterObj.month]);

    const [inputTimeout, setInputTimeout] = useState<any>(null)

    useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

    async function saveAccountPayable(startDate:string, total: number, description: string){
        let queryFetch: String = "";
        queryFetch = `
            mutation{
                saveAccountPayable(
                    userId: ${filterObj.userId}, 
                    supplierId: ${filterObj.supplierId}, 
                    year:${Number((filterObj.month.toString().split('-'))[0])}, 
                    month:${Number((filterObj.month.toString().split('-'))[1])}, 
                    day:${Number((startDate.split('-'))[0])},
                    total:${Number(total)},
                    description:"${description}"
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
            toast(data.data.saveAccountPayable.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            fetchEntriesAndSalesByMonth()

        }).catch(e=>console.log(e))
    }

    const handleInputChange = async ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>, weekItem: IEntryAndSaleByWeek) => {

        if(filterObj.supplierId > 0){
            
            // if (inputTimeout) clearTimeout(inputTimeout)
            // setInputTimeout(
            //     setTimeout(() => {
            //         saveAccountPayable(weekItem, Number(value))
            //     }, 1500)
            // )



            let updatedList = entriesAndSalesByMonth.map((item:IEntryAndSaleByWeek) => {
                if (item.startDate === weekItem.startDate){
                    let description = "";
                    let total = 0;
                    if(name==="description"){
                        description = value;
                        total = Number(weekItem.shippingCost);
                    }
                    if(name==="shippingCost"){
                        description = weekItem.description!;
                        total = Number(value);
                    }
                    if (inputTimeout) clearTimeout(inputTimeout)
                    setInputTimeout(
                        setTimeout(() => {
                            saveAccountPayable(weekItem.startDate!, total, description)
                        }, 1000)
                    )
                    return {...item, [name]: value}; //gets everything that was already in item, and updates "done"
                }
                return item; // else return unmodified item 
            });
            setEntriesAndSalesByMonth(updatedList);


        }
        else{
            toast("Eliga proveedor", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
        
    
    }

    let tbodies; 
    tbodies= entriesAndSalesByMonth.map((weekData: IEntryAndSaleByWeek, index: number) => {
        const maxRows = Math.max(weekData.entries!.length, weekData.sales!.length || 1);
        const rows: JSX.Element[] = [];

        for (let i = 0; i < maxRows; i++) {
            const entry = weekData.entries![i];
            const sale = weekData.sales![i];

            const weekIndex = i === 0 ? (<td className="px-2 py-2 border border-gray-400 text-center font-bold text-base uppercase" rowSpan={maxRows +1}>DEL {getShortNameMonth(weekData.startDate!.replace(".",""))}<br/> AL {getShortNameMonth(weekData.endDate!.replace(".",""))}</td>) : null;
            const revenue = i === 0 ? (<td className="px-2 py-2 border border-gray-400 text-center font-bold text-base uppercase" rowSpan={maxRows}></td>) : null;
            const totalDiscount = i === 0 ? (<td className="px-2 py-2 border border-gray-400 text-center font-bold text-base uppercase" rowSpan={maxRows}>
                {((weekData.entries!.length || weekData.sales!.length) && filterObj.supplierId>0)?(
                <textarea 
                    className="form-control text-base font-light" 
                    rows={maxRows} 
                    name="description"
                    value={weekData.description}
                    placeholder="Escriba aqui un comentario"
                    onFocus={(e) => e.target.select()}
                    onChange={e=>handleInputChange(e, weekData)} 
                ></textarea>
                ):null}
            </td>) : null;
            const totalNetProfit = i === 0 ? (<td className="px-2 py-2 border border-gray-400 text-center font-bold text-base uppercase" rowSpan={maxRows }></td>) : null;
            rows.push(
                <tr key={i}>
                    {weekIndex}
                    <td className="px-2 py-2 border border-gray-400">{entry?.formattedDate?.toString().replace("Dec", "Dic").replace("Jan", "Ene")}</td>
                    <td className="px-2 py-2 border border-gray-400 text-center">{entry?.quantity}</td>
                    <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap">{entry?(`S/ ${entry?.price}`):null}</td>
                    <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap">{entry?(`S/ ${entry?.subtotal}`):null}</td>
                    <td className="px-2 py-2 border border-gray-400">{sale?.formattedDate?.toString().replace("Dec", "Dic").replace("Jan", "Ene")}</td>
                    <td className="px-2 py-2 border border-gray-400">{sale?.saleCenterName}</td>
                    <td className="px-2 py-2 border border-gray-400 text-center">{sale?.quantity}</td>
                    <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap">{sale?(`S/ ${sale?.price}`):null}</td>
                    <td className="px-2 py-2 border border-gray-400 text-right whitespace-nowrap">{sale?(`S/ ${sale?.subtotal}`):null}</td>
                    {revenue}
                    {totalDiscount}
                    {totalNetProfit}
                </tr>
            )
        }

        const sumTotalEntries = weekData.entries!.reduce(
            (acumulador, venta: ISaleOfWeekDay) => {
              return {
                totalEntriesQuantity: acumulador.totalEntriesQuantity + venta.quantity!,
                totalEntriesSubtotal: acumulador.totalEntriesSubtotal + venta.subtotal!,
              };
            },
            { totalEntriesQuantity: 0, totalEntriesSubtotal: 0 }
        );

        // const sumTotalEntries = { totalEntriesQuantity: 0, totalEntriesSubtotal: 0 } ;
        // const sumTotalSales = { totalSalesQuantity: 0, totalSalesSubtotal: 0 } ;

        const sumTotalSales = weekData.sales!.reduce(
            (acumulador, venta: ISaleOfWeekDay) => {
              return {
                totalSalesQuantity: acumulador.totalSalesQuantity + venta.quantity!,
                totalSalesSubtotal: acumulador.totalSalesSubtotal + venta.subtotal!,
              };
            },
            { totalSalesQuantity: 0, totalSalesSubtotal: 0 }
        );
        rows.push(
            <tr key={maxRows}>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base">TOTAL</td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-center">{sumTotalEntries?.totalEntriesQuantity}</td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right"></td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right">{sumTotalEntries?(`S/ ${sumTotalEntries?.totalEntriesSubtotal}`):null}</td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base"></td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base"></td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-center">{sumTotalSales?.totalSalesQuantity}</td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right"></td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right">{sumTotalSales?(`S/ ${sumTotalSales?.totalSalesSubtotal}`):null}</td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right">{sumTotalSales?(`S/ ${sumTotalSales?.totalSalesSubtotal - sumTotalEntries?.totalEntriesSubtotal}`):null}</td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right">
                {((weekData.entries!.length || weekData.sales!.length) && filterObj.supplierId>0)?( <input 
                        type="number"
                        className="form-control"
                        name="shippingCost"
                        value={weekData.shippingCost}
                        onFocus={(e) => e.target.select()}
                        onChange={e=>handleInputChange(e, weekData)} 
                        
                    />):null}
                </td>
                <td className="px-2 py-2 border border-gray-400 bg-yellow-100 font-bold text-base text-right">
                {sumTotalSales?(`S/ ${(sumTotalSales?.totalSalesSubtotal - sumTotalEntries?.totalEntriesSubtotal) - Number(weekData.shippingCost)}`):null}
                </td>
            </tr>
        )


        return rows;

    });

    return (
        <>
        <div className="relative overflow-x-auto mt-2">
                <div className="flex items-center justify-around bg-gray-100 p-2 border gap-2 border-gray-200">
                    <div className="">
                        <input type="month" name="month" value={filterObj.month } onChange={handleInputChangeWeek} className="form-control" />
                    </div>

                    <div className="">
                        {filterObj.firstDayOfMonth && filterObj.lastDayOfMonth  && (
                            <p className=" text-2xl font-thin">{`Del ${filterObj.firstDayOfMonth} al ${filterObj.lastDayOfMonth }`}</p>
                        )}
                    </div>
                    <div className="">
                        <select name="supplierId" onChange={handleInputChangeWeek} value={filterObj.supplierId} className=" form-control">
                            <option value={0}>ELEGIR PROVEEDOR</option>
                            {suppliers.map((o: IPerson,k: number)=>(
                                <option key={k} value={o.id}>{o.names}</option>
                            ))}
                        </select>
                    </div>
                </div> 

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg" rowSpan={2}>SEMANA</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg" colSpan={4}>INGRESO</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg" colSpan={5}>VENTAS</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg" rowSpan={2}>GANANCIA</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg" rowSpan={2}>DSCTO ENVIO</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg" rowSpan={2}>GANANCIA<br/>NETA</th>
                        </tr>
                        <tr>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">FECHA</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">CANT</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">PRE</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">SUB</th>

                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">FECHA</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">CENTRO DE VENTA</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">CANT</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">PRE</th>
                            <th className="px-3 py-2 border border-gray-400 text-center font-bold text-lg">SUB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tbodies}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MonthlySaleList