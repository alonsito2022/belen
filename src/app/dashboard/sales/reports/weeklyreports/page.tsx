"use client";
import { ChangeEvent ,useState, useEffect, FormEvent } from "react";
import { IEntriesByWeek, ISaleOfWeekDay, ICheeseSupplier, IDateAndWeekday } from '@/app/types';
import { toast } from "react-toastify";
import WeeklyReportList from "./WeeklyReportList";
import Breadcrumb from "@/components/Breadcrumb"
import { obtenerSemanaActual, getDates } from '@/libs/functions'

const initialStateFilterObj = {
    searchFullDateString: "",
    registerDate: "",
    productTariffId: 5,
    warehouseId: 7,
    supplierId: 0,
    week: "",
    role: "03",
    typeOfDairyProduct: "03",
    daysOfWeek: ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO','DOMINGO']
}

function WeeklyReportPage() {
    return (
        <>
            <Breadcrumb section={"Ventas"} article={"Balance semanal"} />
            
            <WeeklyReportList/>
        </>
    )
}

export default WeeklyReportPage