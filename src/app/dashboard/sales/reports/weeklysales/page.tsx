"use client";
import { ChangeEvent ,useState, useEffect, FormEvent } from "react";
import { IEntriesByWeek, ISaleOfWeekDay, ICheeseSupplier, IDateAndWeekday } from '@/app/types';
import { toast } from "react-toastify";
import WeeklySaleList from "./WeeklySaleList";
import Breadcrumb from "@/components/Breadcrumb"
import {obtenerSemanaActual, getDates} from '@/libs/functions'

const initialStateFilterObj = {
    searchFullDateString: "",
    registerDate: "",

    productTariffId: 5,
    warehouseId: 7,
    supplierId: 0,
    week: "",
    role: "03",
    typeOfDairyProduct: "03",
    daysOfWeek: ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO','DOMINGO']
}

function weeklysalePage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [outputsByWeek, setEntriesByWeek] = useState< IEntriesByWeek[]>([]);
    const [datesAndWeekdays, setDatesAndWeekdays] = useState< IDateAndWeekday[]>([]);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);

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

    async function fetchEntriesByWeek(){
        let queryfecth = `
            query {
                outputsByWeek(weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, supplierId:${filterObj.supplierId}) {
                    productName
                    salesOf0 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
                    }
                    salesOf1 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
                    }
                    salesOf2 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
                    }
                    salesOf3 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
                    }
                    
                    salesOf4 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
                    }
                    salesOf5 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
                    }
                    salesOf6 {
                        operationDetailId
                        clientName
                        saleCenterName
                        day
                        formattedDate
                        quantity
                        price
                        subtotal
                        discount
                        subtotalWithDiscount
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
            setEntriesByWeek(data.data.outputsByWeek);
        })
        
    }

    async function fetchSuppliers(){
        let queryfecth = `
            query {
                suppliersByWeekAndTypeOfDairyProduct(
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, 
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    allSuppliers:${false}, supplierId:${0}, includeWeek:${true}
                ) {
                    id
                    name
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
            setSuppliers(data.data.suppliersByWeekAndTypeOfDairyProduct);
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
    }, []);

    useEffect(() => {
        if(filterObj.week.length > 0){
            
            fetchSuppliers();
            fetchEntriesByWeek();
            obtenerFechaInicioFin(filterObj.week);
        }

    }, [filterObj.week, filterObj.supplierId]);

    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Ventas semanales"} />
            <WeeklySaleList  
                suppliers={suppliers}
                setFilterObj={setFilterObj} 
                filterObj={filterObj} 
                obtenerFechaInicioFin={obtenerFechaInicioFin} 
                fechaInicio={fechaInicio} 
                fechaFin={fechaFin} 
                outputsByWeek={outputsByWeek}
                datesAndWeekdays={datesAndWeekdays}
            />
        </>
    )
}

export default weeklysalePage