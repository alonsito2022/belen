"use client";
import { Modal, ModalOptions } from 'flowbite'
import { ChangeEvent, FormEvent ,useState, useEffect } from "react";
import { IProductTariff, IProduct, IUnit } from '@/app/types';
import { toast } from "react-toastify";

const initialState = {
    id: 0,
    productId: 0,
    unitId: 0,
    salePrice1: 0,
    salePrice2: 0,
    quantityMinimum: 0,
    productName: "",
    unitName: ""
}

function ProductTariffPage() {
    const [productTariffs, setProductTariffs] = useState< IProductTariff[]>([]);
    const [productTariff, setProductTariff] = useState(initialState);
    const [products, setProducts] = useState< IProduct[]>([]);
    const [units, setUnits] = useState< IUnit[]>([]);
    const [modal, setModal] = useState< Modal | any>(null);

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setProductTariff({...productTariff, [name]: value});
    }

    const handleSaveProductTariff = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let queryFetch: String = "";
        let operation: String = "create"
        if(Number(productTariff.id)!==0){
            queryFetch = `
                mutation{
                    updateProductTariff(
                        id:${productTariff.id}, productId:${productTariff.productId}, unitId:${productTariff.unitId}, salePrice1:${productTariff.salePrice1},
                        salePrice2: ${productTariff.salePrice2}, quantityMinimum: ${productTariff.quantityMinimum}
                    ){
                        productTariff {
                            id
                        }
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
                toast(data.data.updateProductTariff.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setProductTariff(initialState);
                modal.hide();
                fetchProductTariffs();

            }).catch(e=>console.log(e))
        }
        else{
            queryFetch = `
                mutation{
                    createProductTariff(
                        productId:${productTariff.productId}, unitId:${productTariff.unitId}, salePrice1:${productTariff.salePrice1},
                        salePrice2: ${productTariff.salePrice2}, quantityMinimum: ${productTariff.quantityMinimum}
                    ){
                        productTariff {
                            id
                        }
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
                toast(data.data.createProductTariff.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
                setProductTariff(initialState);
                modal.hide();
                fetchProductTariffs();

            }).catch(e=>console.log(e))
        }
    }

    async function fetchProductTariffs(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        productTariffs {
                            id
                            productId
                            unitId
                            salePrice1
                            salePrice2
                            productName
                            unitName
                            quantityMinimum
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setProductTariffs(data.data.productTariffs);
        })
        
    }

    async function fetchProducts(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        products {
                            id
                            name
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setProducts(data.data.products);
        })
    }

    async function fetchUnits(){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    query {
                        units {
                            id
                            shortName
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setUnits(data.data.units);
        })
    }

    async function fetchProductTariffByID(pk: number){

        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        productTariffById(pk: ${pk}){
                            id
                            productId
                            unitId
                            salePrice1
                            salePrice2
                            productName
                            unitName
                            quantityMinimum
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            
            setProductTariff(data.data.productTariffById);
        })
    }

    useEffect(() => {
        fetchProductTariffs();
        fetchProducts();
        fetchUnits();

        if(modal == null){
            console.log('useEffect modal definided')
            const $targetEl = document.getElementById('defaultModal');
            const options: ModalOptions = {
                placement: 'bottom-right',
                backdrop: 'static',
                backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                closable: false ,

            };
        
           // const modal = ;
            setModal(new Modal($targetEl, options))
        }
    }, []);


    return (
        <>

<h2 className="text-4xl font-bold dark:text-white pb-4">Presentaciones</h2>


       
<div className="flex justify-end mr-4">
    <button id="btn-new" onClick={(e)=>{
            modal.show();
            document.getElementById("modal-title")!.innerHTML = "Crear presentacion de producto";
            document.getElementById("btn-save-product")!.innerHTML = "Guardar presentacion de producto";
            setProductTariff(initialState);
            
    }} className=" block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">
     + Nuevo
    </button>

</div>


        <div className="p-4 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-3 py-3 text-center">#</th>
                        <th scope="col" className="px-3 py-3 text-center">NOMBRE</th>
                        <th scope="col" className="px-3 py-3 text-center">Unidad</th>
                        <th scope="col" className="px-3 py-3 text-center">Precio de venta 1</th>
                        <th scope="col" className="px-3 py-3 text-center">Precio de venta 2</th>
                        <th scope="col" className="px-3 py-3 text-center">Cantidad minima</th>
                        <th scope="col" className="px-3 py-3 text-center">AcCion</th>
                    </tr>
                </thead>
                <tbody>
                    {productTariffs.map((item) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="w-4 p-4  bg-gray-50 dark:bg-gray-800">{item.id}</td>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.productName}</th>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">{item.unitName}</td>
                        <td className="px-6 py-4">{item.salePrice1}</td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">{item.salePrice2}</td>
                        <td className="px-6 py-4">{item.quantityMinimum}</td>
                        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                            <button type="button" onClick={ async ()=>{

                                await fetchProductTariffByID(item.id);
                                modal.show();
                                document.getElementById("modal-title")!.innerHTML = "Editar presentacion de producto";
                                document.getElementById("btn-save-product")!.innerHTML = "Actualizar presentacion de producto";
                            }}
                            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Editar</button>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>



<div id="defaultModal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            
            <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                    Editar presentacion de Producto
                </h3>
                <button type="button" onClick={()=>{modal.hide();}} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            
            <form onSubmit={handleSaveProductTariff}>
                <input type="hidden" name="id" id="id" value={productTariff.id} />
                <div className="grid gap-4 mb-4 sm:grid-cols-1">



                    <div>
                        <label htmlFor="productId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Producto</label>
                        <select name="productId" id="productId" onChange={handleInputChange} value={productTariff.productId} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value={0}>Elige un producto</option>
                            {products.map((o,k)=>(
                                <option key={k} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                 
                 

                    <div>
                        <label htmlFor="unitId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unidad</label>
                        <select name="unitId" id="unitId" onChange={handleInputChange} value={productTariff.unitId} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>Elige una unidad</option>
                            {units.map((o,k)=>(
                                <option key={k} value={o.id}>{o.shortName}</option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label htmlFor="salePrice1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio Venta 1</label>
                        <input type="number" name="salePrice1" id="salePrice1" value={productTariff.salePrice1} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type product name" required />
                    </div>
                    <div>
                        <label htmlFor="salePrice2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio Venta 2</label>
                        <input type="number" name="salePrice2" id="salePrice2" value={productTariff.salePrice2} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Product brand" required />
                    </div>
                    <div>
                        <label htmlFor="quantityMinimum" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cant Min.</label>
                        <input type="number" name="quantityMinimum" id="quantityMinimum" value={productTariff.quantityMinimum} onChange={handleInputChange} onFocus={(e) => e.target.select()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="$2999" required />
                    </div>
                 

                
                </div>

                 


                <button id="btn-save-product" type="submit" className="text-white inline-flex items-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ">
                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                    Actualizar presentacion de producto
                </button>
            </form>
        </div>
    </div>
</div>

        </>
    )
}

export default ProductTariffPage