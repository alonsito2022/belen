"use client";
import { useState, useEffect } from "react";
import FortnightSupplierList from "@/components/statisticalbulletins/fortnightsupplieranalysis/FortnightSupplierList"
import FortnightSupplierFilter from "@/components/statisticalbulletins/fortnightsupplieranalysis/FortnightSupplierFilter"
import { IProductTariff, IWarehouse, IOperation } from "@/app/types";

function FortnightSupplierAnalysisPage() {
    return (
        <>
            <h2 className="text-4xl font-bold dark:text-white pb-4">Boleta quincenal de proveedores</h2>
            <FortnightSupplierFilter />
            <FortnightSupplierList />
        </>

    )
}

export default FortnightSupplierAnalysisPage