import React from 'react'
import '../../../App.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

//custom components
import Spinner from '../../custom/Spinner';
import TicketService from '../../../services/TicketService';

const FindTicketPQRS = () => {
    //Ref
    const formSearchClient = React.useRef(null)
    const [formInfo, setFormInfo] = React.useState({
        id: "",
        buyerPartyID: ""
    })
    const [formError, setFormError] = React.useState(false)
    const [errorServiceRequest, setErrorServiceRequest] = React.useState(false)
    const [errorIdCorredor, setErrorIdCorredor] = React.useState(false)

    const [loading, setLoading] = React.useState(false)

    const navigate = useNavigate()

    //Functions
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (formInfo.id === "") {
            setFormError(true)
            setErrorServiceRequest(true)
            setLoading(false)
            setTimeout(() => {
                setFormError(false)
                setErrorServiceRequest(false)
            }, 4000)
        } else if (formInfo.buyerPartyID === "") {
            setFormError(true)
            setErrorIdCorredor(true)
            setLoading(false)
            setTimeout(() => {
                setFormError(false)
                setErrorIdCorredor(false)
            }, 4000)
        } else {
            await postData(formInfo)
        }
    }

    const postData = async (formInfo) => {
        let formData = {
            auditoria: {
                idPeticion: "12212",
                usuario: "jpalacia",
                ip: "10.1.1.1",
                fecha: "2022-01-01",
                hora: "10:10:10",
                operacionWeb: "consultaTicket",
                aplicativoPeticion: "consultaTicket"
            },
            serviceRequest: {
                srConsultaTicket: {
                    id: formInfo.id,
                    buyerPartyID: formInfo.buyerPartyID
                }
            }
        }
        try {
            let findTicket = await TicketService.fetchTicketPQRS(formData)
            if (findTicket.consultaTicket.serviceRequest === "") {
                setFormInfo({
                    id: "",
                    buyerPartyID: ""
                })
                toast.error("No hay ticket para mostrar", 3000)
                setLoading(false)
            } else {
                localStorage.setItem('idTicket', JSON.stringify(formInfo.id))
                localStorage.setItem('idClient', JSON.stringify(formInfo.buyerPartyID))
                setFormInfo({
                    id: "",
                    buyerPartyID: ""
                })
                navigate('/programa-referidos/pqrs/update-ticket')
                // console.log(findTicket)
                setLoading(false)
            }
        } catch (error) {
            setFormError(true)
            setLoading(false)
            setTimeout(() => {
                setFormError(false)
            }, 3000)
        }
    }

    return (
        <div className="App">
            <main className='App-main'>
                <section className='App-main-container'>
                    <div className='comf-container'>
                        <div className=''>
                            <div className='comf-col-12 container-text-informativo'>
                                <h2>Consulta de ticket clientes</h2>
                                <p className='comf-subtitulo'>Consulta el estado del ticket y califica la atención.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='App-main-container'>
                    <div className='components-main'>
                        <div className='cart-component'>
                            <div className='cart-header'>
                                <h2 className='title-form'>Consulta ticket PQRS Clientes Comfenalco</h2>
                                {
                                    formError && <h4 className='errorForm'>Hubo un error en el formulario, intenta de nuevo o contáctate con nosotros.</h4>
                                }

                            </div>
                            <div className='cart-main'>
                                {
                                    loading ?
                                        (
                                            <Spinner />
                                        )
                                        :
                                        (
                                            <form ref={formSearchClient} className='search-corredor' onSubmit={(e) => handleSubmit(e)}>
                                                <div>
                                                    <div className={!errorServiceRequest ? 'form-component' : 'form-component form-component-error'}>
                                                        <div className="fila-col">
                                                            <span htmlFor="type-identification" className="text-label label-select-form">Tipo de identificación fiscal *</span>
                                                            <span htmlFor="id-service-request" className='text-label label-select-form'>Número de solicitud de ticket *</span>
                                                                <input value={formInfo.id} onChange={(e) => setFormInfo({ ...formInfo, id: e.target.value })} type='number' id='id-service-request' name='id-service-request' className='number-identification input-form' />
                                                        </div>
                                                    </div>
                                                    {
                                                        errorServiceRequest && <h4 className='errorMsg'>Debes especificar el número de solicitud</h4>
                                                    }
                                                </div>
                                                <div>
                                                    <div className='row'>
                                                        <div className='fila-col'>
                                                            <div className='position-relative'>
                                                                <div className={!errorIdCorredor ? 'form-component' : 'form-component form-component-error'}>
                                                                    <span htmlFor="idClient" className='text-label label-select-form'>Código de cliente *</span>
                                                                    <input value={formInfo.buyerPartyID} onChange={(e) => setFormInfo({ ...formInfo, buyerPartyID: e.target.value })} type='number' id='idClient' name='idClient' className='number-identification input-form' />
                                                                </div>
                                                                {
                                                                    errorIdCorredor && <h4 className='errorMsg'>Debes especificar el código de cliente</h4>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className='form-component'>
                                                        <p className='nota-form'>* indica los campos requeridos</p>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <div className='form-component'>
                                                        {
                                                            formError ?
                                                                (
                                                                    <button className='btn-submit-search' type='button' readOnly>Consulta Ticket</button>
                                                                )
                                                                :
                                                                (
                                                                    <button className='btn-submit-search' type='submit'>Consulta Ticket</button>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </form>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default FindTicketPQRS