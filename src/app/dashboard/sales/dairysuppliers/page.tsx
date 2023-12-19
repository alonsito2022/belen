"use client";
import { useState, useEffect } from "react";
import { IPerson, ICheeseSupplier, IChoice } from '@/app/types';
import DairySupplierForm from "./DairySupplierForm"
import DairySupplierList from "./DairySupplierList"
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

function DairySupplierPage() {
    const fort = useAppSelector(state=>state.fortnitghtReducer.fortnightValue);
    const [suppliers, setSuppliers] = useState< ICheeseSupplier[]>([]);
    const [supplier, setSupplier] = useState<any | IPerson>(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [districts, setDistricts] = useState<IChoice[]>([]);

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

    async function fetchSuppliers(){
        let queryfecth = `
            query {
                suppliersByTypeOfDairyProduct(
                    typeOfDairyProduct:"${filterObj.typeOfDairyProduct}",
                    supplierId:${0}
                ) {
                    id
                    names
                    phone
                    email
                    address
                    documentType
                    documentNumber
                    documentTypeReadable
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
            setSuppliers(data.data.suppliersByTypeOfDairyProduct);
        })
        
    }

    useEffect(() => {
        if(filterObj.typeOfDairyProduct.length > 0)
            fetchSuppliers();
        
    }, [filterObj]);
    
    useEffect(() => {
        fetchDistricts();
    }, []);
    
    return (
        <>

            <Breadcrumb section={"Ventas"} article={`Lista general de proveedores de quesos`} />
            <DairySupplierList suppliers={suppliers} setSuppliers={setSuppliers} setSupplier={setSupplier} fetchSuppliers={fetchSuppliers} 
            initialState={initialState} modal={modal} setFilterObj={setFilterObj} filterObj={filterObj}  />
            <DairySupplierForm modal={modal} setModal={setModal} setSupplier={setSupplier} supplier={supplier} 
            fetchSuppliers={fetchSuppliers} filterObj={filterObj} districts={districts} />

        </>
    )
}

export default DairySupplierPage