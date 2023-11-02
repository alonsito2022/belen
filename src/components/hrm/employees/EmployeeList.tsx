import { IUser} from '@/app/types';

function EmployeeList({users, modal, fetchUserByID}:any) {
    return (
        <>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="">
                        <tr>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-300 text-black">Nº</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-300">NOMBRES COMPLETOS</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">DOCUMENTO</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">TELEFONO</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">CORREO</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">ROL</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">SEDE</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-lime-500">¿ACTIVO?</th>
                            <th scope="col" className="px-2 py-2 border text-center font-bold bg-gray-300">ACCIONES</th>
                        </tr>
                    </thead>

                    <tbody>

                    {users.map((item: IUser) => 
                    <tr key={item.id} className="bg-white">
                        <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.id}</td>
                        <td className="px-2 py-1 font-normal bg-gray-100 text-black whitespace-nowrap border dark:text-white">{item.lastName}, {item.firstName}</td>
                        <td className="px-2 py-1 font-normal bg-lime-400 text-black whitespace-nowrap border dark:text-white">{item.document}</td>
                        
                        <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.phone}</td>
                        <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.email}</td>
                        <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.roleReadable}</td>
                        <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.subsidiary?.name}</td>
                        <td className="px-2 py-1 font-normal bg-lime-400 whitespace-nowrap border dark:text-white">{item.isActive?"SI":"NO"}</td>
                        <td className="px-2 py-1 font-normal bg-gray-100 whitespace-nowrap border dark:text-white">
                        <button type="button" onClick={ async ()=>{

                        await fetchUserByID(item.id);
                        modal.show();
                        document.getElementById("modal-title")!.innerHTML = "Editar empleado";
                        document.getElementById("btn-save-product")!.innerHTML = "Actualizar empleado";
                        }}
                        className="w-full block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                        Editar
                        </button>
                        </td>
                        
                    </tr>
                    )}


                    </tbody>
                </table>
            </div>
        </>
    )
}

export default EmployeeList