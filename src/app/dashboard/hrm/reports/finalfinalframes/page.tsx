"use client";
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IProfitData, IBethlehemData, IUser, IDateAndWeekday, ISubcategory, IElement } from '@/app/types';
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
    const [profitObject, setProfitObject] = useState<any|IProfitData>(null);

    async function fetchProfitObject(){
        let queryfecth = `
            query {
                profitByYear(year:${filterObj.year}) {
                    bethlehem{
                        sumQuantityMolds{
                            id
                            total
                        }
                        costAveragePerformancePerLiter{
                            id
                            total
                        }
                        totalInvestment{
                            id
                            total
                        }
                        totalSales{
                            id
                            total
                        }
                        finalUtility{
                            id
                            total
                        }
                    }
                        
                    otherCheeseSuppliers{
                        suppliers{
                            id
                            name
                            totalSales{
                            id
                            total
                            }
                        }
                        finalUtility{
                            id
                            total
                        }
                    }
                    invoices{
                        id
                        total
                    }
                    glory{
                        firstFortnight{
                            id
                            total
                        }
                        secondFortnight{
                            id
                            total
                        }
                    }
                    monthlyIncome{
                        id
                        total
                    }
                    profitDeductibles{
                        id
                        total
                    }
                    deductibleGlory{
                        id
                        total
                    }
                    netProfit{
                        id
                        total
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
            setProfitObject(data.data.profitByYear);
        })
        
    }
    

    useEffect(() => {
        fetchProfitObject();
    }, []);

    return (
        <>
            <Breadcrumb section={"Administración"} article={"Cuadro Final Final Restructurado"} />

            <FinalFinalFrameFilter filterObj={filterObj} setFilterObj={setFilterObj}  />

            <FinalFinalFrameList profitObject={profitObject} />

        </>
    )
}

export default FinalFinalFramePage