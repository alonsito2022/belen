"use client";
import { useState, useEffect } from "react";
import { IPerson, IUser } from '@/app/types';
import { toast } from "react-toastify";
import SupplierTariffForm from "@/components/purchases/suppliers/SupplierTariffForm"
import SupplierForm from "@/components/purchases/suppliers/SupplierForm"
import SupplierList from "@/components/purchases/suppliers/SupplierList"
import { useAppSelector } from "@/redux/hooks"

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

    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    // const [fortnight, setFortnight] = useState<any>(0);

    async function getTotalSuppliers(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        totalSuppliers
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setTotalSuppliers(data.data.totalSuppliers);
        })
        
    }

    async function fetchSuppliers(){
        // console.log('fetchSuppliers fort', fort)
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
            // console.log(data.data.suppliers)
            // console.log(data.data.suppliers.length)
            setSuppliers(data.data.suppliersByFortnightAndProductTariff);
        })
        
    }


    useEffect(() => {
        getTotalSuppliers();
    }, []);

    useEffect(() => {

        if(page>=1 && fort>0 )
            fetchSuppliers();
    }, [page, pageSize, fort]);

    useEffect(() => {
        if(totalSuppliers>0)
            setTotalPages(Math.max(0, Math.ceil(totalSuppliers / pageSize)))
    }, [totalSuppliers, pageSize]);


    return (
        <>

            

            <div className="flex justify-between my-3">
                <h2 className="text-4xl font-bold dark:text-white pb-2">Lista de proveedores y tarifas {fort}</h2>
                

                <button data-modal-toggle="supplierFormModal" onClick={(e)=>{
                    
                        document.getElementById("modal-title")!.innerHTML = "Nuevo proveedor";
                        document.getElementById("btn-save-product")!.innerHTML = "Guardar proveedor";
                        setSupplier(initialState);
                    
                        
                }} className=" block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Crear proveedor
                </button>

                <button id="editSupplierModalButton" data-modal-toggle="supplierFormModal" className="hidden" type="button">
                Editar proveedor
                </button>

                <button id="editSupplierTariffModalButton" data-modal-target="supplier-tariff-modal" data-modal-toggle="supplier-tariff-modal" className="hidden" type="button">
                    Tarifa de compra
                </button>

            </div>

            <SupplierList suppliers={suppliers} setSuppliers={setSuppliers} setSupplier={setSupplier} 
            setPage={setPage} page={page} totalPages={totalPages} totalSuppliers={totalSuppliers} pageSize={pageSize} setPageSize={setPageSize} fetchSuppliers={fetchSuppliers} fort={fort} />
            <SupplierForm setSupplier={setSupplier} supplier={supplier} fetchSuppliers={fetchSuppliers} />
            <SupplierTariffForm supplier={supplier} fetchSuppliers={fetchSuppliers} fort={fort} />

        </>
    )
}

export default SupplierPage
