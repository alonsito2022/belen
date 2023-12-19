"use client";
import { useState, useEffect } from "react";
import { IPerson, ICheeseSupplier } from '@/app/types';
import IncomeForm from "./IncomeForm"
import IncomeList from "./IncomeList"
import Breadcrumb from "@/components/Breadcrumb"
import { useAppSelector } from "@/redux/hooks"
import { Modal, ModalOptions } from 'flowbite'
import {obtenerSemanaActual} from '@/libs/functions'

const initialState = {
    id: 0,
    names: "",
    phone: "",
    email: "",
    address: "",
    district: "040601",
    documentType: "01",
    documentNumber: "",
    isEnabled: true,
}


const initialStateFilterObj = {
    searchFullDateString: "",
    searchDate: "",
    searchType: "06",
    productTariffId: 5,
    warehouseId: 6,
    week: "",
    typeOfDairyProduct: "03"
}
function IncomePage() {
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);
    const [supplier, setSupplier] = useState<any | IPerson>(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);

    async function fetchSuppliers(){
        let queryfecth = `
            query {
                suppliersByWeekAndTypeOfDairyProduct(
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, 
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    allSuppliers:${false},
                    supplierId:${0},
                    includeWeek:${true}
                ) {
                    id
                    name
                    pariah
                    mozzarella
                    tilsit
                    gouda
                    andean
                    edam
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
        // Calcular la fecha de inicio y fin de la semana
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
        if(fort>0 && filterObj.week.length > 0)
            fetchSuppliers();
    }, [fort, filterObj]);
    
    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        
        setFilterObj({...filterObj, 
            week: semanaActual
        });
        obtenerFechaInicioFin(semanaActual);
            
    }, []);

    return (
        <>
            <Breadcrumb section={"Ventas"} article={`Lista de proveedores por semana`} />
            <IncomeList suppliers={suppliers} setSuppliers={setSuppliers} setSupplier={setSupplier} fetchSuppliers={fetchSuppliers} 
            fort={fort}  initialState={initialState} modal={modal} setFilterObj={setFilterObj} filterObj={filterObj} 
            obtenerFechaInicioFin={obtenerFechaInicioFin} fechaInicio={fechaInicio} fechaFin={fechaFin} />
            <IncomeForm modal={modal} setModal={setModal} setSupplier={setSupplier} supplier={supplier} fetchSuppliers={fetchSuppliers} fort={fort} filterObj={filterObj} />

        </>
    )
}

export default IncomePage