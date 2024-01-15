import { ChangeEvent ,useState, useEffect, useRef, MouseEvent, FormEvent } from "react";
import { Modal, ModalOptions } from 'flowbite'
import { toast } from "react-toastify";
import { IAttendanceOfMonth, IUser } from '@/app/types';



function AttendanceRegisterForm({filterObj, modal, setModal, fetchAttendancesOfMonth, setAttendanceIncidence, attendanceIncidence, initialStateIncidence, attendancesOfMonth}:any) {
    
    
    const [statusChoices, setStatusChoices] = useState([
        { id:'T', name:'TRABAJO'}, { id:'NT', name:'NO TRABAJO'}, { id:'NA', name:'NO APLICA'}]);
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setAttendanceIncidence({...attendanceIncidence, [name]: value});
    }

    const handleSaveAttendanceIncidence = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";

        queryFetch = `
            mutation{
                updateAttendanceIncidence(
                    attendanceDetailId:${attendanceIncidence.attendanceDetailId}, 
                    statusChoice: "${attendanceIncidence.statusChoice}"
                    observation: "${attendanceIncidence.observation}"
                    substituteEmployeeId: ${attendanceIncidence.substituteEmployeeId!=undefined?attendanceIncidence.substituteEmployeeId:0}
                ){
                    message
                }
            }
        `;  
        // console.log(queryFetch)    

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({query: queryFetch})
        })
        .then(res=>res.json())
        .then(data=>{
            toast(data.data.updateAttendanceIncidence.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            setAttendanceIncidence(initialStateIncidence);
            modal.hide();
            fetchAttendancesOfMonth();

        }).catch(e=>console.log(e))
    }

    useEffect(() => {
        
        if(modal == null){
            console.log('useEffect modal definided')
            const $targetEl = document.getElementById('attendance-modal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,
            };

            setModal(new Modal($targetEl, options))
        }
    }, []);

    return (
        <>
            <div id="attendance-modal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                                Reportar asistencia
                            </h3>
                        
                            <button type="button" onClick={()=>{modal.hide();}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveAttendanceIncidence}>
                                
                            <div className="grid gap-4 mb-4 sm:grid-cols-4">
                                
                                


                                <div className="sm:col-span-2">
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres</label>
                                    <input type="text" id="firstName" 
                                    name="firstName" value={attendanceIncidence.firstName} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellidos</label>
                                    <input type="text" id="lastName" 
                                    name="lastName" value={attendanceIncidence.lastName} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                

                                <div className="sm:col-span-2">
                                    <label htmlFor="registerDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha</label>
                                    <input type="date" id="registerDate" 
                                    name="registerDate" value={attendanceIncidence.registerDate} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>


                                <div className="sm:col-span-2">
                                    <label htmlFor="statusChoice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                                    <select id="statusChoice" disabled={attendanceIncidence.replacementEmployeeId>0?true:false}
                                    name="statusChoice" value={attendanceIncidence.statusChoice} onChange={handleInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={"T"}>TRABAJO</option>
                                        <option value={"NT"}>NO TRABAJO</option>
                                        <option value={"TS"}>TRABAJO DE SUPLENCIA</option>
                                        <option value={"NA"}>NO APLICA</option>
                                    </select>
                                </div>

                                {attendanceIncidence.statusChoice=="NT"?

                                    <div className="sm:col-span-4">
                                        <label htmlFor="substituteEmployeeId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Suplente </label>
                                        <select id="substituteEmployeeId" name="substituteEmployeeId" 
                                        
                                        
                                        value={attendanceIncidence.substituteEmployeeId} onChange={handleInputChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value={0}>Elegir asociado</option>
                                            {attendancesOfMonth?.filter((u: IAttendanceOfMonth) => (u.employee?.id !== attendanceIncidence.employeeId)).map((u: IAttendanceOfMonth)=>(
                                                <option key={u.employee?.id} value={u.employee?.id}>{u.employee?.lastName}, {u.employee?.firstName} {u.employee?.remuneration}</option>
                                            ))}
                                        </select>
                                    </div>

                                :""}

                                {attendanceIncidence.replacementEmployeeId>0?(
                                <div className="sm:col-span-4">
                                    <label htmlFor="replacementEmployeeId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reemplazo a</label>
                                    <select id="replacementEmployeeId" name="replacementEmployeeId" 
                                    disabled={attendanceIncidence.replacementEmployeeId>0?true:false}
                                    value={attendanceIncidence.replacementEmployeeId} onChange={handleInputChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value={0}>Elegir asociado</option>
                                            {attendancesOfMonth?.map((u: IAttendanceOfMonth)=>(
                                                <option key={u.employee?.id} value={u.employee?.id}>{u.employee?.lastName}, {u.employee?.firstName} {u.employee?.remuneration}</option>
                                            ))}
                                        </select>
                                </div>
                                ):""}



                                
                                <div className="sm:col-span-4">

                                    <label htmlFor="observation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Observacion</label>
                                    <textarea id="observation" name="observation" maxLength={400} rows={4} value={attendanceIncidence.observation || ''} onChange={handleInputChange} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Comentarios aquí..."></textarea>

                                </div>

                                {attendanceIncidence.replacementEmployeeId==0?(

                                <div className="sm:col-span-4 text-right">
                                    <hr className="mb-4"/>
                                    <button id="btn-save-product" type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
                                        + GUARDAR
                                    </button>
                                </div>
                                ):""}
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceRegisterForm