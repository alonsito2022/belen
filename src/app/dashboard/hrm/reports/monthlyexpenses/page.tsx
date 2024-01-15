"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IExpenseOfWeekDay, ICategory, ISubsidiary, IExpensesByWeek, IUser, IDateAndWeekday, ISubcategory, IElement } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import MonthlyExpenseList from "./MonthlyExpenseList"
import {obtenerSemanaActual, getDates} from '@/libs/functions'
// import ExpenseForm from "./ExpenseForm"
import SubcategoryForm from "./SubcategoryForm"
import CategoryForm from "./CategoryForm"
import ElementForm from "./ElementForm";

const initialStateFilterObj = {
    cashId: 0,
    week: ""
}

const initialStateExpense = {
    id: 0,
    userId: 0,
    description: "",
    total: 0,
    categoryId: 0,
    subcategoryId: 0,
    transactionDate: "",
    transactionType: "S",
}

const initialStateSubcategory = {
    id: 0,
    name: "",
    subsidiaryId: 0,
    categoryId: 0,
    category: {
        id: 0,
        name: ""
    }
}

const initialStateCategory = {
    id: 0,
    name: "",
    subsidiaryId: 0
}

const initialStateElement = {
    id: 0,
    name: "",
    subsidiaryId: 0,
    categoryId: 0,
    subcategoryId: 0,
    subcategory: {
        id: 0,
        name: "",
        category: {
            id: 0,
            name: ""
        }
    }
}


function MonthlyExpensePage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);

    const [subcategories, setSubcategories] = useState< ISubcategory[]>([]);
    const [elements, setElements] = useState< IElement[]>([]);
    const [allSubcategories, setAllSubcategories] = useState< ISubcategory[]>([]);
    const [allElements, setAllElements] = useState< ISubcategory[]>([]);
    const [categories, setCategories] = useState< ICategory[]>([]);
    const [categoryModal, setCategoryModal] = useState< Modal | any>(null);
    const [subcategoryModal, setSubcategoryModal] = useState< Modal | any>(null);
    const [elementModal, setElementModal] = useState< Modal | any>(null);
    const [subcategory, setSubcategory] = useState<any | ISubcategory>(initialStateSubcategory);
    const [element, setElement] = useState<any | IElement>(initialStateElement);
    const [category, setCategory] = useState<any | ICategory>(initialStateCategory);
    const [subsidiaries, setSubsidiaries] = useState< ISubsidiary[]>([]);
    const { data: session } = useSession();
    const u = session?.user as IUser;

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

    async function fetchCategories(){
        let queryfecth = `
            query {
                categories {
                    id
                    name
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
            setCategories(data.data.categories);
        })
        
    }

    async function fetchAllSubcategories(){
        let queryfecth = `
            query {
                allSubcategories {
                    id
                    name
                    category {
                        id
                        name
                    }
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
            setAllSubcategories(data.data.allSubcategories);
        })
        
    }

    async function fetchAllElements(){
        let queryfecth = `
            query {
                allElements {
                    id
                    name
                    subcategory {
                        id
                        name
                        category {
                            id
                            name
                        }
                    }
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
            setAllElements(data.data.allElements);
        })
        
    }
    async function fetchSubcategories(id: number){
        let queryfecth = `
            query {
                subcategoriesByCategoryId(categoryId:${id}) {
                    id
                    name
                    category {
                        id
                        name
                    }
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
            setSubcategories(data.data.subcategoriesByCategoryId);
        })
        
    }

    async function fetchElements(id: number){
        let queryfecth = `
            query {
                elementsBySubcategoryId(subcategoryId:${id}) {
                    id
                    name
                    subcategory {
                        id
                        name
                    }
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
            setElements(data.data.elementsBySubcategoryId);
        })
        
    }

    useEffect(() => {
        fetchSubsidiaries();
        fetchAllElements();
    }, []);


    return (
        <>
            <Breadcrumb section={"Administración"} article={"Egresos mensuales"} />

            <MonthlyExpenseList
                categoryModal={categoryModal}
                setCategory={setCategory}
                category={category}

                subcategoryModal={subcategoryModal}
                setSubcategory={setSubcategory}
                subcategory={subcategory}

                elementModal={elementModal}
                setElement={setElement}
                elements={elements}

                allElements={allElements}

            />

            <CategoryForm 
                categoryModal={categoryModal}
                setCategoryModal={setCategoryModal}
                setCategory={setCategory}
                category={category}
                fetchAllElements={fetchAllElements}
                fetchCategories={fetchCategories}
                subsidiaries={subsidiaries}
                categories={categories}
            />

           <SubcategoryForm 
                subcategoryModal={subcategoryModal} 
                setSubcategoryModal={setSubcategoryModal} 
                setSubcategory={setSubcategory} 
                subcategory={subcategory} 
                fetchCategories={fetchCategories}
                fetchSubcategories={fetchSubcategories} 
                subsidiaries={subsidiaries}
                categories={categories}
                subcategories={subcategories}
                fetchAllElements={fetchAllElements}
            />

            <ElementForm
                setElementModal={setElementModal}
                elementModal={elementModal}
                subsidiaries={subsidiaries}
                categories={categories}
                subcategories={subcategories}
                elements={elements}
                setElement={setElement}
                element={element}
                fetchAllElements={fetchAllElements}
                fetchCategories={fetchCategories}
                fetchSubcategories={fetchSubcategories}
                fetchElements={fetchElements}
            />

        </>
    )
}

export default MonthlyExpensePage