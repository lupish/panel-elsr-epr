"use client"
import React from 'react'
import { useRef, useState } from "react";
import DataTable from 'react-data-table-component';



export default function Resultados() {
  const [saltos, setSaltos] = useState(false) // no uso saltos
  const [data, setData] = useState([])
  const [cargando, setCargando] = useState(false)

  const customStyles = {
    rows: {
      style: {
        color: "STRIPEDCOLOR",
        backgroundColor: "STRIPEDCOLOR"
      },
      stripedStyle: {
        color: "NORMALCOLOR",
        backgroundColor: "NORMALCOLOR"
      }
    },
  };

  const tableCustomStyles = {
    table: {
      style: {
        borderRadius: '10px', // Ajusta el valor según el redondeo deseado
        overflow: 'hidden', // Asegura que los bordes redondeados se muestren correctamente
      },
    },
    header: {
      style: {
        color:'#223336',
        backgroundColor: 'rgb(241 245 249)',
      },

    },
    head: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    headRow: {
      style: {
        color:'#223336',
        backgroundColor: 'rgb(229 231 235)',
      },
    },
    rows: {
      style: {
        backgroundColor: "white"
      },
      stripedStyle: {
        backgroundColor: "rgb(249 250 251)"
      }
    },
    pagination: {
      style: {
        backgroundColor: "rgb(229 231 235)"
      }
    }
  }
  

  const columns = [
    {
      name: 'Fecha',
      selector: row => row.fechaCreacion,
      sortable: true,
      width: "530px",
      cell: row => {
        const fecha = new Date(row.fechaCreacion);
        // Formatear la fecha en el nuevo formato (yyyy-mm-dd hh:mm:ss)
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const día = String(fecha.getDate()).padStart(2, '0');
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minuto = String(fecha.getMinutes()).padStart(2, '0');
        const segundo = String(fecha.getSeconds()).padStart(2, '0');

        return `${año}-${mes}-${día} ${hora}:${minuto}:${segundo}`;
      }
    },
    {
      name: 'Archivo',
      selector: row => row.nombreArchivo,
      sortable: true,
      width: "630px"
    },
    {
        name: 'Versión',
        selector: row => row.version,
        sortable: true,
        width: "100px",
    },
    {
      name: 'Tasa',
      selector: row => row.tasaRecovery,
      sortable: true,
      width: "100px",
  },
  {
    name: 'Ver más',
    width: "100px",
    cell: row => (
      <button onClick={() => handleIconClick(row)}>🔍</button>
    ),
    button: true, // Esto permite estilizar el botón
  },
];

const data2 = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]
  
  const form = useRef();

  const handleSaltos = () => {
    if (form.current.cantSaltos.value > 0) {
        setSaltos(true)
    } else {
        setSaltos(false)
    }
  }
  
  const handleBuscar = async (e) => {
    e.preventDefault()
    console.log("Buscar")

    try {
      setCargando(true)
      const response = await fetch(
        "http://localhost:8080/results/list"
        ,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carpeta: form.current.carpeta.value,
            archivo: form.current.archivo.value
          })
        }
      )
      console.log(response)
      console.log(response.status + " - " + response.status)

      if (response.status == 200) {
        const resp = await response.json()
        setData(resp)
        console.log(resp)
      }

      setCargando(false)
    } catch (error) {
      console.log(error)
    }

  }
  
  return (
    <div className='p-5 h-full flex flex-col'>
        <h1 className='text-2xl font-bold text-center'>Resultados de la heurística</h1>

        <div className='border-slate-700 border-4 rounded-md p-3'>
          <form ref={form} action="submit" onSubmit={handleBuscar}>
            <div className='grid grid-cols-3 grid-rows-3 gap-4 gap-x-16'>
              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="carpeta">Carpeta:</label>
                <input type="text" id="carpeta"
                    defaultValue={"C:\\proy_io\\Codigo\\archivosDAT\\nT12-nL3\\config1\\"}
                    className='text-center overflow-ellipsis'
                />
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="archivo">Archivo:</label>
                <input type="text" id="archivo"
                    defaultValue={"datos_nT24_nL3_AAAAM.dat"}
                    className='text-center overflow-ellipsis'
                />
              </div>

              <div className='grid grid-cols-2 py-2'>
                <label htmlFor="version">Nro versión:</label>
                <select name="version" id="version" className='text-center'>
                  <option value="tsv1">TSv1</option>
                  <option value="tsv2">TSv2</option>
                  <option value="tsv3">TSv3</option>
                  <option value="tsv4">TSv4</option>
                  <option value="tsv5">TSv5</option>
                </select>
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="cantIters" >Cantidad de iteraciones:</label>
                <input type="number" id="cantIters"
                    defaultValue={50} className='text-center'    
                />
              </div>
              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="cantClientes"  >Cantidad de clientes:</label>
                <input type="number" id="cantClientes"
                    defaultValue={3} className='text-center'    
                />
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="cantPeriodos">Cantidad de períodos:</label>
                <input type="number" id="cantPeriodos"
                    defaultValue={12} className='text-center'
                />
              </div>

              <div className='grid grid-cols-2 py-2'>
                <label htmlFor="tasa">Tasa de recovery:</label>
                <select name="tasa" id="tasa" className='text-center'>
                  <option value="cero">0</option>
                  <option value="medio">0.5</option>
                  <option value="uno">1</option>
                </select>
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="cantSaltos" >Cantidad de saltos:</label>
                <input type="number" id="cantSaltos"
                    defaultValue={0} className='text-center'
                    onChange={handleSaltos}
                />
              </div>

              <div className={`${saltos ? 'grid grid-cols-2 py-2' : 'hidden'}`}>
                <label htmlFor="estrategiaSaltos">Estrategia de saltos:</label>
                <select name="estrategiaSaltos" id="estrategiaSaltos" className='text-center'>
                  <option value="par">Par</option>
                  <option value="impar">Impar</option>
                </select>
              </div>
            </div>

            <div className='flex flex-col justify-center items-center w-full py-5'>
              <button
                className='w-1/6 text-center border-2 p-5 font-bold rounded-lg bg-slate-400 hover:bg-slate-900 hover:text-white shadow-sm'
                type="submit"
              >
                BUSCAR
              </button>
            </div>
          </form>
        </div>

        <div className='py-5 mb-10'>
          <DataTable
            columns={columns}
            data={data}
            progressPending={cargando}
            fixedHeader
            pagination
            highlightOnHover
            striped
            customStyles={tableCustomStyles}
          />

        </div>

        <div className='bg-gray-200 mb-20'>
          hola!
        </div>

    </div>
  )
}
