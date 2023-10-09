"use client"
import React from 'react'
import { useRef, useState } from "react";
import DataTable from 'react-data-table-component';



export default function Resultados() {
  const [saltos, setSaltos] = useState(false) // no uso saltos
  const [data, setData] = useState([])
  const [cargando, setCargando] = useState(false)
  const [patronCarpeta, setPatronCarpeta] = useState("C:\\proy_io\\Codigo\\archivosDAT\\nT12-nL3\\config1\\OUT\\")
  const [patronBusqueda, setPatronBusqueda] = useState("C:\\proy_io\\Codigo\\archivosDAT\\nT12-nL3\\config1\\OUT\\OUT_v1_it50_datos_nT12_nL1.out")
  const [detallesCorrida, setDetallesCorrida] = useState([])
  const [detallesArchivo, setDetallesArchivo] = useState("")

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
      <button onClick={() => handleDetalles(row)}>🔍</button>
    ),
    button: true, // Esto permite estilizar el botón
  },
];

  
  const form = useRef();

  const handleFormCambios = () => {
    const patronCarpeta = form.current.carpeta.value + "nT" + form.current.cantPeriodos.value + "-nL" + form.current.cantClientes.value + "\\" + form.current.config.value + "\\OUT\\"
    const patron = patronCarpeta + form.current.archivo.value;

    setPatronCarpeta(patronCarpeta)
    setPatronBusqueda(patron)
  }
  
  const handleBuscar = async (e) => {
    e.preventDefault()
    console.log("Buscar")

    try {
      setCargando(true)
      console.log(patronBusqueda)
      const response = await fetch(
        "http://localhost:8080/results/list"
        ,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carpeta: patronCarpeta,
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
  
  const handleDetalles = async (row) => {
    console.log(row)
    const nombreCompleto = patronCarpeta + row.nombreArchivo;
    console.log(nombreCompleto)
    setDetallesArchivo(row.nombreArchivo)

    try {
      const response = await fetch(
        "http://localhost:8080/results/details"
        ,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carpeta: patronCarpeta,
            archivo: row.nombreArchivo
          })
        }
      )
      console.log(response)
      console.log(response.status + " - " + response.status)

      if (response.status == 200) {
        const resp = await response.json()
        console.log(resp)
        
        setDetallesCorrida(resp)
      }

    } catch (error) {
      console.log(error)
    }


  }

  return (
    <div className='p-5 h-full flex flex-col'>
        <h1 className='text-2xl font-bold text-center'>Resultados de la heurística</h1>

        <div className='border-slate-700 border-4 rounded-md p-3'>
          <form ref={form} action="submit" onSubmit={handleBuscar} onChange={handleFormCambios}>
            <div className='grid grid-cols-3 grid-rows-2 gap-4 gap-x-16'>
              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="carpeta">Carpeta:</label>
                <input type="text" id="carpeta"
                    defaultValue={"C:\\proy_io\\Codigo\\archivosDAT\\"}
                    className='text-center overflow-ellipsis'
                />
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="archivo">Archivo:</label>
                <input type="text" id="archivo"
                    defaultValue={"OUT_v1_it50_datos_nT12_nL3.out"}
                    className='text-center overflow-ellipsis'
                />
              </div>

              <div className='grid grid-cols-2 py-2'>
                <label htmlFor="config">Config:</label>
                <select name="config" id="config">
                    <option value="config1">Config 1</option>
                    <option value="config2">Config 2</option>
                    <option value="config3">Config 3</option>
                    <option value="config4">Config 4</option>
                    <option value="config5">Config 5</option>
                    <option value="config6">Config 6</option>
                    <option value="config7">Config 7</option>
                    <option value="config8">Config 8</option>
                    <option value="config9">Config 9</option>
                    <option value="config10">Config 10</option>
                </select>
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="cantPeriodos">Cantidad de períodos:</label>
                <input type="number" id="cantPeriodos"
                    defaultValue={12} className='text-center'
                />
              </div>

              <div className='grid grid-cols-2 py-2' >
                <label htmlFor="cantClientes">Cantidad de clientes:</label>
                <input type="number" id="cantClientes"
                    defaultValue={3} className='text-center'
                />
              </div>     

              
            </div>

            <div className='py-5 px-5'>
              <p className='text-gray-600 font-bold'>Patrón de búsqueda: <span className='italic font-normal'>{patronBusqueda}</span></p>
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

        {detallesArchivo && (<div className='py-5 mb-10'>
          <p className='text-lg font-bold pb-2'>DETALLES DEL ARCHIVO {detallesArchivo}:</p>
          <ul className='grid grid-cols-4 gap-6'> 
            {Object.entries(detallesCorrida).map(([key, subArray]) => (
              <li key={key} >
                <h3 className="font-semibold underline">{key}</h3>
                <ul>
                  {subArray.map((item, index) => (
                    <li key={index}>
                      {
                        item.tipoCosto == "costoTotal" ? 
                        ( <><span className="font-semibold">Costo total:</span> {parseFloat(item.valor).toFixed(2)}</> )
                        : (
                          item.tipoCosto=="runtimeMS" ? 
                          <><span className="font-semibold">Runtime:</span> {parseFloat(item.valor).toFixed(2)} ms</>
                          : <><span className="font-semibold pl-4">{item.tipoCosto}:</span> {parseFloat(item.valor).toFixed(2)} </>
                        ) 
                      }
                      
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>)}

    </div>
  )
}
