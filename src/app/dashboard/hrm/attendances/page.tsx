"use client";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import AttendanceList from "./AttendanceList"
import AttendanceRegisterForm from "./AttendanceRegisterForm"
import AttendanceAddUserForm from "./AttendanceAddUserForm"
import { ISubsidiary, IAttendanceOfMonth, IDayOfMonth, IAttendanceIncidence, IUser, IAttendanceDetail, IAttendanceListUser } from '@/app/types';
import { toast } from "react-toastify";
import { Modal, ModalOptions } from 'flowbite'
import Breadcrumb from "@/components/Breadcrumb"

const initialStateFilterObj = {
    collectDate: "",
    year: 0,
    month: 0,
    subsidiaryId: 0,
}
const initialStateIncidence = {
    attendanceDetailId: 0,
    employeeId: 0,
    firstName: "",
    lastName: "",
    statusChoice: "NA",
    registerDate: "",
    observation: "",
    substituteEmployeeId: 0,
    replacementEmployeeId: 0,
    totalDaysWorked: 0,
    totalDaysNoWorked: 0,
    totalReplacementDays: 0,
    remunerationDiscounted: 0,
    remunerationExtra: 0,
    totalRemuneration: 0,
}
const initialState = {
    userId: 0,
}
function AttendancePage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [futureYears, setFutureYears] = useState<number[]|null>([]);
    const [monthNames, setMonthNames] = useState<string[]|null>([
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ]);
    const [subsidiaries, setSubsidiaries] = useState< ISubsidiary[]>([]);
    const [users, setUsers] = useState< IUser[]>([]);
    const [daysOfMonth, setDaysOfMonth] = useState< IDayOfMonth[]>([]);
    const [attendancesOfMonth, setAttendancesOfMonth] = useState< IAttendanceOfMonth[]>([]);
    const [modal, setModal] = useState< Modal | any>(null);
    const [modalAddUser, setModalAddUser] = useState< Modal | any>(null);
    const [attendanceIncidence, setAttendanceIncidence] = useState<any | IAttendanceIncidence>(initialStateIncidence);
    const [attendanceListUser, setAttendanceListUser] = useState<any | IAttendanceListUser>(initialState);

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }

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

    async function fetchSubsidiaries(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        subsidiaries {
                            id
                            name
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSubsidiaries(data.data.subsidiaries);
        })
    }

    async function fetchDaysOfMonth(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        daysOfMonth(month:${filterObj.month}, year:${filterObj.year}) {
                            id
                            name
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setDaysOfMonth(data.data.daysOfMonth);
        })
        
    }

    async function fetchAttendancesOfMonth(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        attendancesOfMonth(month:${filterObj.month}, year:${filterObj.year}, subsidiaryId:${filterObj.subsidiaryId}) {
                            totalDaysWorked
                            totalDaysNoWorked
                            totalReplacementDays
                            remunerationExtra
                            remunerationDiscounted
                            totalRemuneration
                            employee{
                                id
                                firstName
                                lastName
                                remuneration
                            }
                            attendancedetailSet{
                                id
                                registerDate
                                status
                                observation
                                substituteEmployee{
                                    id
                                    firstName
                                    lastName
                                    remuneration
                                }
                                replacementEmployee{
                                    id
                                    firstName
                                    lastName
                                    remuneration
                                }
                            }
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.data.attendancesOfMonth != null){
                const datos = data.data.attendancesOfMonth.map((am: IAttendanceOfMonth) => {
                    let countT = 0;
                    let countPE = 0;
                    let countNT = 0;
                
                    am.attendancedetailSet?.forEach((asistencia: IAttendanceDetail) => {
                        if (asistencia.status === "T") {
                            countT++;
                        } else if (asistencia.status === "PE") {
                            countPE++;
                        } else if (asistencia.status === "NT") {
                            countNT++;
                        }
                    });
                
                    return { 
                        ...am, 
                        countT,
                        countPE,
                        countNT 
                    };
                });
                console.log(datos)
                setAttendancesOfMonth(datos);
            }
            
        })
        
    }

    useEffect(() => {
        const date = new Date();
        const defaultValue = date.toLocaleDateString('en-CA');
        setFilterObj({...filterObj, collectDate: defaultValue, year: date.getFullYear(), month: date.getMonth() + 1 });
        const years = [];
        const currentYear = date.getFullYear();
        years.push(currentYear);
        for (let i = 1; i < 10; i++) {
            years.push(currentYear + i);
        }
        setFutureYears(years);
        fetchSubsidiaries();
        fetchUsers();
          
    }, []);



    const handleClickButton = (e: MouseEvent<HTMLElement>) => {
        if(filterObj.subsidiaryId > 0){
            fetchAttendancesOfMonth()
            fetchDaysOfMonth()
        }
        else
            toast("Seleccione sede", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
    }


    return (
        <>
            
            <Breadcrumb section={"Administración"} article={"Asistencias"} />
            
            <div className="mb-4 grid grid-cols-6 items-end gap-2  justify-end ">
                <div className="sm:col-span-2">
                    <label htmlFor="subsidiaryId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SEDE</label>
                    <select id="subsidiaryId" 
                    name="subsidiaryId" value={filterObj.subsidiaryId} onChange={handleInputChange} required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>Elegir sede</option>
                        {subsidiaries.map((o,k)=>(
                            <option key={k} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>

                <div className="">
                    <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">AÑO</label>
                    <select id="year" 
                    name="year" value={filterObj.year} onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {futureYears?.map((o)=>(
                                <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </div>

                <div className="">
                    <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">MES</label>
                    <select id="month" 
                    name="month" value={filterObj.month} onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {monthNames?.map((m, k)=>(
                                <option key={k} value={k+1}>{m}</option>
                        ))}
                    </select>
                </div>
                <div className="sm:col-span-2 ">
                    <button type="button" onClick={handleClickButton} className="mr-0 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Buscar</button>
                
                    <button type="button" 
                    onClick={()=>{
                        modalAddUser.show();
                    }} 
                    className="ml-2 mr-0 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Añadir asociado</button>
                </div>

            </div>

            <div className="flex mb-1">
                <div className="flex items-center mr-4">
                    <span className="bg-green-300 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">T</span>
                    <label  className="text-sm font-medium text-gray-900 dark:text-gray-300">TRABAJÓ</label>
                </div>
                <div className="flex items-center mr-4">
                    <span className="bg-red-300 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">NT</span>
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-300">NO TRABAJO</label>
                </div>
               
                <div className="flex items-center mr-4">
                    <span className="bg-yellow-300 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">TS</span>
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-300">TRABAJO DE SUPLENCIA</label>
                </div>
            </div>
            <AttendanceList filterObj={filterObj} daysOfMonth={daysOfMonth} attendancesOfMonth={attendancesOfMonth} modal={modal} 
            setAttendanceIncidence={setAttendanceIncidence} attendanceIncidence={attendanceIncidence} />
            <AttendanceRegisterForm filterObj={filterObj}  modal={modal} setModal={setModal} fetchAttendancesOfMonth={fetchAttendancesOfMonth} 
            setAttendanceIncidence={setAttendanceIncidence} attendanceIncidence={attendanceIncidence} initialStateIncidence={initialStateIncidence} attendancesOfMonth={attendancesOfMonth}  />
            <AttendanceAddUserForm modalAddUser={modalAddUser} setModalAddUser={setModalAddUser} users={users} 
            attendanceListUser={attendanceListUser} setAttendanceListUser={setAttendanceListUser} filterObj={filterObj} fetchAttendancesOfMonth={fetchAttendancesOfMonth} initialState={initialState} />

        </>
    )
}

export default AttendancePage