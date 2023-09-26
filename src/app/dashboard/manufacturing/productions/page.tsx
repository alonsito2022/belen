import ProductionList from './ProductionList';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { IPerson, IUser } from '@/app/types';

export default function ProductionPage({suppliers }:  any) {
    console.log(process.env.NEXT_PUBLIC_BASE_API)
    console.log('suppliers', suppliers)
    return (
        <main>
            <nav>
                <div>
                    <h2>suppliers</h2>
                </div>
            </nav>
            <ProductionList/>
        </main>
    )
}

   
export async function getServerSideProps() {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
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

    const suppliers = await res.json()
    // console.log(suppliers)
    return { props: { suppliers } }

}
