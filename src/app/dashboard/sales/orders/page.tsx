"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IEntry, ICheeseSupplier, IProductTariff, IOperation, ISaleCenter, IUser, IPerson } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import OrderList from "./OrderList"
import OrderForm from "./OrderForm"
import {obtenerSemanaActual} from '@/libs/functions'
import { initFlowbite} from "flowbite";
import OrderReview from "./OrderReview";

const initialStateFilterObj = {
    searchDate: "",
    warehouseId: 7,
    searchSaleCenterId: 0,
    week: "",
    typeOfDairyProduct: "03"
}

const initialStateOutput = {
    id: 0,
    saleCenterId: 0,
    operationDate: "",
    operationStatus: "",
    clientId: 0,
    lastSubtraction: 0,
    supplierId: 0,
    userId: 0,
    productTariffId: 0,
    quantity: 0,
    price: 0,
    previousBalance: 0,
    productName: "",
    discount: 0,
    
    suppliers: [],
    productTariffs: [],
    quantities: [],
    prices: [],
    discounts: [],
    productNames: [],
    supplierNames: [],
  
    baseCost: 0,
    igvCost: 0,  
    totalSale: 0,

    totalPreviousBalance: 0,
    totalNet: 0,
    cash: 0,
    deposit: 0,
    subtraction: 0,

    hasIgv: false,
    observation: "",
    documentType: "01",
    documentTypeReadable: "",
    documentNumber: "",

    client: {names:"", saleCenter:{id:0, name:""}},
    operationdetailSet: [],
}

function OrderPage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [modal, setModal] = useState< Modal | any>(null);
    const [modalReview, setModalReview] = useState< Modal | any>(null);
    const [output, setOutput] = useState<any | IEntry>(initialStateOutput);
    const [outputFound, setOutputFound] = useState<any | IEntry>(initialStateOutput);

    const [outputs, setOutputs] = useState< IOperation[]>([]);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [tempProductTariffs, setTempProductTariffs] = useState< IProductTariff[]>([]);
    const [clients, setClients] = useState< IPerson[]>([]);
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [salesCenter, setSalesCenter] = useState<ISaleCenter[]>([]);
    const { data: session } = useSession();
    const u = session?.user as IUser;

    async function fetchSalesCenter(){
        
        let queryfecth = `
            query {
                salesCenter {
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
            setSalesCenter(data.data.salesCenter);
        })
    }

    async function fetchClients(id: number){
        let queryfecth = `
            query {
                clientsBySaleCenter(saleCenterId:${id}){
                    id
                    names
                    phone
                    email
                    address
                    documentType
                    documentNumber
                    documentTypeReadable
                    saleCenterId
                    saleCenterName
                    lastSubtraction
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
            console.log(data.data.clientsBySaleCenter)
            setClients(data.data.clientsBySaleCenter);
        })
        
    }

    async function annulSaleById(id: number){
        let queryFetch: String = "";

            queryFetch = `
                mutation{
                    annulSale(
                        operationId:${id}
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
                toast(data.data.annulSale.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                fetchOutputs();

        }).catch(e=>console.log(e))
    }

    async function getOutputById(id: number){
        let queryfecth = `
            query {
                outputById(pk:${id}){
                    id
                    operationDate
                    baseCost
                    igvCost
                    totalSale
                    previousBalance

                    documentTypeReadable
                    documentNumber
                    client{
                        saleCenter{
                            id
                            name
                        }
                        names
                    }
                    operationdetailSet{
                        id
                        productTariff{
                            productName
                        }
                        supplier{
                            names
                        }
                        quantity
                        price
                        discount
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
            
            setOutputFound(data.data.outputById);
            
        })
        
    }

    async function fetchOutputs(){
        
        let queryfecth = `
             query {
                outputsByDate(searchDate:"${filterObj.searchDate}", saleCenterId:${filterObj.searchSaleCenterId}) {
                    id
                    formattedDate
                    dayNameResult
                    operationDate
                    operationStatus
                    baseCost
                    igvCost
                    totalSale
                    previousBalance
                    totalNet
                    cash
                    deposit
                    subtraction
                    documentTypeReadable
                    documentNumber
                    client{
                        saleCenter{
                            id
                            name
                        }
                        names
                    }
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
             setOutputs(data.data.outputsByDate);
             initFlowbite();
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

        // const formattedDate = inicioSemana.toISOString().split('T')[0];
        const year = inicioSemana.getFullYear();
        let mes = (inicioSemana.getMonth() + 1).toString().padStart(2, '0'); // Agrega un 0 al mes si es necesario
        let dia = inicioSemana.getDate().toString().padStart(2, '0'); // Agrega un 0 al día si es necesario

        const formattedDate = `${year}-${mes}-${dia}`;

        setOutput({...output, operationDate: formattedDate});

        // console.log('inicioSemana', inicioSemana)
        // console.log('finSemana', finSemana)

    }

    useEffect(() => {
        if(filterObj.week.length > 0){
            fetchSuppliers();
            fetchOutputs();
            obtenerFechaInicioFin(filterObj.week);
            // console.log('obtenerFechaInicioFin', filterObj.week)
        }

    }, [filterObj]);

    useEffect(() => {
        const semanaActual: string = obtenerSemanaActual();
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, week: semanaActual, searchDate:defaultValue});
        setOutput({...output, operationDate: defaultValue});
        fetchProductTariffs();
        fetchSalesCenter();
    }, []);

    useEffect(() => {
        if(u!==undefined){
            // setOperation({...operation, userId: u?.userID, username: `${u?.firstName!}  ${u?.lastName!}`});
            setOutput( (prev : any) => ({...prev, userId: u?.id}))
        }
    }, [u]);

    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Ventas del dia"} />
            <OrderList outputs={outputs} setOutputs={setOutputs} output={output} setOutput={setOutput} fetchOutputs={fetchOutputs} modal={modal}  
            setFilterObj={setFilterObj} filterObj={filterObj} salesCenter={salesCenter} getOutputById={getOutputById} annulSaleById={annulSaleById} modalReview={modalReview}
            
            />
            <OrderForm modal={modal} setModal={setModal} setOutput={setOutput} output={output} fetchOutputs={fetchOutputs} 
            setFilterObj={setFilterObj}  filterObj={filterObj} 
            suppliers={suppliers} productTariffs={productTariffs} setProductTariffs={setProductTariffs} 
            tempProductTariffs={tempProductTariffs} setTempProductTariffs={setTempProductTariffs} salesCenter={salesCenter} clients={clients} fetchClients={fetchClients}
            obtenerFechaInicioFin={obtenerFechaInicioFin} 
            fechaInicio={fechaInicio} fechaFin={fechaFin}
            />
            <OrderReview modalReview={modalReview} setModalReview={setModalReview} outputFound={outputFound} />

        </>
    )
}

export default OrderPage