"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IExpenseOfWeekDay, ICategory, ISubsidiary, IExpensesByWeek, IUser, IDateAndWeekday, ISubcategory, IElement } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import ExpenseList from "./ExpenseList"
import {obtenerSemanaActual, getDates} from '@/libs/functions'
import ExpenseForm from "./ExpenseForm"

const initialStateFilterObj = {
    cashId: 0,
    week: ""
}

const initialStateExpense = {
    id: 0,
    userId: 0,
    description: "",
    total: 0,
    categoryId: 0,
    subcategoryId: 0,
    transactionDate: "",
    transactionType: "S",
}

function ExpensePage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [datesAndWeekdays, setDatesAndWeekdays] = useState< IDateAndWeekday[]>([]);
    const [expensesByWeek, setExpensesByWeek] = useState< IExpensesByWeek[]>([]);

    const [modal, setModal] = useState< Modal | any>(null);

    const [expense, setExpense] = useState<any | IExpenseOfWeekDay>(initialStateExpense);

    const { data: session } = useSession();
    const u = session?.user as IUser;

 



    async function fetchDaysBetweenDates(){
        let queryfecth = `
            query {
                daysBetweenDates(weekValue:${Number(filterObj.week.toString().replace("-W", ""))}) {
                    formattedDate
                    formattedWeekday
                }
            }
        `;

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setDatesAndWeekdays(data.data.daysBetweenDates);
        })
        
    }

    async function fetchExpensesByWeek(){
        let queryfecth = `
            query {
                expensesByWeek(weekValue:${Number(filterObj.week.toString().replace("-W", ""))}) {
                    
                    expensesOf0 {
                        description
                        total
                    }
                    expensesOf1 {
                        description
                        total
                    }
                    expensesOf2 {
                        description
                        total
                    }
                    expensesOf3 {
                        description
                        total
                    }
                    
                    expensesOf4 {
                        description
                        total
                    }
                    expensesOf5 {
                        description
                        total
                    }
                    expensesOf6 {
                        description
                        total
                    }
                }
            }
        `;
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.data.expensesByWeek){
                setExpensesByWeek(data.data.expensesByWeek);
            }
            
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
        fetchDaysBetweenDates()
    }

    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        setFilterObj({...filterObj, week: semanaActual});

        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setExpense({...expense, transactionDate: defaultValue});
    }, []);


    useEffect(() => {
        if(filterObj.week.length > 0){
            fetchExpensesByWeek();
            obtenerFechaInicioFin(filterObj.week);
        }

    }, [filterObj.week]);

    useEffect(() => {
        if(u!==undefined){
            setExpense( (prev : any) => ({...prev, userId: u?.id}))
        }
    }, [u]);

    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Egresos del dia"} />
            <ExpenseList 
                setFilterObj={setFilterObj} 
                filterObj={filterObj} 
                obtenerFechaInicioFin={obtenerFechaInicioFin} 
                fechaInicio={fechaInicio} 
                fechaFin={fechaFin}
                datesAndWeekdays={datesAndWeekdays}
                expensesByWeek={expensesByWeek}
                modal={modal}
                setExpense={setExpense}
                expense={expense}

                
            />

            <ExpenseForm 
                modal={modal}
                setModal={setModal}
                setExpense={setExpense}
                expense={expense}
                fetchExpensesByWeek={fetchExpensesByWeek}
                filterObj={filterObj}

            />


        </>
    )
}

export default ExpensePage