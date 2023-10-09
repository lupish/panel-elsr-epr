import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function NavBar() {
  return (
    <nav className='flex justify-between items-center border-b-slate-700 border-b-2 bg-slate-300 h-auto'>
      <Image        
        src="/img/logo_truck_5.png"
        width={100}
        height={100}
        alt="logo"
        className='w-2/6 md:w-1/6'
        priority={true}
      />
      <ul className='flex justify-around items-center p-2 w-4/6 md:w-5/6 font-bold'>
        <li>
          <Link href="/">Definiciones</Link>
        </li>
        <li>
          <Link href="/archivosDat">Archivos DAT</Link>
        </li>
        <li>
          <Link href="/ejecucion">Ejecución</Link>
        </li>
        <li>
          <Link href="/resultados">
            Resultados
          </Link>
        </li>
      </ul>
    </nav>
  )
}
