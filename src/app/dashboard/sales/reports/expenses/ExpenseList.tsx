"use client";
import React from 'react';

import { ChangeEvent ,useState, FormEvent, useEffect } from "react";
import { IExpensesByWeek, IDateAndWeekday, IExpenseOfWeekDay } from '@/app/types';
import {getShortNameMonth, getWeekDayInSpanish} from '@/libs/functions'

const initialStateExpensesSummary = {
    summaryOfDay0: 0,
    summaryOfDay1: 0,
    summaryOfDay2: 0,
    summaryOfDay3: 0,
    summaryOfDay4: 0,
    summaryOfDay5: 0,
    summaryOfDay6: 0
}

function ExpenseList({setFilterObj, filterObj, obtenerFechaInicioFin, fechaInicio, fechaFin, datesAndWeekdays, expensesByWeek, modal, setExpense, expense} : any) {

    const [expensesSummary, setExpensesSummary] = useState(initialStateExpensesSummary);

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        if(name=="week") obtenerFechaInicioFin (value);
        setFilterObj({...filterObj, [name]: value});
    }

    const sumasPorDia : Array<IExpenseOfWeekDay> = Array.from({ length: 7 }, () => ({ total: 0 } ));

    let theads;
    theads= datesAndWeekdays.map((item: IDateAndWeekday, index: number) => {
        let objWeekday = getWeekDayInSpanish(item.formattedWeekday!);
        let objDate = getShortNameMonth(item.formattedDate!);
        return (
            <th key={index} className="px-6 py-4 border border-gray-400 text-center font-bold text-lg" colSpan={2}>{objWeekday}<br/>{objDate}</th>
        );
    });

    function getRows(info: IExpensesByWeek){

        const rows: JSX.Element[] = [];

        if(info.expensesOf0 != undefined)
        {
            let expensesOf0 = info.expensesOf0;
            let expensesOf1 = info.expensesOf1;
            let expensesOf2 = info.expensesOf2;
            let expensesOf3 = info.expensesOf3;
            let expensesOf4 = info.expensesOf4;
            let expensesOf5 = info.expensesOf5;
            let expensesOf6 = info.expensesOf6;

            const maxRows = Math.max(expensesOf0!.length, expensesOf1!.length, expensesOf2!.length, expensesOf3!.length, expensesOf4!.length, expensesOf5!.length, expensesOf6!.length || 1);
            
            if (expensesOf0 && Array.isArray(expensesOf0)) {
                sumasPorDia[0] = expensesOf0.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[0]);
            }

            if (expensesOf1 && Array.isArray(expensesOf1)) {
                sumasPorDia[1] = expensesOf1.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[1]);
            }
            

            if (expensesOf2 && Array.isArray(expensesOf2)) {
                sumasPorDia[2] = expensesOf2.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[2]);
            }

            if (expensesOf3 && Array.isArray(expensesOf3)) {
                sumasPorDia[3] = expensesOf3.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[3]);
            }
            

            if (expensesOf4 && Array.isArray(expensesOf4)) {
                sumasPorDia[4] = expensesOf4.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[4]);
            }
            

            if (expensesOf5 && Array.isArray(expensesOf5)) {
                sumasPorDia[5] = expensesOf5.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[5]);
            }

            if (expensesOf6 && Array.isArray(expensesOf6)) {
                sumasPorDia[6] = expensesOf6.reduce((acumulador: IExpenseOfWeekDay, venta: IExpenseOfWeekDay) => ({
                    total: (acumulador.total || 0) + (venta.total || 0),
                }), sumasPorDia[6]);
            }


            
            for (let i = 0; i < maxRows; i++) {
                const day0 = info.expensesOf0![i];
                const day1 = info.expensesOf1![i];
                const day2 = info.expensesOf2![i];
                const day3 = info.expensesOf3![i];
                const day4 = info.expensesOf4![i];
                const day5 = info.expensesOf5![i];
                const day6 = info.expensesOf6![i];
                rows.push(
                    <tr key={i}>
                        <td className="px-2 py-2 border border-gray-400">{day0?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day0)?("S/ " + day0?.total):""}</td>
                        <td className="px-2 py-2 border border-gray-400">{day1?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day1)?("S/ " + day1?.total):""}</td>
                        <td className="px-2 py-2 border border-gray-400">{day2?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day2)?("S/ " + day2?.total):""}</td>
                        <td className="px-2 py-2 border border-gray-400">{day3?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day3)?("S/ " + day3?.total):""}</td>
                        <td className="px-2 py-2 border border-gray-400">{day4?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day4)?("S/ " + day4?.total):""}</td>
                        <td className="px-2 py-2 border border-gray-400">{day5?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day5)?("S/ " + day5?.total):""}</td>
                        <td className="px-2 py-2 border border-gray-400">{day6?.description}</td>
                        <td className="px-2 py-2 border border-gray-400 text-right">{(day6)?("S/ " + day6?.total):""}</td>
                    </tr>
                )
            }
        }
      
        return rows
    }

    let tbodies = getRows(expensesByWeek);


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

                    <button  onClick={(e)=>{
                            modal.show();
                            document.getElementById("modal-title")!.innerHTML = "Nuevo egreso";
                            document.getElementById("btn-save-product")!.innerHTML = "Guardar egreso";
                            setExpense({...expense, 
                                id: 0,
                                description: "",
                                total: 0,
                            });
                        
                            
                    }} className="btn-lime border px-5 py-2.5" type="button">
                    Crear egreso
                    </button>
                    
                </div>

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className="">Cuadro de Egresos</caption>
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {theads}
                        </tr>
                        <tr>
                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>

                            <td className="px-2 py-2 border border-gray-400 text-center">RAZON</td>
                            <td className="px-2 py-2 border border-gray-400 text-right">TOTAL</td>


                        </tr>
                    </thead>
                    <tbody>
                        {tbodies}
                    
                    </tbody>
                    <tfoot>
                        <tr>
                            
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[0].total!}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[1].total!}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[2].total!}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[3].total!}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[4].total!}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[5].total!}</td>

                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-semibold text-lg">TOTAL</td>
                            <td className="px-2 py-2 border border-gray-400 bg-yellow-200 font-bold text-base text-right">S/ {sumasPorDia[6].total!}</td>
                            
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default ExpenseList