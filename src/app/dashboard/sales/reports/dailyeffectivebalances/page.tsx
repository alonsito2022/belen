"use client";
import { useState, useEffect } from "react";
import { IDayInfo } from '@/app/types';
import Breadcrumb from "@/components/Breadcrumb"
import DailyEffectiveBalanceList from "./DailyEffectiveBalanceList"
import {obtenerSemanaActual} from '@/libs/functions'


const initialStateFilterObj = {
    week: ""
}

function DailyEffectiveBalancePage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);

    const [incomesAndExpensesByWeek, setIncomesAndExpensesByWeek] = useState< IDayInfo[]>([]);

    async function fetchExpensesByWeek(){
        let queryfecth = `
            query {
                incomesAndExpensesByWeek(weekValue:${Number(filterObj.week.toString().replace("-W", ""))}) {
                    incomesInCash
                    incomesInDeposit
                    expenses
                    total
                    formattedDate
                    listOfIncomesInCash{
                        id
                        userId
                        userName
                        description
                        total
                        transactionDate
                        transactionType
                    }
                    listOfIncomesInDeposit{
                        id
                        userId
                        userName
                        description
                        total
                        transactionDate
                        transactionType
                    }
                    listOfExpenses{
                        id
                        userId
                        userName
                        description
                        total
                        transactionDate
                        transactionType
                    }
                }
            }
        `;
        console.log(queryfecth)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setIncomesAndExpensesByWeek(data.data.incomesAndExpensesByWeek);
        })
        
    }


    function obtenerFechaInicioFin (semanaSeleccionada:string) {
        const [anio, numSemana] = semanaSeleccionada.split('-W');
        const inicioAnio = new Date(`${anio}-01-01`);
        const primerDiaSemana = inicioAnio.getDay();
        const diasHastaPrimerDia = (8 - primerDiaSemana) % 7 || 7; // Ajuste para considerar el primer día de la semana
        const inicioSemana = new Date(inicioAnio);
        inicioSemana.setDate(inicioAnio.getDate() + diasHastaPrimerDia + (parseInt(numSemana) - 1) * 7);
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(finSemana.getDate() + 6);

        setFechaInicio(inicioSemana);
        setFechaFin(finSemana);
    }

    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        setFilterObj({...filterObj, week: semanaActual});
    }, []);


    useEffect(() => {
        if(filterObj.week.length > 0){
            
            fetchExpensesByWeek();
            obtenerFechaInicioFin(filterObj.week);
        }

    }, [filterObj.week]);
    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Balance efectivo diario"} />
            <DailyEffectiveBalanceList 
                setFilterObj={setFilterObj} 
                filterObj={filterObj} 
                obtenerFechaInicioFin={obtenerFechaInicioFin} 
                fechaInicio={fechaInicio} 
                fechaFin={fechaFin}
                incomesAndExpensesByWeek={incomesAndExpensesByWeek}
            />                                                                                                                                                    
        </>
    )
}

export default DailyEffectiveBalancePage