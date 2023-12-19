"use client";
import { useState, useEffect, useRef } from "react";
import EmployeeList from "./EmployeeList"
import EmployeeRegisterForm from "./EmployeeRegisterForm"
import { Modal, ModalOptions } from 'flowbite'
import { IUser } from '@/app/types';
import Breadcrumb from "@/components/Breadcrumb"

const initialState = {

    id: 0,
    firstName: "",
    lastName: "",
    document: "",
    phone: "",
    address: "",
    birthDate: "",
    phoneOfRelative: "",
    startDate: "",
    endDate: "",

    password: "",
    email: "",

    role: "01",
    roleReadable: "01",
    subsidiaryId: 0,
    code: 0,
    remuneration: 0,
    isActive: true
}


function EmployeePage() {
    const [user, setUser] = useState<any | IUser>(initialState);
    const [modal, setModal] = useState< Modal | any>(null);
    const [users, setUsers] = useState< IUser[]>([]);

    async function fetchUsers(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        users {
                            id
                            firstName
                            lastName
                            document
                            phone
                            address
                            birthDate
                            phoneOfRelative
                            startDate
                            endDate
                            password
                            email
                            code
                            remuneration
                            isActive
                            role
                            roleReadable
                            subsidiary{
                                id
                                name
                            }
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setUsers(data.data.users);
        })
        
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUserByID(pk: number){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        userById(pk: ${pk}){
                            id
                            firstName
                            lastName
                            document
                            phone
                            address
                            birthDate
                            phoneOfRelative
                            startDate
                            endDate
                            email
                            code
                            remuneration
                            isActive
                          	role
                          	roleReadable
                          	subsidiaryId
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data.data.userById)
            setUser(data.data.userById);
        })
    }

    return (
        <>
            
            <Breadcrumb section={"Administración"} article={"Empleados"} />
            <div className="mb-4 grid grid-cols-1 items-end gap-2  justify-end ">
                <button onClick={(e)=>{
                    modal.show();
                    document.getElementById("modal-title")!.innerHTML = "Nuevo empleado";
                    document.getElementById("btn-save-product")!.innerHTML = "Guardar empleado";
                    setUser(initialState);
                }} 
                    className=" block text-white bg-gray-400 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">
                    Registrar empleado
                </button>
            </div>
            <EmployeeList users={users} modal={modal} fetchUserByID={fetchUserByID} />
            <EmployeeRegisterForm modal={modal} setModal={setModal} user={user} setUser={setUser}  fetchUsers={fetchUsers} initialState={initialState} />

        </>
    )
}

export default EmployeePage