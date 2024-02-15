"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IMonthElementData, IMonthExpenseData, IUser, IDateAndWeekday, ISubcategory, IElement } from '@/app/types';
import { useSession} from 'next-auth/react';
import { toast } from "react-toastify";
import Breadcrumb from "@/components/Breadcrumb"
import { Modal, ModalOptions } from 'flowbite'
import {obtenerSemanaActual, getDates} from '@/libs/functions'
import FinalFinalFrameList from "./FinalFinalFrameList"
import FinalFinalFrameFilter from "./FinalFinalFrameFilter"

const initialStateFilterObj = {
    subsidiaryId: 2,
    year: new Date().getFullYear()
}

function FinalFinalFramePage() {
    const [filterObj, setFilterObj] = useState(initialStateFilterObj);
    const [categories, setCategories] = useState< IMonthElementData[]>([]);

    async function fetchCategories(){
        let queryfecth = `
            query {
                expensesByYearAndSubsidiary(year:${filterObj.year}, subsidiaryId:${filterObj.subsidiaryId}) {
                    sequence
                    name
                    type
                    months{
                        monthIndex
                        amount
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
            // setCategories(data.data.expensesByYearAndSubsidiary);
        })
        
    }
    

    useEffect(() => {
        // fetchCategories();
    }, []);

    return (
        <>
            <Breadcrumb section={"Administración"} article={"Cuadro Final Final Restructurado"} />

            <FinalFinalFrameFilter filterObj={filterObj} setFilterObj={setFilterObj}  />

            <FinalFinalFrameList categories={categories} />

        </>
    )
}

export default FinalFinalFramePage