"use client";
import { ChangeEvent ,useState, FormEvent } from "react";
import { IOperationDetail, ICheeseSupplier, IPerson } from '@/app/types';
import { toast } from "react-toastify";


function EntryList({suppliers, entries, entry, setEntry, fetchEntries, initialState, modal, setFilterObj, filterObj, obtenerFechaInicioFin, fechaInicio, fechaFin, fetchSuppliers, suppliersWithoutWeek} : any) {

    const [supplier, setSupplier] = useState<any | IPerson>(initialState)

    
    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setSupplier({...supplier, [name]: value});
    }

    

    const handleInputChangeWeek = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        // Obtener el año y el número de semana desde el formato "yyyy-Www"
        if(name=="week") obtenerFechaInicioFin (value)
        setFilterObj({...filterObj, [name]: value});
    }
    const handleSaveSupplier = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let queryFetch: String = "";
        if(supplier.id>0){
            queryFetch = `
                mutation{
                    saveSupplierWithWeek(
                        supplierId:${supplier.id},
                        typeOfDairyProduct:"03", 
                        weekValue:${Number(filterObj.week.toString().replace("-W", ""))}
                    ){
                        message
                    }
                }
            `;
            console.log(queryFetch)
            
            await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({query: queryFetch})
            })
            .then(res=>res.json())
            .then(data=>{
                toast(data.data.saveSupplierWithWeek.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setSupplier(initialState);
                modal.hide();
                fetchSuppliers();

            }).catch(e=>console.log(e))
        }

    };
    return (
        <>
            <div className="relative overflow-x-auto mt-2">



                <div className="flex items-center justify-between bg-gray-100 p-2 border gap-2 border-gray-200">
                    
                    <div className="">
                        <input type="week" name="week" value={filterObj.week } onChange={handleInputChangeWeek} className="form-control" />
                    </div>

                    <div className="">
                    {fechaInicio && fechaFin && (
                        <p className=" text-2xl font-thin">{`Del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`}</p>
                    )}
                    </div>

                    <div className="">
                        <select name="supplierSelectedId" onChange={handleInputChangeWeek} value={filterObj.supplierSelectedId} className=" form-control mb-3">
                            <option value={0}>ELEGIR PROVEEDOR</option>
                            {suppliers.map((o: ICheeseSupplier,k: number)=>(
                                <option key={k} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>

                    <button  onClick={(e)=>{
                            modal.show();
                            document.getElementById("modal-title")!.innerHTML = "Nueva entrada";
                            document.getElementById("btn-save-product")!.innerHTML = "Guardar entrada";
                            setEntry({...entry, 
                                id: 0,
                                dayName: "",
                                supplierId: 0,
                                productTariffId: 0,
                                quantityMold: 0,
                                quantityBox: 0,
                                price: 0,
                            });
                        
                            
                    }} className="btn-lime border px-5 py-2.5" type="button">
                    Crear entrada
                    </button>

                </div>

                <div className="grid grid-cols-5 gap-3 bg-gray-300 mt-3">

                    <div className=" col-span-2 border p-2">

                        <form onSubmit={handleSaveSupplier}>
                                        
                        
                            <div className="">
                                <h2 className="mb-2  text-lg font-semibold text-gray-900 dark:text-white">Proveedores sin semana:</h2>
                                <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

                                <select name="id" id="id" onChange={handleInputChange} value={supplier.id} className=" form-control mb-3">
                                <option value={0}>ELIGA UN PROVEEDOR</option>
                                    {suppliersWithoutWeek.map((o: ICheeseSupplier,k: number)=>(
                                        <option key={k} value={o.id}>{o.name}</option>
                                    ))}
                                </select>

                                <div className=" text-left">
                                    <button id="btn-save-product" type="submit" className=" btn-green px-5 py-2.5 ">
                                        Agregar
                                    </button>
                                </div>
                                
                            </div>
                

                        </form>
                    </div>

                    <div className="  col-span-3 border p-4">


                        <h2 className="mb-2  text-lg font-semibold text-gray-900 dark:text-white">Proveedores asignados:</h2>
                    
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
                        <ul className="max-w-md space-y-1 text-gray-900 list-inside dark:text-gray-400">
                        {suppliers.map((item: ICheeseSupplier) => 
                            <li key={item.id} className="flex items-center">
                                <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                </svg>
                                {item.name}
                            </li>
                        )}
                        </ul>
                    
                    </div>
                </div>

                

                

                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className=" text-left font-bold text-lg">Ingresos de la semana</caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-4 border">PROVEEDOR</th>
                            <th scope="col" className="px-6 py-4 border">FECHA</th>
                            <th scope="col" className="px-6 py-4 border">DIA</th>
                            <th scope="col" className="px-6 py-4 border">PRODUCTO</th>

                            <th scope="col" className="px-6 py-4 border">MOLDES</th>
                            <th scope="col" className="px-6 py-4 border">PRECIO INGRESO</th>
                            <th scope="col" className="px-6 py-4 border">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                    {entries
                    .map((item: IOperationDetail) => 
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.operation?.supplier?.names}</td>
                            <td className="px-2 py-2 border uppercase">{item.operation?.formattedDate}</td>
                            <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white uppercase">{item.operation?.dayNameResult?.replace("Ã©", "É")}</td>
                            <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white uppercase">{item.productTariff?.productName}</td>
                            <td className="px-2 py-2 border">{item.quantity}</td>
                            <td className="px-2 py-2 border">S/ {Number(item.price).toFixed(2)}</td>
                            <td className="px-2 py-2 border">S/ {Number(item.quantity! * item.price!).toFixed(2)}</td>
                            
                        </tr>
                        )}
                    </tbody>
                </table>

                </div>
        </>
    )
}

export default EntryList