"use client"
import React from 'react'
import { useState, useRef, useEffect } from "react";

export default function Ejecucion() {

    const [esMasivo, setEsMasivo] = useState(false) // no es masivo
    const [saltos, setSaltos] = useState(false) // no uso saltos
    const [validationErrors, setValidationErrors] = useState({}); // errores
    const [ejecutada, setEjecutada] = useState(false); // ejecucion
    const [ejecutadaError, setEjecutadaError] = useState(false); // ejecucion con error
    const [archivoSalida, setArchivoSalida] = useState("");
    const [enEjecucion, setEnEjecucion] = useState(false); // ejecutando heuristica
    const [mensajeExitoso, setMensajeExitoso] = useState([]);


    const handleEsMasivo = () => {
        setEsMasivo(!esMasivo) // valor opuesto
    }

    const form = useRef();

    useEffect(() => {
        const cjtoArchivosSalida = archivoSalida.split(";");
        setMensajeExitoso(cjtoArchivosSalida);
    }, [archivoSalida]);
    
    const handleEjecutar = async (e) => {
        e.preventDefault();

        let error = false
        let errors = {};
        setEjecutada(false)
        setEjecutadaError(false)

        if (
            form.current.cantClientes.value <= 0
            || form.current.cantPeriodos.value <= 0
            || (!form.current.carpeta.value)
            || form.current.cantIters.value <= 0
            || form.current.cantSaltos.value < 0
        ) {
            error = true
            errors.error = "Todos los campos son obligatorios"
        } else {
            error = false
        }

        if (error) {
            setValidationErrors(errors);
            return;
        }

        // ejecutar heuristica
        setEnEjecucion(true)
        try {
            const status = await runHeuristic()
            if (status) {
                setEjecutada(true)
            } else {
                setEjecutadaError(true)
            }
        } catch (error) {
            setEjecutadaError(true)
        } finally {
            setEnEjecucion(false)
        }

        // Reiniciar el formulario y los errores después del envío exitoso
        setValidationErrors({});
    }

    const handleSaltos = () => {
        if (form.current.cantSaltos.value > 0) {
            setSaltos(true)
        } else {
            setSaltos(false)
        }
    }

    const runHeuristic = async () => {

        console.log("runHeuristic")
        
        const versionRegExp = form.current.version.value.match(/\d+/);
        let version = 1;
        if (versionRegExp) {
            version = parseInt(versionRegExp[0]);
        }

        const configRegExp = form.current.config.value.match(/\d+/);
        let config = 1;
        if (configRegExp) {
            config = parseInt(configRegExp[0]);
        }

        let tasaRecovery
        switch (form.current.tasa.value) {
            case "uno":
                tasaRecovery = 1;
                break
            case "medio":
                tasaRecovery = 0.5
                break
            default:
                tasaRecovery = 0
        }

        let saltosOdd = 0;
        if (form.current.estrategiaSaltos.value == "impar") {
            saltosOdd = 1;
        }

        let esMasivoParam = 0;
        
        if (esMasivo) {
            esMasivoParam = 1;
        }

        const response = await fetch("http://localhost:8080/heuristic/run", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: version,
                cantClientes: form.current.cantClientes.value,
                cantPeriodos: form.current.cantPeriodos.value,
                tasaRecovery: tasaRecovery,
                carpetaEntrada: form.current.carpeta.value,
                esMasivo: esMasivoParam,
                config: config,
                configArchivo: form.current.nombreArchivo.value,
                cantIteraciones: form.current.cantIters.value,
                cantSaltos: form.current.cantSaltos.value,
                estrategiaSaltos: saltosOdd
            })
        })

        console.log(response)
        
        if (response.status == 200) {
            const resp = await response.json()
            setArchivoSalida(resp.salida)
            console.log(resp)

            return true
        } else {
            return false
        }

    }

    return (
        <div className='p-5 h-full'>
            <h1 className='text-2xl font-bold text-center'>Ejecución de la heurística</h1>

            {validationErrors.error && (
              <div className="text-red-500 font-bold text-center">
                {validationErrors.error}
              </div>
            )}

            <form ref={form} action="submit" onSubmit={handleEjecutar}>
                <div className='py-4 flex justify-around'>
                    <div className='border-slate-700 border-4 rounded-md p-3 w-2/5'>
                        <h2 className='text-center text-xl font-bold'>GENERALES</h2>
                        
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
                            <label htmlFor="carpeta">Carpeta:</label>
                            <input type="text" id="carpeta"
                                defaultValue={"C:\\proy_io\\Codigo\\archivosDAT\\nT12-nL3\\"}
                                className='text-center overflow-ellipsis'
                            />
                        </div>

                        <div className='grid grid-cols-2 py-2'>
                            <label htmlFor="esMasivo">Masivo:</label>
                            <div className='flex'>
                                <input type="checkbox" id="esMasivo" onClick={handleEsMasivo}/>
                                <select name="config" id="config"
                                    className={`${esMasivo ? 'hidden' : 'block text-center ml-1'}`}
                                >
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
                                <input
                                    className={`${esMasivo ? 'hidden' : 'block ml-1 w-full text-center overflow-ellipsis'}`}
                                    type="text" id="nombreArchivo" placeholder='Nombre de archivo' 
                                    defaultValue={"BBBAM"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='border-slate-700 border-4 rounded-md p-3 w-2/5'>
                        <h2 className='text-center text-xl font-bold'>HEURÍSTICA</h2>

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
                </div>

                <div className='flex flex-col justify-center items-center w-full'>
                    <button
                        className='w-1/6 text-center border-2 p-5 font-bold rounded-lg bg-slate-400 hover:bg-slate-900 hover:text-white shadow-sm'
                        type="submit"
                    >
                        EJECUTAR HEURÍSTICA
                    </button>

                    {enEjecucion && (
                        <div className="text-blue-500 font-bold text-center">
                            Heurística ejecutándose...
                        </div>
                    )}

                    {ejecutada && (
                        <div className="text-green-500 font-bold text-center">
                            <p>La salida se guardó en:</p>
                            <ul className='list-disc ml-5'>
                                {mensajeExitoso.map((valor, index) => (
                                    <li key={index}>{valor}</li>
                                ))}
                            </ul>
                      </div>
                    )}

                    {ejecutadaError && (
                        <div className="text-red-500 font-bold text-center">
                            Ocurrió un error al conectarse con el servidor.
                        </div>
                    )}
                </div>

            </form>

        </div>
    )
}
