"use client";
import { useState, useEffect } from "react";
import { IPerson, ICheeseSupplier, ISaleCenter } from '@/app/types';
import ClientForm from "./ClientForm"
import ClientList from "./ClientList"
import Breadcrumb from "@/components/Breadcrumb"
import { Modal } from 'flowbite'

const initialState = {
    id: 0,
    names: "",
    phone: "",
    email: "",
    address: "",
    district: "040601",
    documentType: "01",
    documentNumber: "",
    saleCenterId: 0,
    saleCenterName: "",
    isEnabled: true,
}

function ClientPage() {
    const [clients, setClients] = useState< ICheeseSupplier[]>([]);
    const [client, setClient] = useState<any | IPerson>(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const [salesCenter, setSalesCenter] = useState<ISaleCenter[]>([]);

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

    async function fetchClients(){
        let queryfecth = `
            query {
                clients{
                    id
                    names
                    phone
                    email
                    address
                    documentType
                    documentNumber
                    documentTypeReadable
                    saleCenterName
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
            setClients(data.data.clients);
        })
        
    }


    useEffect(() => {
        fetchClients();
        fetchSalesCenter();
    }, []);

    return (
        <>

            <Breadcrumb section={"Ventas"} article={`Lista de clientes`} />
            <ClientList clients={clients} setClient={setClient} fetchClients={fetchClients} initialState={initialState} modal={modal} />
            <ClientForm modal={modal} setModal={setModal} setClient={setClient} client={client} fetchClients={fetchClients} 
            salesCenter={salesCenter} fetchSalesCenter={fetchSalesCenter}/>

        </>
    )
}

export default ClientPage