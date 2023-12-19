"use client";
import { useState, useEffect } from "react";
import { IPerson, IChoice } from '@/app/types';
import Breadcrumb from "@/components/Breadcrumb"
import SupplierForm from "./SupplierForm"
import SupplierList from "./SupplierList"
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


function SupplierPage() {
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [suppliers, setSuppliers] = useState< IPerson[]>([]);
    const [supplier, setSupplier] = useState<any | IPerson>(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const [districts, setDistricts] = useState<IChoice[]>([]);

    async function fetchSuppliers(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        suppliersByFortnightAndProductTariff(fortnightValue:${fort}, productTariffId:${5}) {
                            id
                            names
                            isEnabled
                            countSupplierTariffs
                            priceMilkTomorrowByFortnight
                            priceMilkAfternoonByFortnight
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSuppliers(data.data.suppliersByFortnightAndProductTariff);
        })
        
    }

    async function fetchDistricts(){
        
        let queryfecth = `
            query {
                districts {
                    id
                    value
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
            setDistricts(data.data.districts);
        })
    }


    useEffect(() => {
        if(fort>0 )
            fetchSuppliers();
    }, [fort]);

    useEffect(() => {
        
        fetchDistricts();
    }, []);

    function obtenerNombreMes (numero : number) {
        let miFecha = new Date();
        if (0 < numero && numero <= 12) {
          miFecha.setMonth(numero - 1);
          return new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(miFecha);
        } else {
          return null;
        }
    }

    return (
        <>

            <Breadcrumb section={"Producción"} article={`Lista de proveedores de leche 
            ${obtenerNombreMes(Number(fort.toString().substring(4, fort.toString().length - 1))) + " " + fort.toString().substring(0, 4) + " " + ((fort.toString().substring(fort.toString().length - 1)=="1")?"(1)":"(2)")}`} />

            <SupplierList suppliers={suppliers} setSuppliers={setSuppliers} setSupplier={setSupplier} 
                fetchSuppliers={fetchSuppliers} fort={fort} initialState={initialState} modal={modal} />
            <SupplierForm modal={modal} setModal={setModal} setSupplier={setSupplier} supplier={supplier} fetchSuppliers={fetchSuppliers} fort={fort} districts={districts} />

        </>
    )
}

export default SupplierPage
