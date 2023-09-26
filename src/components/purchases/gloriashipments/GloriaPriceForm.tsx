import { ChangeEvent ,useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { toast } from "react-toastify";

function GloriaPriceForm({selectedSupplier, setSelectedSupplier, fort, getGloriaShipments}: any) {

    async function getGloriaPrice(){
        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                query: `
                    {
                        clientTariffById(clientId:${528}, fortnightValue:${fort}) {
                            id
                            clientName
                            salePrice1
                        }
                    }
                `
            })
        })
        .then(res=>res.json())
        .then(data=>{
            setSelectedSupplier({...selectedSupplier, priceGloria: data.data.clientTariffById.salePrice1});
        })
    }

    async function saveGloriaPrice(){
        let queryFetch: String = "";
        
        queryFetch = `
            mutation{
                saveGloriaPrice(
                    clientId:${528},
                    salePrice1:${Number(selectedSupplier.priceGloria)!==0?selectedSupplier.priceGloria:0},
                    fortnightValue:${fort}
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
            toast(data.data.saveGloriaPrice.message, { hideProgressBar: true, autoClose: 2000, type: 'success' })
            getGloriaShipments()

        }).catch(e=>console.log(e))
        
    }

    useEffect(() => {

        if(fort>0 )
            getGloriaPrice();
    }, [fort]);

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {

        setSelectedSupplier({...selectedSupplier, [name]: value});
        
    }
    const handleClickButtonSave = (e: MouseEvent<HTMLButtonElement>) => {
        saveGloriaPrice()
    }
    return (
        <>
            

        <p id="priceGloria-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Precio Gloria </p>

        <form>   
            <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Precio</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                   


                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
  </svg>
                </div>
                <input type="number" name="priceGloria" id="priceGloria" onWheel={(e)=> e.currentTarget.blur()}  onFocus={(e) => e.target.select()}
                value={selectedSupplier.priceGloria} onChange={handleInputChange} className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Precio Gloria" required />
                <button type="button"  onClick={handleClickButtonSave} className="text-white absolute right-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Guardar</button>
            </div>
        </form>

        </>





    )
}

export default GloriaPriceForm