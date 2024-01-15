
"use client"
import { FormEvent, useState, useEffect, ChangeEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const initialState = {
    email: "",
    password: "",
    role: "01"
}

function LoginPage() {
    const [error, setError] = useState("");
    const [user, setUser] = useState(initialState);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new  FormData(e.currentTarget)
        
        const res = await signIn('credentials', {
          email: formData.get("email"),
          password: formData.get("password"),
          role: user.role,
          redirect: false
        });
        if(res?.error) return setError(res.error as string);
        if(res?.ok) {
            console.log("res", res)
            return router.push('/dashboard')
        }

    }

    const handleInputChange = ({target: {name, value} }: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
        setUser({...user, [name]: value});
    }

    useEffect(() => {
        const landing = document.querySelector('.landing');
        const left = landing?.querySelector('.split.left');
        const right = landing?.querySelector('.split.right');
        left?.addEventListener('mouseenter',()=>{
            landing?.classList.add('hover_left');
        });
        left?.addEventListener('mouseleave',()=>{
            landing?.classList.remove('hover_left');
        });
        right?.addEventListener('mouseenter',()=>{
            landing?.classList.add('hover_right');
        });
        right?.addEventListener('mouseleave',()=>{
            landing?.classList.remove('hover_right');
        });

        const landing2 = document.querySelector('.landing2');
        const left2 = landing2?.querySelector('.split.left');
        const right2 = landing2?.querySelector('.split.right');
        left2?.addEventListener('mouseenter',()=>{
            landing2?.classList.add('hover_left');
        });
        left2?.addEventListener('mouseleave',()=>{
            landing2?.classList.remove('hover_left');
        });
        right2?.addEventListener('mouseenter',()=>{
            landing2?.classList.add('hover_right');
        });
        right2?.addEventListener('mouseleave',()=>{
            landing2?.classList.remove('hover_right');
        });
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            
            <div className="landing" id='landing'>
                <div className='split left flex items-center justify-center text-center'>
                    <h1>PLANTA<br/>CHUQUIBAMBA</h1>
                    <button type='button' className='btn-pink w-64 p-4 text-xl z-10' onClick={()=>{
                        const landing = document.querySelector('.landing')?.classList.add('d-none');
                        const landing2 = document.querySelector('.landing2')?.classList.add('d-none');
                        setUser({...user, role: "01"});
                    }}>Empieza ahora</button>
                    
                </div>
                <div className='split right flex items-center justify-center text-center'>
                    <h1>ALMACEN<br/>AQP</h1>
                    <button type='button' className='btn-pink w-64 p-4 text-xl z-10' onClick={()=>{
                            const landing = document.querySelector('.landing')?.classList.add('d-none');
                            const landing2 = document.querySelector('.landing2')?.classList.add('d-none');
                            setUser({...user, role: "02"});
                    }}>Empieza ahora</button>
                </div>
            </div>

            <div className="landing2" id='landing2'>
                <div className='split left flex items-center justify-center text-center'>
                    <h1>RECURSOS</h1>
                    <button type='button' className='btn-pink w-64 p-4 text-xl z-10' onClick={()=>{
                        const landing = document.querySelector('.landing')?.classList.add('d-none');
                        const landing2 = document.querySelector('.landing2')?.classList.add('d-none');
                        setUser({...user, role: "03"});
                    }}>Empieza ahora</button>
                    
                </div>
                <div className='split right flex items-center justify-center text-center'>
                    <h1>ADMIN</h1>
                    <button type='button' className='btn-pink w-64 p-4 text-xl z-10' onClick={()=>{
                        const landing = document.querySelector('.landing')?.classList.add('d-none');
                        const landing2 = document.querySelector('.landing2')?.classList.add('d-none');
                        setUser({...user, role: "04"});
                    }}>Empieza ahora</button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center px-6 py-2 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    <Image
                                src="/logo.png"
                                alt="user photo"
                                width={200}
                                height={200}
                                priority
                                />
                    
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-full xl:p-0 lg:max-w-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Inicio de sesión
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" onChange={handleInputChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            
                            <button type="submit" className={user.role=="01"?"btn-blue mr-2 mb-2 px-5 py-2.5 ":user.role=="02"?"btn-green mr-2 mb-2 px-5 py-2.5 ":user.role=="03"?"btn-red mr-2 mb-2 px-5 py-2.5 ":"btn-yellow mr-2 mb-2 px-5 py-2.5 "}>Login</button>
                            <a href="#landing" className="default-link" onClick={()=>{
                                const landing = document.querySelector('.landing')?.classList.remove('d-none');
                                const landing2 = document.querySelector('.landing2')?.classList.remove('d-none');
                            }}>Volver a elegir sede</a>

                            {error && <p className="text-sm font-light text-red-500 dark:text-red-400">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginPage