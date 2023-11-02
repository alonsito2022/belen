import { ChangeEvent ,useState, useEffect, useRef, MouseEvent, FormEvent } from "react";
import { Modal, ModalOptions } from 'flowbite'
import { toast } from "react-toastify";
import { ISubsidiary, IWarehouse } from '@/app/types';

function EmployeeRegisterForm({modal, setModal, user, setUser, fetchUsers, initialState} : any) {
    const [subsidiaries, setSubsidiaries] = useState< ISubsidiary[]>([]);
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setUser({...user, [name]: value});
    }

    const handleSaveEmployee = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let queryFetch: String = "";
        let operation: String = "create"
        if(user.subsidiaryId>0){
            if(Number(user.id)!==0){
                queryFetch = `
                    mutation{
                        updateUser(
                            id:${user.id}, 
                            firstName: "${user.firstName}", 
                            lastName: "${user.lastName}", 
                            document: "${user.document}", 
                            phone: "${user.phone}", 
                            address: "${user.address}", 
                            birthDate: "${user.birthDate}", 
                            phoneOfRelative: "${user.phoneOfRelative}", 
                            startDate: "${user.startDate}", 
                            endDate: "${user.endDate}", 
                            password: "${user.password}", 
                            email: "${user.email}", 
                            role: "${user.role}", 
                            subsidiaryId: ${user.subsidiaryId}, 
                            code: ${Number(user.code)}, 
                            remuneration: ${Number(user.remuneration)}, 
                            isActive: ${user.isActive}
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
                    toast(data.data.updateUser.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                    setUser(initialState);
                    modal.hide();
                    fetchUsers();
    
                }).catch(e=>console.log(e))
            }
            else{
                queryFetch = `
                    mutation{
                        createUser(
                            firstName: "${user.firstName}", 
                            lastName: "${user.lastName}", 
                            document: "${user.document}", 
                            phone: "${user.phone}", 
                            address: "${user.address}", 
                            birthDate: "${user.birthDate}", 
                            phoneOfRelative: "${user.phoneOfRelative}", 
                            startDate: "${user.startDate}", 
                            endDate: "${user.endDate}", 
                            password: "${user.password}", 
                            email: "${user.email}", 
                            role: "${user.role}", 
                            subsidiaryId: ${user.subsidiaryId}, 
                            code: ${Number(user.code)}, 
                            remuneration: ${Number(user.remuneration)}, 
                            isActive: ${user.isActive}
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
                    toast(data.data.createUser.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                    setUser(initialState);
                    modal.hide();
                    fetchUsers();
    
                }).catch(e=>console.log(e))
            }
        }else{
            toast("Seleccione sede", { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
        
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

    useEffect(() => {
        
        if(modal == null){
            console.log('useEffect modal definided')
            const $targetEl = document.getElementById('employee-modal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,
            };

            setModal(new Modal($targetEl, options))
        }
        fetchSubsidiaries();

    }, []);

    return (
        <>

            <div id="employee-modal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                                NUEVO EMPLEADO
                            </h3>
                        
                            <button type="button" onClick={()=>{modal.hide();}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEmployee}>
                                
                            <div className="grid gap-4 mb-4 sm:grid-cols-4">
                                <div className="sm:col-span-2">
                                    <label htmlFor="subsidiaryId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sede</label>
                                    <select id="subsidiaryId" 
                                    name="subsidiaryId" value={user.subsidiaryId} onChange={handleInputChange} required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={0}>Elegir sede</option>
                                        {subsidiaries.map((o,k)=>(
                                            <option key={k} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rol</label>
                                    <select id="role" 
                                    name="role" value={user.role} onChange={handleInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value={"01"}>Produccion</option>
                                        <option value={"02"}>Envios</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Codigo</label>
                                    <input type="number" id="code" 
                                    name="code" value={user.code} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" 
                                        required />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres</label>
                                    <input type="text" id="firstName" 
                                    name="firstName" value={user.firstName} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellidos</label>
                                    <input type="text" id="lastName" 
                                    name="lastName" value={user.lastName} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="document" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Documento</label>
                                    <input type="text" id="document" 
                                    name="document" value={user.document} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="45453473" />
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
                                    <input type="text" id="phone" 
                                    name="phone" value={user.phone} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="921267878" />
                                </div>

                                <div className="sm:col-span-1">
                                    <label htmlFor="remuneration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Remuneracion</label>
                                    <input type="number" id="remuneration" 
                                    name="remuneration" value={user.remuneration} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="1500" />
                                </div>
                                
                                <div className="sm:col-span-4">
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dirección</label>
                                    <input type="text" id="address" 
                                    name="address" value={user.address} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="Av. Aviacion S/N" />
                                </div>
                                
                                
                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input type="email" id="email" 
                                    name="email" value={user.email} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="uncorreo@gmail.com" />
                                </div>
                                
                                <div className="sm:col-span-1">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                                    <input type="password" id="password" 
                                    name="password" value={user.password} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="******" />
                                </div>
                                
                                <div className="sm:col-span-2">
                                    <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de Nac.</label>
                                    <input type="date" id="birthDate" 
                                    name="birthDate" value={user.birthDate} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="phoneOfRelative" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tel. Pariente</label>
                                    <input type="text" id="phoneOfRelative" 
                                    name="phoneOfRelative" value={user.phoneOfRelative} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de Inicio</label>
                                    <input type="date" id="startDate" 
                                    name="startDate" value={user.startDate} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de Finalización</label>
                                    <input type="date" id="endDate" 
                                    name="endDate" value={user.endDate} onChange={handleInputChange}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" 
                                        placeholder="" />
                                </div>

                                <div className="flex items-center">
                                    <input id="isActive" checked={user.isActive} type="checkbox" onChange={handleInputChange}  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</label>
                                </div>

                                <div className="sm:col-span-4 text-right">
                                    <hr className="mb-4"/>
                                    <button id="btn-save-product" type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ">
                                        + GUARDAR
                                    </button>
                                </div>
                                
                            </div>

                        </form>

                    </div>
                </div>
            </div>

            
            

            
        </>
    )
}

export default EmployeeRegisterForm