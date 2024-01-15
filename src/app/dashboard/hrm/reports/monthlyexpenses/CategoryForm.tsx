"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { ICategory, ISubsidiary } from '@/app/types';
import { toast } from "react-toastify";

function CategoryForm({categoryModal, setCategoryModal, setCategory, category, fetchAllElements, fetchCategories, subsidiaries, categories}: any) {

    const handleAddCity = async () => {
        if(category.subsidiaryId>0){
            let queryFetch: String = "";

            queryFetch = `
                mutation{
                    createCategory(
                        name: "${category.name.toString().trim()}",
                        subsidiaryId: ${category.subsidiaryId}
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
                toast(data.data.createCategory.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setCategory({
                    ...category, 
                    id: 0,
                    name: "",
                    subsidiaryId: 0
                });
                categoryModal.hide();
                fetchAllElements();

            }).catch(e=>console.log(e))


        }else{
            toast("Verifique sede", { hideProgressBar: true, autoClose: 2000, type: 'warning' })

        }
    }

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        
        if(name=="subsidiaryId"){
            fetchCategories(value)
            setCategory({...category, subsidiaryId: value});
        }
        else if(name=="name"){
            setCategory({...category, [name]: value});
        }
    }

    useEffect(() => {
        
        if(categoryModal == null){
            const $targetEl = document.getElementById('categoryFormModal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,
            };
        
            setCategoryModal(new Modal($targetEl, options))
        }

    }, []);

    
    return (
        <>
            <div id="categoryFormModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative w-full max-w-md max-h-full">

                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-category-title">
                                Editar proveedor
                            </h3>
                            <button type="button" id="btn-close-supplier-modal" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                             onClick={()=>{categoryModal.hide();}}>
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                        <form >

                            <div className="grid gap-4 mb-4 sm:grid-cols-1">

                        

                                <div>
                                    <label htmlFor="subsidiaryId" className="form-label">Sede:</label>
                                    <select name="subsidiaryId" id="subsidiaryId" onChange={handleInputChange} value={category.subsidiaryId} className="form-control">
                                        <option value={0}>{"ELEGIR"}</option>
                                        {subsidiaries.map((o: ISubsidiary,k: number)=>(
                                                <option key={k} value={o.id}>{o.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="name1" className="form-label">Razon:</label>
                                    <input
                                        type="search"
                                        value={category.name || ''}
                                        onChange={handleInputChange}
                                        list="listOfCategories"
                                        name="name"
                                        id="name1"
                                        className='form-control uppercase'
                                        placeholder="Escribe una razon"
                                        autoComplete='off'
                                    />

                                    <datalist id="listOfCategories">
                                        {categories.map((c: ICategory, index: number) => (
                                            <option key={index} value={c.name} />
                                        ))}
                                    </datalist>

                                    
                                </div>

                                
                           
                          
                            </div>

                            <div className=" text-right">
                                <button id="btn-save-category" type="button" onClick={handleAddCity} className="btn-green px-5 py-2.5">
                                    Guardar
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryForm