
import { IPerson, IUser } from '@/app/types';


async function getSuppliers(){
    
    const res =await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            query: `
                query {
                    suppliersByFortnightAndProductTariff(fortnightValue:${202391}, productTariffId:${5}) {
                        id
                        names
                        isEnabled
                        countSupplierTariffs
                        priceMilkTomorrowByFortnight
                        priceMilkAfternoonByFortnight
                    }
                }
            `
        })
    })

    return res.json()
}

export default async function ProductionList() {
    const list = await getSuppliers()
    const suppliers = list.data.suppliersByFortnightAndProductTariff;
    /*const [priceMilkTomorrowByFortnight, setPriceMilkTomorrowByFortnight] = useState(
        suppliers[0].priceMilkTomorrowByFortnight
    );
    const [priceMilkAfternoonByFortnight, setPriceMilkAfternoonByFortnight] = useState(
        suppliers[0].priceMilkAfternoonByFortnight
    );

    const handleChangePriceMilkTomorrowByFortnight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriceMilkTomorrowByFortnight(event.target.value);
    };

    const handleChangePriceMilkAfternoonByFortnight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriceMilkAfternoonByFortnight(event.target.value);
    };*/
    return (
        <>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-4 border">ID</th>
                        <th scope="col" className="px-6 py-4 border">NOMBRES</th>
                        <th scope="col" className="px-6 py-4 border">PRECIO LECHE<br/>MAÑANA</th>
                        <th scope="col" className="px-6 py-4 border">PRECIO LECHE<br/>TARDE</th>
                        <th scope="col" className="px-6 py-4 border">ACCION</th>
                    </tr>
                </thead>
                <tbody>

                {suppliers.map((item: IPerson) => 
                    <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-2 py-2 border font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.id}</td>
                        <td className="px-2 py-2 border">{item.names}</td>
                        <td className="px-2 py-2 border">
                            {item.priceMilkTomorrowByFortnight}
                        </td>
                        <td className="px-2 py-2 border">
                            {item.priceMilkAfternoonByFortnight}
                        </td>
                        <td className="px-2 py-2 border"></td>
                    </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}
