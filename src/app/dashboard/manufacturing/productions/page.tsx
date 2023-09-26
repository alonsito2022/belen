import ProductionList from './ProductionList';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { IPerson, IUser } from '@/app/types';

export default function ProductionPage() {
    console.log(process.env.NEXT_PUBLIC_BASE_API)
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

   