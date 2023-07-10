import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

//import CustomComponents
import Spinner from '../../custom/Spinner';

//Import Services
// import ApiService from '../../../services/ApiService';
// import CorporateService from '../../../services/CorporateService';
// import IndividualCustomerService from '../../../services/IndividualCustomerService';
import TicketService from '../../../services/TicketService';
import RatingStart from '../../custom/RatingStart';

const InfoTicketPQRS = () => {
  const formUpdateTicket = React.useRef(null)
  //useState
  const navigate = useNavigate()
  const [rating, setRating] = React.useState(0);
  const [rating2, setRating2] = React.useState(0);
  const [rating3, setRating3] = React.useState(0);

  const [loading, setLoading] = React.useState(false)
  const [formError, setFormError] = React.useState(false)
  const [formInfo, setFormInfo] = React.useState({
    objectID: "",
    idTicket: "",
    ticketStatus: "",
    tipoTicket: "",
    whereTicket: "",
    inWhatTicket: "",
    detailTicket: "",
    yourComments: "",
    responseTicket: "",
    satisfaccinClaridad_KUT: "",
    satisfaccinFacilidad_KUT: "",
    satisfaccinLenguaje_KUT: ""
  })

  //Funsctions
  const inputChangeHandler = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormInfo(invoice => {
      return {
        ...invoice,
        [name]: value
      }
    })
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  const handleRatingChange2 = (newRating) => {
    setRating2(newRating);
  };
  const handleRatingChange3 = (newRating) => {
    setRating3(newRating);
  };

  const fetchTicketInfo = async () => {
    let idTicket = JSON.parse(localStorage.getItem("idTicket"))
    let idClient = JSON.parse(localStorage.getItem("idClient"))
    setLoading(true)
    if (idTicket !== null && idClient !== null) {
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
            id: idTicket,
            buyerPartyID: idClient
          }
        }
      }
      // console.log(formData)
      try {
        let getTicketInfo = await TicketService.fetchTicketPQRS(formData)
        // console.log(getTicketInfo)
        if (getTicketInfo.code === 'success') {
          setFormInfo({
            objectID: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.objectID,
            idTicket: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.ID,
            ticketStatus: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.serviceRequestUserLifeCycleStatusCodeText,
            tipoTicket: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.LISTADECATEGORIAS_KUTText,
            whereTicket: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.serviceTermsServiceIssueName,
            inWhatTicket: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.incidentCategoryName,
            // detailTicket: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.causeCategoryName,
            yourComments: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.descripcinmanifestacin,
            responseTicket: getTicketInfo.consultaTicket.serviceRequest.srConsulaTicket.Respuestamanifestacion_KUT
          })
          setLoading(false)
        } else {
          toast.error("No se puede traer la información del ticket", 3000)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        toast.error("No se puede traer la información del ticket", 3000)
        setLoading(false)
        setFormError(true)
        setTimeout(() => setFormError(false), 3000)
      }
    } else {
      toast.error("No se puede traer la información del ticket", 3000)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (formInfo.ticketStatus !== 'Cerrado.') {
      toast.error("No se puede actualizar el ticket", 3000)
      setLoading(false)
    } else {
      let updateTicketInfo = {
        auditoria: {
          idPeticion: "12212",
          usuario: "jpalacia",
          ip: "10.1.1.1",
          fecha: "2022-01-01",
          hora: "10:10:10",
          operacionWeb: "modificarTicket",
          aplicativoPeticion: "modificarTicket"
        },
        serviceRequest: {
          modificarTicket: {
            objectID: formInfo.objectID,
            descripcinmanifestacin: formInfo.yourComments,
            satisfaccinClaridad_KUT: `${rating}`,
            satisfaccinFacilidad_KUT: `${rating2}`,
            satisfaccinLenguaje_KUT: `${rating3}`
          }
        }
      }
      try {
        let updatedTicket = await TicketService.updateTicket(updateTicketInfo)
        // console.log("Updated Ticket Data",updatedTicket)
        if (updatedTicket.actualizarticket.Status === "Actualizado") {
          toast.success("Se calificó la PQRS correctamente", 3000)
          setLoading(false)
          navigate('/')
        } else {
          toast.error("Hubo un error al actualizar el ticket", 3000)
          setLoading(false)
        }
      } catch (error) {
        toast.error("Hubo un error al actualizar el ticket", 3000)
        setLoading(false)
      }
    }
  }

  React.useEffect(() => {
    void fetchTicketInfo()
  }, [])

  return (
    <div className="App">
      <main className='App-main'>
        <section className='Banner-informativo'>
          <div className='comf-container'>
            <div className=''>
              <div className='comf-col-12 container-text-informativo'>
                <h2>Consulta PQRS</h2>
                <p className='comf-subtitulo'>En esta ventana podrás consultar el estado del ticket y verificar actualizaciones realizadas.</p>
              </div>
            </div>
          </div>
        </section>
        <section className='App-main-container'>
          <div className='components-main'>
          <div className='cart-component'>

            
                <div className='cart-header margin-center'>
                  
                  <h2 className='title-form'>Consulta de PQRS Clientes Comfenalco</h2>
                  {
                    formError && <h4 className='errorForm'>Hubo un error en el envío del formulario, intenta de nuevo o contáctate con nosotros</h4>
                  }
                </div>

                


                <div className='card-main'>
                  {
                    loading ?
                      (
                        <Spinner />
                      )
                      :
                      (
                        <form ref={formUpdateTicket} className='' onSubmit={(e) => handleSubmit(e)}>
                          <div className=''>
                            <div className=''>
                              <div className="fila-col ">
                                <span htmlFor="idTicket" className="text-label label-select-form">ID del ticket *</span>
                                <input onChange={(e) => inputChangeHandler(e)} value={formInfo.idTicket} type='string' id='idTicket' name='idTicket' readOnly={true} className='number-identification input-form disabledTextInput' />
                              </div>
                              <div className="fila-col ">
                                <span htmlFor="ticketStatus" className="text-label label-select-form">Estado del ticket *</span>
                                <input onChange={(e) => inputChangeHandler(e)} value={formInfo.ticketStatus} type='string' id='ticketStatus' name='ticketStatus' readOnly={true} className='number-identification input-form disabledTextInput' />
                              </div>
                            </div>
                            <div className=''>
                              <div className="fila-col ">
                                <span htmlFor="tipoTicket" className="text-label label-select-form">Tipo de manifestación *</span>
                                <input onChange={(e) => inputChangeHandler(e)} value={formInfo.tipoTicket} type='string' id='tipoTicket' name='tipoTicket' readOnly={true} className='number-identification input-form disabledTextInput' />
                              </div>

                              <div className='fila-col '>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <span htmlFor="whereTicket" className='text-label label-select-form'>¿Dónde sucedió? *</span>
                                    <input onChange={(e) => inputChangeHandler(e)} value={formInfo.whereTicket} type='string' id='whereTicket' name='whereTicket' readOnly={true} className='number-identification input-form disabledTextInput' />
                                  </div>
                                </div>
                              </div>

                              <div className='fila-col '>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <span htmlFor="inWhatTicket" className='text-label label-select-form'>¿En qué servicio? *</span>
                                    <input onChange={(e) => inputChangeHandler(e)} value={formInfo.inWhatTicket} type='string' id='inWhatTicket' name='inWhatTicket' readOnly={true} className='number-identification input-form disabledTextInput' />
                                  </div>
                                </div>
                              </div>

                              {/* <div className='fila-col '>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <span htmlFor="detailTicket" className='text-label label-select-form'>Detalles *</span>
                                    <input onChange={(e) => inputChangeHandler(e)} value={formInfo.detailTicket} type='string' id='detailTicket' name='detailTicket' readOnly={true} className='number-identification input-form disabledTextInput' />
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>

                          <div className=''>
                            <div className=''>
                              <div className='fila-col '>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <span htmlFor="yourComments" className='text-label label-select-form'>Tus Comentarios</span>
                                    <input readOnly={true} onChange={(e) => inputChangeHandler(e)} value={formInfo.yourComments} type='string' id='yourComments' name='yourComments' className='razon-social input-form disabledTextInput' />
                                  </div>
                                </div>
                              </div>
                              <div className='fila-col '>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <span htmlFor="responseTicket" className='text-label label-select-form'>Respuesta Manifestación</span>
                                    <input readOnly onChange={(e) => inputChangeHandler(e)} value={formInfo.responseTicket} type='string' id='responseTicket' name='responseTicket' className='razon-social input-form disabledTextInput' />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {
                            formInfo.ticketStatus ==="Cerrado." &&
                            <>
                              <div className='comf-container'>
                                <h2 className='title-form'>Por favor califica los siguientes aspectos del servicio</h2>
                                <div className='fila-col '>
                                  <div className='position-relative'>
                                    <div className={'form-component'}>

                                      <div>
                                      <p className='min-with' style={{ fontSize: '1.2rem' }}>La <b>claridad</b> en la respuesta entregada a tu solicitud</p>
                                        <RatingStart rating={rating} onRatingChange={handleRatingChange} />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className='fila-col '>
                                  <div className='position-relative'>
                                    <div className={'form-component'}>
                                      <div>
                                        <p className='min-with' style={{ fontSize: '1.2rem' }}>El <b>lenguaje</b> utilizado para dar respuesta a la solicitud</p>
                                        <RatingStart rating={rating2} onRatingChange={handleRatingChange2} />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className='fila-col '>
                                  <div className='position-relative'>
                                    <div className={'form-component'}>
                                      <div>
                                      <p className='min-with' style={{ fontSize: '1.2rem' }}>La <b>facilidad</b> para registrar su solicitud</p>
                                        <RatingStart rating={rating3} onRatingChange={handleRatingChange3} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='comf-container'>
                                
                                <div>
                                  <div className='form-component'>
                                    {
                                      formError ?
                                        (
                                          <button className='btn-submit-search  margin-auto' type='button' readOnly>Actualizar PQRS</button>
                                        )
                                        :
                                        (
                                          <button className='btn-submit-search  margin-center' type='submit'>Actualizar PQRS</button>
                                        )
                                    }
                                  </div>
                                </div>
                              </div>
                            </>
                          }
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

export default InfoTicketPQRS