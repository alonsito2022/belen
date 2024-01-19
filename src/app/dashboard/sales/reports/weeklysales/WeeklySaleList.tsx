"use client";
import { ChangeEvent ,useState, FormEvent, useEffect } from "react";
import { IEntriesByWeek, ISaleOfWeekDay, ICheeseSupplier, IPerson, IDateAndWeekday } from '@/app/types';
import { toast } from "react-toastify";
import {getShortNameMonth, getWeekDayInSpanish} from '@/libs/functions'

const initialStateSalesSummary = {
    salesSummaryQuantityOf0: 0,
    salesSummarySubtotalOf0: 0,
    salesSummaryDiscountOf0: 0,
    salesSummarySubtotalWithDiscountOf0: 0,
    salesSummaryQuantityOf1: 0,
    salesSummarySubtotalOf1: 0,
    salesSummaryDiscountOf1: 0,
    salesSummarySubtotalWithDiscountOf1: 0,
    salesSummaryQuantityOf2: 0,
    salesSummarySubtotalOf2: 0,
    salesSummaryDiscountOf2: 0,
    salesSummarySubtotalWithDiscountOf2: 0,
    salesSummaryQuantityOf3: 0,
    salesSummarySubtotalOf3: 0,
    salesSummaryDiscountOf3: 0,
    salesSummarySubtotalWithDiscountOf3: 0,
    salesSummaryQuantityOf4: 0,
    salesSummarySubtotalOf4: 0,
    salesSummaryDiscountOf4: 0,
    salesSummarySubtotalWithDiscountOf4: 0,
    salesSummaryQuantityOf5: 0,
    salesSummarySubtotalOf5: 0,
    salesSummaryDiscountOf5: 0,
    salesSummarySubtotalWithDiscountOf5: 0,
    salesSummaryQuantityOf6: 0,
    salesSummarySubtotalOf6: 0,
    salesSummaryDiscountOf6: 0,
    salesSummarySubtotalWithDiscountOf6: 0,

    sumQuantity: 0,
    sumSubtotalWithDiscount: 0,
}

function WeeklySaleList({suppliers, setFilterObj, filterObj, obtenerFechaInicioFin, fechaInicio, fechaFin, outputsByWeek, datesAndWeekdays} : any) {

    const [salesSummary, setSalesSummary] = useState(initialStateSalesSummary);

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week") obtenerFechaInicioFin (value);
        setFilterObj({...filterObj, [name]: value});
    }

    let theads;
    theads= datesAndWeekdays.map((item: IDateAndWeekday, index: number) => {
        let objWeekday = getWeekDayInSpanish(item.formattedWeekday!);
        let objDate = getShortNameMonth(item.formattedDate!);
        return (
            <th key={index} className="px-6 py-4 border border-gray-400 text-center font-bold text-lg" colSpan={5}>{objWeekday}<br/>{objDate}</th>
        );
    });
    

    let tbodies; 
    tbodies= outputsByWeek.map((weekData: IEntriesByWeek, index: number) => {
        const maxRows = Math.max(weekData.salesOf0!.length, weekData.salesOf1!.length, weekData.salesOf2!.length, weekData.salesOf3!.length, weekData.salesOf4!.length, weekData.salesOf5!.length, weekData.salesOf6!.length || 1);
        const rows: JSX.Element[] = [];
        for (let i = 0; i < maxRows; i++) {
            const salesOf0 = weekData.salesOf0![i];
            const salesOf1 = weekData.salesOf1![i];
            const salesOf2 = weekData.salesOf2![i];
            const salesOf3 = weekData.salesOf3![i];
            const salesOf4 = weekData.salesOf4![i];
            const salesOf5 = weekData.salesOf5![i];
            const salesOf6 = weekData.salesOf6![i];

            const sumTotalQuantity = salesOf0.quantity! + salesOf1.quantity! + salesOf2.quantity! + salesOf3.quantity! + salesOf4.quantity! + salesOf5.quantity! + salesOf6.quantity!;
            const sumTotalPrice = (salesOf0.price! + salesOf1.price! + salesOf2.price! + salesOf3.price! + salesOf4.price! + salesOf5.price! + salesOf6.price!)/7;
            const sumSubtotalWithDiscount = salesOf0.subtotalWithDiscount! + salesOf1.subtotalWithDiscount! + salesOf2.subtotalWithDiscount! + salesOf3.subtotalWithDiscount! + salesOf4.subtotalWithDiscount! + salesOf5.subtotalWithDiscount! + salesOf6.subtotalWithDiscount!;
            const productName = i === 0 ? (<td className="px-2 py-2 border border-gray-400 font-bold text-black text-lg" rowSpan={maxRows}>{weekData.productName!}</td>) : null;


            rows.push(
                <tr key={i}>
                    {productName}
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf0&&Number(salesOf0?.quantity))>0?(`${salesOf0?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf0&&Number(salesOf0?.quantity))>0?(`S/ ${salesOf0?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf0&&Number(salesOf0?.quantity))>0?(`S/ ${salesOf0?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-center font-bold text-red-500">{(salesOf0&&Number(salesOf0?.quantity))>0?(`S/ ${salesOf0?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf0&&Number(salesOf0?.quantity))>0?(`S/ ${salesOf0?.subtotalWithDiscount}`):""}</td>
                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf1&&Number(salesOf1?.quantity))>0?(`${salesOf1?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf1&&Number(salesOf1?.quantity))>0?(`S/ ${salesOf1?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf1&&Number(salesOf1?.quantity))>0?(`S/ ${salesOf1?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-center font-bold text-red-500">{(salesOf1&&Number(salesOf1?.quantity))>0?(`S/ ${salesOf1?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf1&&Number(salesOf1?.quantity))>0?(`S/ ${salesOf1?.subtotalWithDiscount}`):""}</td>

                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf2&&Number(salesOf2?.quantity))>0?(`${salesOf2?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf2&&Number(salesOf2?.quantity))>0?(`S/ ${salesOf2?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf2&&Number(salesOf2?.quantity))>0?(`S/ ${salesOf2?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap  text-center font-bold text-red-500">{(salesOf2&&Number(salesOf2?.quantity))>0?(`S/ ${salesOf2?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf2&&Number(salesOf2?.quantity))>0?(`S/ ${salesOf2?.subtotalWithDiscount}`):""}</td>
                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf3&&Number(salesOf3?.quantity))>0?(`${salesOf3?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf3&&Number(salesOf3?.quantity))>0?(`S/ ${salesOf3?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf3&&Number(salesOf3?.quantity))>0?(`S/ ${salesOf3?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap  text-center font-bold text-red-500">{(salesOf3&&Number(salesOf3?.quantity))>0?(`S/ ${salesOf3?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf3&&Number(salesOf3?.quantity))>0?(`S/ ${salesOf3?.subtotalWithDiscount}`):""}</td>

                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf4&&Number(salesOf4?.quantity))>0?(`${salesOf4?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf4&&Number(salesOf4?.quantity))>0?(`S/ ${salesOf4?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf4&&Number(salesOf4?.quantity))>0?(`S/ ${salesOf4?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap  text-center font-bold text-red-500">{(salesOf4&&Number(salesOf4?.quantity))>0?(`S/ ${salesOf4?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf4&&Number(salesOf4?.quantity))>0?(`S/ ${salesOf4?.subtotalWithDiscount}`):""}</td>

                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf5&&Number(salesOf5?.quantity))>0?(`${salesOf5?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf5&&Number(salesOf5?.quantity))>0?(`S/ ${salesOf5?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf5&&Number(salesOf5?.quantity))>0?(`S/ ${salesOf5?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap  text-center font-bold text-red-500">{(salesOf5&&Number(salesOf5?.quantity))>0?(`S/ ${salesOf5?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf5&&Number(salesOf5?.quantity))>0?(`S/ ${salesOf5?.subtotalWithDiscount}`):""}</td>

                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf6&&Number(salesOf6?.quantity))>0?(`${salesOf6?.quantity}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf6&&Number(salesOf6?.quantity))>0?(`S/ ${salesOf6?.price}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center">{(salesOf6&&Number(salesOf6?.quantity))>0?(`S/ ${salesOf6?.subtotal}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap  text-center font-bold text-red-500">{(salesOf6&&Number(salesOf6?.quantity))>0?(`S/ ${salesOf6?.discount}`):""}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{(salesOf6&&Number(salesOf6?.quantity))>0?(`S/ ${salesOf6?.subtotalWithDiscount}`):""}</td>
                    
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-center font-bold">{sumTotalQuantity}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-right font-bold">S/ {sumTotalPrice}</td>
                    <td className="px-2 py-2 border border-gray-400 whitespace-nowrap text-black text-right font-bold">S/ {sumSubtotalWithDiscount}</td>



                    {/* {totalQuantity} */}
                    {/* {totalSubtotalWithDiscount} */}

                </tr>
            )
        }
        return rows;
    });


    useEffect(() => {
        const sumasPorDia : Array<ISaleOfWeekDay> = Array.from({ length: 7 }, () => ({ quantity: 0, subtotal: 0, discount: 0, subtotalWithDiscount: 0 } ));

        outputsByWeek.forEach((entriesByWeekAndProduct: IEntriesByWeek) => {

            const ventasDelDia0 = entriesByWeekAndProduct.salesOf0 || [];
            if (ventasDelDia0 && Array.isArray(ventasDelDia0)) {

                sumasPorDia[0] = ventasDelDia0.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[0]
              );
            }

            const ventasDelDia1 = entriesByWeekAndProduct.salesOf1 || [];
            if (ventasDelDia1 && Array.isArray(ventasDelDia1)) {

                sumasPorDia[1] = ventasDelDia1.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[1]
              );
            }

            const ventasDelDia2 = entriesByWeekAndProduct.salesOf2 || [];
            if (ventasDelDia2 && Array.isArray(ventasDelDia2)) {

                sumasPorDia[2] = ventasDelDia2.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[2]
              );
            }

            const ventasDelDia3 = entriesByWeekAndProduct.salesOf3 || [];
            if (ventasDelDia3 && Array.isArray(ventasDelDia3)) {

                sumasPorDia[3] = ventasDelDia3.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[3]
              );
            }

            const ventasDelDia4 = entriesByWeekAndProduct.salesOf4 || [];
            if (ventasDelDia4 && Array.isArray(ventasDelDia4)) {

                sumasPorDia[4] = ventasDelDia4.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[4]
              );
            }

            const ventasDelDia5 = entriesByWeekAndProduct.salesOf5 || [];
            if (ventasDelDia5 && Array.isArray(ventasDelDia5)) {

                sumasPorDia[5] = ventasDelDia5.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[5]
              );
            }

            const ventasDelDia6 = entriesByWeekAndProduct.salesOf6 || [];
            if (ventasDelDia6 && Array.isArray(ventasDelDia6)) {

                sumasPorDia[6] = ventasDelDia6.reduce((acumulador: ISaleOfWeekDay, venta: ISaleOfWeekDay) => ({
                    quantity: (acumulador.quantity || 0) + (venta.quantity || 0),
                    discount: (acumulador.discount || 0) + (venta.discount || 0),
                    subtotal: (acumulador.subtotal || 0) + (venta.subtotal || 0),
                    subtotalWithDiscount: (acumulador.subtotalWithDiscount || 0) + (venta.subtotalWithDiscount || 0),
                }),
                sumasPorDia[6]
              );
            }

          
        });
        
        const sumasPorProducto = outputsByWeek.reduce((acumulador:any, producto:IEntriesByWeek) => {
            const ventasDelProducto = Array.from({ length: 7 }, (_, dia) => producto[`salesOf${dia}` as keyof IEntriesByWeek]).flat();
      
            if (ventasDelProducto && Array.isArray(ventasDelProducto)) {
                // console.log("ventasDelProducto", ventasDelProducto);

                const sumaPorProducto = ventasDelProducto.reduce((acumuladorProducto: any, venta: any) => ({
                    quantity: acumuladorProducto.quantity + Number(venta.quantity),
                    subtotalWithDiscount: (acumuladorProducto.subtotalWithDiscount || 0) + Number(venta.subtotalWithDiscount),
                }),
                    { quantity: 0, subtotalWithDiscount: 0 }
                );
                acumulador[producto.productName!] = sumaPorProducto;
                
            }
      
            return acumulador;
        }, {} as Record<string, { quantity: number; subtotalWithDiscount: number }>);
              
        // Inicializar sumas
        let sumQuantity = 0;
        let sumSubtotalWithDiscount = 0;
        // Iterar sobre las ventas y sumar
        for (const producto in sumasPorProducto) {
            if (sumasPorProducto.hasOwnProperty(producto)) {
                sumQuantity += sumasPorProducto[producto].quantity;
                sumSubtotalWithDiscount += sumasPorProducto[producto].subtotalWithDiscount;
            }
        }

        setSalesSummary({...salesSummary, 
            salesSummaryQuantityOf0: sumasPorDia[0].quantity!,
            salesSummarySubtotalOf0: sumasPorDia[0].subtotal!,
            salesSummaryDiscountOf0: sumasPorDia[0].discount!,
            salesSummarySubtotalWithDiscountOf0: sumasPorDia[0].subtotalWithDiscount!,
            salesSummaryQuantityOf1: sumasPorDia[1].quantity!,
            salesSummarySubtotalOf1: sumasPorDia[1].subtotal!,
            salesSummaryDiscountOf1: sumasPorDia[1].discount!,
            salesSummarySubtotalWithDiscountOf1: sumasPorDia[1].subtotalWithDiscount!,
            salesSummaryQuantityOf2: sumasPorDia[2].quantity!,
            salesSummarySubtotalOf2: sumasPorDia[2].subtotal!,
            salesSummaryDiscountOf2: sumasPorDia[2].discount!,
            salesSummarySubtotalWithDiscountOf2: sumasPorDia[2].subtotalWithDiscount!,
            salesSummaryQuantityOf3: sumasPorDia[3].quantity!,
            salesSummarySubtotalOf3: sumasPorDia[3].subtotal!,
            salesSummaryDiscountOf3: sumasPorDia[3].discount!,
            salesSummarySubtotalWithDiscountOf3: sumasPorDia[3].subtotalWithDiscount!,
            salesSummaryQuantityOf4: sumasPorDia[4].quantity!,
            salesSummarySubtotalOf4: sumasPorDia[4].subtotal!,
            salesSummaryDiscountOf4: sumasPorDia[4].discount!,
            salesSummarySubtotalWithDiscountOf4: sumasPorDia[4].subtotalWithDiscount!,
            salesSummaryQuantityOf5: sumasPorDia[5].quantity!,
            salesSummarySubtotalOf5: sumasPorDia[5].subtotal!,
            salesSummaryDiscountOf5: sumasPorDia[5].discount!,
            salesSummarySubtotalWithDiscountOf5: sumasPorDia[5].subtotalWithDiscount!,
            salesSummaryQuantityOf6: sumasPorDia[6].quantity!,
            salesSummarySubtotalOf6: sumasPorDia[6].subtotal!,
            salesSummaryDiscountOf6: sumasPorDia[6].discount!,
            salesSummarySubtotalWithDiscountOf6: sumasPorDia[6].subtotalWithDiscount!,

            sumQuantity: sumQuantity,
            sumSubtotalWithDiscount: sumSubtotalWithDiscount
        
        });


      }, [outputsByWeek]);

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
                    <caption className="">Salidas de la semana</caption>
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-4 border border-gray-400 text-center font-bold text-lg" rowSpan={2}>PRODUCTO</th>
                            
                            {theads}
                            <th className="px-6 py-4 border border-gray-400 bg-lime-200 text-center font-bold text-lg" rowSpan={2}>TOTAL<br/>CANT</th>
                            <th className="px-6 py-4 border border-gray-400 bg-lime-200 text-center font-bold text-lg" rowSpan={2}>PRECIO<br/>VENTA</th>
                            <th className="px-6 py-4 border border-gray-400 bg-lime-200 text-center font-bold text-lg" rowSpan={2}>TOTAL<br/>VENTA</th>
                        </tr>
                        <tr>
                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">CANT</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">PRE</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">SUB</td>
                            <td className="px-2 py-2 border border-gray-400 text-center text-red-500 font-bold">DESC</td>
                            <td className="px-2 py-2 border border-gray-400 text-center font-bold">TOTAL</td>

                        </tr>
                    </thead>
                    <tbody>
                    {tbodies}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf0}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf0}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf0}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf0}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf1}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf1}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf1}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf1}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf2}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf2}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf2}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf2}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf3}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf3}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf3}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf3}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf4}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf4}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf4}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf4}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf5}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf5}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf5}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf5}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-center">{salesSummary.salesSummaryQuantityOf6}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalOf6}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 font-bold text-base text-right whitespace-nowrap text-red-500">S/ {salesSummary.salesSummaryDiscountOf6}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-lime-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.salesSummarySubtotalWithDiscountOf6}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 text-black font-bold text-base text-center">{salesSummary.sumQuantity}</td>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 text-black font-bold text-base text-center"></td>
                            <td className="px-2 py-2 border border-gray-400 bg-gray-200 text-black font-bold text-base text-right whitespace-nowrap">S/ {salesSummary.sumSubtotalWithDiscount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default WeeklySaleList