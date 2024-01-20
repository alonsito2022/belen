"use client";
import { ChangeEvent ,useState, useEffect, FormEvent } from "react";
import { IBalanceByWeek, ISaleOfWeekDay, ICheeseSupplier, IUser } from '@/app/types';
import { useSession} from 'next-auth/react';
import WeeklyReportList from "./WeeklyReportList";
import Breadcrumb from "@/components/Breadcrumb"
import { obtenerSemanaActual, getDates } from '@/libs/functions'

const initialStateFilterObj = {
    searchFullDateString: "",
    registerDate: "",
    productTariffId: 5,
    warehouseId: 7,
    supplierId: 0,
    userId: 0,
    week: "",
    role: "03",
    typeOfDairyProduct: "03",
    daysOfWeek: ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO','DOMINGO']
}

function WeeklyReportPage() {

    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [balancesByWeek, setBalancesByWeek] = useState< IBalanceByWeek[]>([]);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);
    const { data: session } = useSession();
    const u = session?.user as IUser;

    async function fetchBalancesByWeek(){
        let queryfecth = `
            query {
                balanceByWeek(weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, supplierId:${filterObj.supplierId}) {
                    productTariffId
                    productName
                    totalEntries
                    totalRemnants
                    totalLosses
                    totalReturns
                    totalSales
                    totalGeneral
                }
            }
        `;
        // console.log(queryfecth)
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: queryfecth
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setBalancesByWeek(data.data.balanceByWeek);
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
    }

    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        setFilterObj({...filterObj, week: semanaActual});
    }, []);

    useEffect(() => {
        if(filterObj.week.length > 0){
            
            fetchSuppliers();
            fetchBalancesByWeek();
            obtenerFechaInicioFin(filterObj.week);
        }

    }, [filterObj.week, filterObj.supplierId]);

    useEffect(() => {
        if(u!==undefined){
            setFilterObj( (prev : any) => ({...prev, userId: u?.id}))
        }
    }, [u]);

    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Reporte semanal"} />

            <WeeklyReportList
                suppliers={suppliers}
                setFilterObj={setFilterObj} 
                filterObj={filterObj} 
                obtenerFechaInicioFin={obtenerFechaInicioFin} 
                fechaInicio={fechaInicio} 
                fechaFin={fechaFin} 
                balancesByWeek={balancesByWeek}
                setBalancesByWeek={setBalancesByWeek}
                fetchBalancesByWeek={fetchBalancesByWeek}
            />
        </>
    )
}

export default WeeklyReportPage