"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IEntry, ICheeseSupplier, IProductTariff, IOperationDetail, IUser, IPerson } from '@/app/types';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import EntryList from "./EntryList"
import EntryForm from "./EntryForm"

const initialStateFilterObj = {
    searchFullDateString: "",
    registerDate: "",

    productTariffId: 5,
    warehouseId: 7,
    supplierId: 0,
    supplierSelectedId: 0,
    week: "",
    role: "03",
    typeOfDairyProduct: "03"
}
const initialState = {
    id: 0,
    operationDate: "",
    observation: "",
    dayName: "",
    supplierId: 0,
    employeeId: 0,
    productTariffId: 0,
    quantityMold: 0,
    quantityBox: 0,
    price: 0,
}




function EntryPage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [modal, setModal] = useState< Modal | any>(null);
    const [entry, setEntry] = useState<any | IEntry>(initialState);
    const [entries, setEntries] = useState< IOperationDetail[]>([]);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);
    const [users, setUsers] = useState< IUser[]>([]);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [tempProductTariffs, setTempProductTariffs] = useState< IProductTariff[]>([]);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [suppliersWithoutWeek, setSuppliersWithoutWeek] = useState< ICheeseSupplier[]>([]);  
    async function fetchDairySuppliers(){
        let queryfecth = `
            query {
                suppliersByWeekAndTypeOfDairyProduct(
                    weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, 
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    allSuppliers:${false}
                    supplierId:${0}
                    includeWeek:${false}
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
            setSuppliersWithoutWeek(data.data.suppliersByWeekAndTypeOfDairyProduct);
        })
        
    } 
    async function fetchEmployeesByRol(){
        let queryfecth = `
            query {
                usersByRole(
                    role:"${filterObj.role}",
                ) {
                    id
                    firstName
                    lastName
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
            
            if(data.data.usersByRole){
               
                setUsers(data.data.usersByRole)
            }
        })
        
    }

    async function fetchProductTariffs(){
        let queryfecth = `
            query {
                typeOfDairyProducts(
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}"
                ) {
                    id
                    productName
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
            setProductTariffs(data.data.typeOfDairyProducts);
            setTempProductTariffs(data.data.typeOfDairyProducts);
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

    async function fetchEntries(){
        
           let queryfecth = `
                query {
                    entriesByWeek(weekValue:${Number(filterObj.week.toString().replace("-W", ""))}, supplierId:${filterObj.supplierSelectedId}) {
                        id
                        operation{
                            formattedDate
                            dayNameResult
                            operationDate
                            supplier{
                                id
                                names
                            }
                        }
                        quantity
                        price
                        productTariff{
                            productName
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
                setEntries(data.data.entriesByWeek);
            })
         
        
        
    }

    useEffect(() => {
        if(filterObj.week.length > 0){
            fetchSuppliers();
            
            fetchEntries();
            fetchDairySuppliers();
            fetchEmployeesByRol();
            obtenerFechaInicioFin(filterObj.week);
        }

    }, [filterObj]);

    function obtenerSemanaActual(): string {
        const hoy: Date = new Date();
        const anio: number = hoy.getFullYear();
        const numeroDeSemana: number = obtenerNumeroDeSemana(hoy);
        return `${anio}-W${numeroDeSemana < 10 ? '0' : ''}${numeroDeSemana}`;
    }
      
    function obtenerNumeroDeSemana(fecha: Date): number {
        const inicioAnio: Date = new Date(fecha.getFullYear(), 0, 1);
        const milisegundosEnDia: number = 86400000; // 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
        const diasTranscurridos: number = Math.floor((fecha.getTime() - inicioAnio.getTime()) / milisegundosEnDia);
        const numeroDeSemana: number = Math.ceil((diasTranscurridos + inicioAnio.getDay() + 1) / 7);
        return numeroDeSemana;
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
        const semanaActual: string = obtenerSemanaActual();
        console.log(semanaActual)
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, week: semanaActual});
        setEntry({...entry, operationDate: defaultValue});
        fetchProductTariffs()
    }, []);


    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Registro de entrada de queso por semana"} />


            
            
            <EntryList suppliers={suppliers} entries={entries} entry={entry} setEntry={setEntry} fetchEntries={fetchEntries} initialState={initialState} modal={modal} 
            setFilterObj={setFilterObj} filterObj={filterObj} obtenerFechaInicioFin={obtenerFechaInicioFin} fechaInicio={fechaInicio} fechaFin={fechaFin} 
            fetchSuppliers={fetchSuppliers} suppliersWithoutWeek={suppliersWithoutWeek}/>
            
            <EntryForm modal={modal} setModal={setModal} setEntry={setEntry} entry={entry} fetchEntries={fetchEntries} filterObj={filterObj} 
            suppliers={suppliers} productTariffs={productTariffs} setProductTariffs={setProductTariffs} 
            tempProductTariffs={tempProductTariffs} setTempProductTariffs={setTempProductTariffs} users={users} />
        </>
    )
}

export default EntryPage