"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IProfitData, IBethlehemData, IAmountMonthData, ICheeseSupplierData } from '@/app/types';
import { toast } from "react-toastify";


function FinalFinalFrameList({profitObject}:any) {
    return (
        <>
            <div className="relative overflow-x-auto mt-2">

{profitObject?(
    <table className="w-full text-sm text-left text-black mt-3">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3 border border-gray-400" colSpan={2}>GANANCIAS</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">ENERO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">FEBRERO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">MARZO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">ABRIL</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">MAYO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">JUNIO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">JULIO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">AGOSTO</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">SEPTIEMBRE</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">OCTUBRE</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">NOVIEMBRE</th>
                <th scope="col" className="px-6 py-3 border border-gray-400">DICIEMBRE</th>
            </tr>
        </thead>
        <tbody>
        
        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400" rowSpan={5}>BELEN</td>
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">MOLDES PRODUCIDOS</td>
            {profitObject?.bethlehem.sumQuantityMolds.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400 text-center">{Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">COSTO POR MOLDE PROMEDIO</td>
            {profitObject?.bethlehem.costAveragePerformancePerLiter.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">INVERSION</td>

            {profitObject?.bethlehem.totalInvestment.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">VENTA</td>
            {profitObject?.bethlehem.totalSales.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        <tr className="bg-yellow-200 border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">UTILIDAD FINAL</td>
            {profitObject?.bethlehem.finalUtility.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>

        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400" rowSpan={(profitObject?.otherCheeseSuppliers.suppliers.length)?profitObject?.otherCheeseSuppliers.suppliers.length+2:1}>OTROS PROVEEDORES DE QUESOS</td>
            <td className='border border-gray-400 p-0' colSpan={13}></td>
        </tr>

        {profitObject?.otherCheeseSuppliers.suppliers.map((supplier: ICheeseSupplierData, s: number) => 
            <tr key={s} className="bg-white border-b text-right">
                <td className="px-4 py-2 border border-gray-400  whitespace-nowrap">{supplier.name}</td>
                {supplier.totalSales?.map((amount: IAmountMonthData, a: number) => 
                <td key={`${s}-${a}`} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
                )}
            </tr>
        )}

        <tr className="bg-yellow-200 border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">UTILIDAD FINAL</td>
            {profitObject?.otherCheeseSuppliers.finalUtility.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        
        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">FACTURAS</td>
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">IGV</td>
            {profitObject?.invoices.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        
        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap"  rowSpan={2}>GLORIA</td>
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">ACOPIO I SEMANA</td>
            {profitObject?.glory.firstFortnight.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>

        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">ACOPIO II SEMANA</td>
            {profitObject?.glory.secondFortnight.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>

        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" rowSpan={3}>OTROS PRODUCTOS</td>
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">ACEITUNA</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='olive12' type='number' /></td>
            
        </tr>

        <tr className="bg-white border-b text-right">
            
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">LECHE A FAVOR (A)</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorA12' type='number' /></td>
            
        </tr>

        <tr className="bg-white border-b text-right">
            
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">LECHE A FAVOR (B)</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='milkInFavorB12' type='number' /></td>
            
        </tr>



        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" rowSpan={2}>QUESOS</td>
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">PRESTADOS</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='borrowed12' type='number' /></td>
            
        </tr>

        <tr className="bg-white border-b text-right">
            
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">DEVUELTOS</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='returnedB12' type='number' /></td>
            
        </tr>

        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" rowSpan={2}>LECHE A FAVOR</td>
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">I QUINCENA</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='firstFortnight12' type='number' /></td>
            
        </tr>

        <tr className="bg-white border-b text-right">
            
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap">II QUINCENA</td>
            
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB1' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB2' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB3' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB4' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB5' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB6' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB7' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB8' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB9' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB10' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB11' type='number' /></td>
            <td className="px-2 py-2 border border-gray-400  whitespace-nowrap text-right"><input className='form-control' name='secondFortnightB12' type='number' /></td>
            
        </tr>





        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" colSpan={2}>INGRESO MENSUAL</td>
            {profitObject?.monthlyIncome.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>


        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" colSpan={2}>DEDUCIBLES GANANCIA</td>
            {profitObject?.profitDeductibles.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>

        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" colSpan={2}>DEDUCIBLE GLORIA</td>
            {profitObject?.deductibleGlory.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>

        <tr className="bg-white border-b text-right">
            <td className="px-4 py-2 border border-gray-400 whitespace-nowrap" colSpan={2}>UTILIDAD NETA</td>
            {profitObject?.netProfit.map((amount: IAmountMonthData) => 
                <td key={amount.id} className="px-4 py-2 border border-gray-400  whitespace-nowrap text-right">S/ {Number(amount.total).toFixed(1)}</td>
            )}
        </tr>
        
        </tbody>
    </table>
    ):(<></>)}
                
            </div>
        </>
    )
}

export default FinalFinalFrameList