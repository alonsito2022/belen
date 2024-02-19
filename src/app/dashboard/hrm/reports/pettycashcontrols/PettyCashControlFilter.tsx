import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { IElement, ISubsidiary } from '@/app/types';

function PettyCashControlFilter({filterObj, setFilterObj, modal, cashFlow, setCashFlow, subsidiaries}: any) {

    const [years, setYears] = useState< number[]>([]);
    const currentYear = new Date().getFullYear() - 1;
    const consecutiveYears = Array.from({ length: 3 }, (_, index) => currentYear + index);


    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setFilterObj({...filterObj, [name]: value});
    }


    useEffect(() => {
        
    }, []);

    return (
        <div className="flex items-center justify-between bg-gray-100 p-2 border gap-2 border-gray-200">


                <div className="">
                            <input 
                                type="date" 
                                name="startDate" 
                                value={filterObj.startDate} 
                                onChange={handleInputChange} 
                                onFocus={(e) => e.target.select()} 
                                className="form-control"
                            />
                        </div>
                    
                        <div className="">
                            <input 
                                type="date" 
                                name="endDate" 
                                value={filterObj.endDate} 
                                onChange={handleInputChange} 
                                onFocus={(e) => e.target.select()} 
                                className="form-control"
                            />
                        </div>

                <div className="flex flex-row gap-4">
                    <label htmlFor="subsidiaryId4" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sede:</label>
                     <select name="subsidiaryId" id="subsidiaryId4" onChange={handleInputChange} value={filterObj.subsidiaryId} className="form-control">
                            
                            {subsidiaries.map((o: ISubsidiary,k: number)=>(
                                    <option key={k} value={o.id}>{o.name}</option>
                                ))}
                        </select>
                </div>
                <button  onClick={(e)=>{
                            modal.show();
                            document.getElementById("modal-title")!.innerHTML = "Nuevo operacion";
                            document.getElementById("btn-save-product")!.innerHTML = "Guardar operacion";
                            setCashFlow({...cashFlow, 
                                id: 0,
                                description: "",
                                total: 0
                            });
                        
                            
                    }} className="btn-green border px-5 py-2.5" type="button">
                    Nuevo
                    </button>
                    </div>
    )
}

export default PettyCashControlFilter