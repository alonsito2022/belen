"use client";
import { useState, useEffect } from "react";
import { IPerson, ICheeseSupplier } from '@/app/types';
import SupplierForm from "./SupplierForm"
import SupplierList from "./SupplierList"
import Breadcrumb from "@/components/Breadcrumb"
import { useAppSelector } from "@/redux/hooks"
import { Modal, ModalOptions } from 'flowbite'

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

function SupplierPage() {
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);
    const [supplier, setSupplier] = useState<any | IPerson>(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    
    async function fetchSuppliers(){
        let queryfecth = `
            query {
                suppliersByWeekAndTypeOfDairyProduct(
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, 
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    allSuppliers:${true}, supplierId:${0}
                ) {
                    id
                    name
                    pariah
                    mozzarella
                    tilsit
                    andean
                    edam
                    gouda
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

    function obtenerSemanaActual(): string {
        const hoy: Date = new Date();
        const anio: number = hoy.getFullYear();
        const numeroDeSemana: number = obtenerNumeroDeSemana(hoy);
      
        return `${anio}-W${numeroDeSemana < 10 ? '0' : ''}${numeroDeSemana}`;
      }
      
      function obtenerNumeroDeSemana(fecha: Date): number {
        // Implementación para obtener el número de semana.
        // Puedes usar una librería como 'date-fns' o 'moment' para esto.
        // Aquí te doy un ejemplo simple:
        const inicioAnio: Date = new Date(fecha.getFullYear(), 0, 1);
        const milisegundosEnDia: number = 86400000; // 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
      
        const diasTranscurridos: number = Math.floor((fecha.getTime() - inicioAnio.getTime()) / milisegundosEnDia);
        const numeroDeSemana: number = Math.ceil((diasTranscurridos + inicioAnio.getDay() + 1) / 7);
      
        return numeroDeSemana;
    }
    
    useEffect(() => {
        if(fort>0 && filterObj.week.length > 0)
            fetchSuppliers();
    }, [fort, filterObj]);
    
    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        console.log(semanaActual)
        
        setFilterObj({...filterObj, 
            week: semanaActual
        });
            
    }, []);

    return (
        <>

            <Breadcrumb section={"Ventas"} article={`Lista de proveedores de quesos (Semana ${filterObj.week.split("-W")[1]} del ${filterObj.week.split("-W")[0]})`} />
            <SupplierList suppliers={suppliers} setSuppliers={setSuppliers} setSupplier={setSupplier} fetchSuppliers={fetchSuppliers} 
            fort={fort}  initialState={initialState} modal={modal} setFilterObj={setFilterObj} filterObj={filterObj}  />
            <SupplierForm modal={modal} setModal={setModal} setSupplier={setSupplier} supplier={supplier} fetchSuppliers={fetchSuppliers} fort={fort} filterObj={filterObj} />

        </>
    )
}

export default SupplierPage
