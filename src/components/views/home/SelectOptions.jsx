import React from 'react'
import { Link } from 'react-router-dom';

const SelectOptions = () => {
    return (
        <main className='App-main'>
            <section className='App-main-container'>
                <div className='comf-container'>
                    <div className=''>
                        <div className='comf-col-12 container-text-informativo'>
                            <h2>Gestión de corredores</h2>
                            <p className='comf-subtitulo'>En esta sección se podrán inscribir corredores para Comfenalco, consular el estado del proceso y el estado de las solicitudes.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='App-main-container'>
                <div className='comf-container'>
                    <div className='comf-row'>

                        <Link className='link-card-enlace' to={'/programa-referidos/corredor/buscar'}>
                            <div className="card-enlace">
                                <img src='./asset/icon-consultar.svg' alt='Icono crear corredor' />
                                <h3 className="title">Creación de corredor</h3>
                                
                            </div>
                        </Link>

                        <Link className='link-card-enlace' to={'/programa-referidos/corredor/find-corporate'}>
                            <div className="card-enlace">
                                <img src='./asset/icon-referir.svg' alt='Icono referir corredor' />
                                <h3 className="title">Referir empresa</h3>
                                
                            </div>
                        </Link>

                        {/* <Link className='link-card-enlace' to={'/programa-referidos/pqrs/find-client'}>
                            <div className="card-enlace">
                                <img src='./asset/Icon-2.svg' alt='Icono crear PQRS' />
                                <h3 className="title">Crea tu PQRSF</h3>
                                
                            </div>
                        </Link>

                        <Link className='link-card-enlace' to={'/programa-referidos/pqrs/find-ticket'}>
                            <div className="card-enlace">
                                <img src='./asset/icon-corredor.svg' alt='Icono crear PQRS' />
                                <h3 className="title">Consulta tu PQRSF</h3>
                            </div>
                        </Link>

                        <Link className='link-card-enlace' to={'/programa-referidos/clientes/find-client-by-update'}>
                            <div className="card-enlace">
                                <img src='./asset/Icon-1.svg' alt='Icono crear PQRS' />
                                <h3 className="title">Actualización de datos</h3>
                                
                            </div>
                        </Link> */}

                    </div>
                </div>
            </section>
        </main>
    )
}

export default SelectOptions