"use client";
import Link from 'next/link';
import {signOut, useSession} from 'next-auth/react';
// import {getServerSession} from 'next-auth';
interface UserSession {
  user_id?: number
  email?: string
  first_name?: string
  last_name?: string
  groups: Array<any>
  subsidiary: any
}
function Navbar() {

  // const session = await getServerSession();
  const { data: session } = useSession();
  
  const u = session?.user as UserSession;

  return (
    <nav className='bg-zinc-900 text-white p-4'>
        <div className='flex justify-between container mx-auto'>
            <Link href="/"><h1 className='font-bold text-xl'>NextAuth</h1></Link>
            <ul className='flex gap-x-2'>
              {
                u ? (
                  <>
                  <li className='px-3 py-1'>{u.email}</li>
                  <li className='px-3 py-1'><Link href="/dashboard/profile">Perfil</Link></li>
                  <li className='px-3 py-1'>
                    <button className='text-red-500' onClick={()=>signOut()}>Sign out</button>
                    </li>
                  </>
                  
                ): (

                  <>
                  
                  <li className='px-3 py-1'><Link href="/login">login</Link></li>
                  <li className='px-3 py-1'><Link href="/register">register</Link></li>
                  <li className='px-3 py-1'><Link href="/about">about</Link></li>
                  </>

                  )
                }
                
                
            </ul>
        </div>
    </nav>
  )
}

export default Navbar