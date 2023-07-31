import React from 'react'
import '../../../../App.css'
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
// import CategoryData from '../../../../assets/CategoryData.json'
import { RemoveTilde } from '../../../../utils/functions'

//import CustomComponents
import Spinner from '../../../custom/Spinner';

//Import Services
import TicketService from '../../../../services/TicketService'
import CorporateService from '../../../../services/CorporateService';
import ApiService from '../../../../services/ApiService';

// const TipoTicketPQRS = [
//   {
//     value: "",
//     label: ""
//   },
//   {
//     value: "681",
//     label: "Asesoría"
//   },
//   {
//     value: "701",
//     label: "Sugerencia"
//   },
//   {
//     value: "691",
//     label: "Reclamo"
//   },
//   {
//     value: "711",
//     label: "Felicitación"
//   },
// ]

// const SuperCategory = [
//   {
//     value: "",
//     label: ""
//   },
//   {
//     label: "CLUB LA PLAYA",
//     value: "45000"
//   },
//   {
//     label: "UNIDAD REGIONAL SUROESTE",
//     value: "44000"
//   },
//   {
//     label: "UNIDAD REGIONAL URABA",
//     value: "43000"
//   }
// ]

const CanalComunicacion = [
  {
    value: "",
    label: ""
  },
  {
    label: "Correo Electrónico",
    value: "121"
  },
  {
    label: "Teléfonico",
    value: "151"
  }
]

const tipoIdentFiscal = [
  {
    value: '11',
    label: "Registro de nacimiento"
  },
  {
    value: '12',
    label: 'Tarjeta de identidad'
  },
  {
    value: '13',
    label: 'Cédula de ciudadanía'
  },
  {
    value: '16',
    label: 'Permiso especial venezolano'
  },
  {
    value: '21',
    label: 'Tarjeta de extranjería'
  },
  {
    value: '41',
    label: 'Pasaporte'
  }
]

const CreateTicketPQRS = () => {
  let typeUser = JSON.parse(localStorage.getItem('typeCusto'))

  let isValidNumCont = /^[0-9]{10}$/g
  let validEmail = /^[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9*+/={|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/g

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const obtainData = query.get('usuario')
  const params = window.atob(obtainData)

  const formCreateTicket = React.useRef(null)
  //useState
  const navigate = useNavigate()
  const [errors, setErrors] = React.useState({})
  const [ticketType, setTicketType] = React.useState([])
  const [serviceCategory, setServiceCategory] = React.useState([])
  const [serviceIssueCategory, setServiceIssueCategory] = React.useState([])
  const [serviceIssue, setServiceIssue] = React.useState([])
  const [selectedFile, setSelectedFile] = React.useState(null)
  // const [imageLoad, setImageLoad] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formError, setFormError] = React.useState(false)
  const [contactInfo, setContactInfo] = React.useState({})
  const [formInfo, setFormInfo] = React.useState({
    tipoTicket: "",
    whereTicket: "",
    inWhatTicket: "",
    detailTicket: "",
    canalComunicacion: "",
    yourComments: "",
    firstName: "",
    lastName: "",
    tipoIdentContacto: "",
    numIdentContacto: "",
    phone: "",
    email: "",
    aceptTerms: false
  })

  //Funsctions

  const backToHome = () => {
    navigate('/programa-referidos/pqrs/find-client')
  }

  const handlerSelectedCategory = React.useCallback(() => {
    if (formInfo.whereTicket !== "") {
      let category = formInfo.whereTicket
      let newIssue = serviceIssueCategory.filter((cat) => JSON.parse(cat.category_code) === JSON.parse(category))
      // console.log(category)
      // console.log(newIssue)
      // console.log(serviceIssueCategory)
      // console.log(CategoryData[category])
      setServiceIssue(newIssue)
    } else {
      setServiceIssue([])
    }
  }, [formInfo.whereTicket, serviceIssueCategory])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormError(false)
    const newErrors = {}

    if (formInfo.tipoTicket === "") newErrors.tipoTicket = "¿Cuál es tu tipo de manifestación? es requerido"
    if (formInfo.whereTicket === "") newErrors.whereTicket = "¿En qué sede ocurrió? es requerido"
    if (formInfo.inWhatTicket === "") newErrors.inWhatTicket = "¿En qué servicio? es requerido"
    if (formInfo.canalComunicacion === "") newErrors.canalComunicacion = "¿Cómo desea recibir su respuesta? es requerido"
    if (formInfo.aceptTerms === false) newErrors.aceptTerms = 'Si debes continuar, acepta los términos, condiciones y tratamiento de datos personales'


    if (Object.keys(newErrors).length === 0) {

      if (contactInfo.AccountID === undefined) {
        if (typeUser === 'NIT') {
          let isValidEmail = formInfo.email.match(validEmail)
          let isValidNumContact = formInfo.phone.match(isValidNumCont)

          if (isValidEmail === null) {
            toast.error(`El correo electrónico no es válido`, { autoClose: 4000, position: toast.POSITION.TOP_CENTER })
            setLoading(false)
            return
          }
          if (isValidNumContact === null) {
            toast.error(`El número de contácto no es válido`, { autoClose: 4000, position: toast.POSITION.TOP_CENTER })
            setLoading(false)
            return
          }
          let formData3 = {
            auditoria: {
              idPeticion: "12214",
              usuario: "jpalacia",
              ip: "10.1.1.1",
              fecha: "2022-01-01",
              hora: "10:10:10",
              operacionWeb: " DatosBasicosContacto ",
              aplicativoPeticion: "sdsdsd"
            },
            parametros: {
              contacto: {
                StatusCode: "2",
                FirstName: RemoveTilde(formInfo.firstName),
                LastName: RemoveTilde(formInfo.lastName),
                Tipodeidentificacindelcontacto_KUT: "11",
                Nmerodeidentificaciondelcontacto_KUT: formInfo.numIdentContacto,
                LanguageCode: "ES",
                ContactPermissionCode: "1",
                AccountID: params,
                FunctionCode: "Z033",
                DepartmentCode: "ZD01",
                Phone: "",
                Mobile: formInfo.phone,
                Email: formInfo.email,
                BusinessAddressCountryCode: "CO"
              }
            }
          }
          let response3 = await CorporateService.createCorporateContactData(formData3)
          if (response3.corporateInfoContactData.contacto) {
            let formData = {
              auditoria: {
                idPeticion: "122145",
                usuario: "jpalacia",
                ip: "10.1.1.1",
                fecha: "2022-01-01",
                hora: "10:10:10",
                operacionWeb: "attachTicket",
                aplicativoPeticion: "attachTicket"
              },
              serviceRequest: {
                crearTicket: {
                  processingTypeCode: "ZSAC",
                  LISTADECATEGORIAS_KUT: formInfo.tipoTicket,
                  serviceIssueCategoryID: formInfo.whereTicket,
                  incidentServiceIssueCategoryID: formInfo.inWhatTicket,
                  causeServiceIssueCategoryID: "",
                  descripcinmanifestacin: formInfo.yourComments,
                  name: "PQRSF Web",
                  buyerPartyID: params,
                  buyerMainContactPartyID: "",
                  iDCorredor: "",
                  canaldeComunicacin: formInfo.canalComunicacion
                }
              }
            }

            try {
              let ticketPQRS = await TicketService.createTicketIncripcion(formData)
              if (selectedFile) sendAttach(ticketPQRS.corporateInfo.crearTicket.ID)
              setLoading(false)
              localStorage.clear()
              toast.success(`Su PQRSF fue radicada con el ID #${ticketPQRS.corporateInfo.crearTicket.ID}. Próximamente nos estaremos comunicando con usted`, { autoClose: 4000 })
              return navigate(`/`)
            } catch (error) {
              toast.error(`Hubo un error al registrar su PQRSF`, { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
              setFormError(true)
              console.log(error)
              setLoading(false)
            }
          }
        } else {
          let formData = {
            auditoria: {
              idPeticion: "122145",
              usuario: "jpalacia",
              ip: "10.1.1.1",
              fecha: "2022-01-01",
              hora: "10:10:10",
              operacionWeb: "attachTicket",
              aplicativoPeticion: "attachTicket"
            },
            serviceRequest: {
              crearTicket: {
                processingTypeCode: "ZSAC",
                LISTADECATEGORIAS_KUT: formInfo.tipoTicket,
                serviceIssueCategoryID: formInfo.whereTicket,
                incidentServiceIssueCategoryID: formInfo.inWhatTicket,
                causeServiceIssueCategoryID: "",
                descripcinmanifestacin: formInfo.yourComments,
                name: "PQRSF Web",
                buyerPartyID: params,
                buyerMainContactPartyID: "",
                iDCorredor: "",
                canaldeComunicacin: formInfo.canalComunicacion
              }
            }
          }
          try {
            let ticketPQRS = await TicketService.createTicketIncripcion(formData)
            if (selectedFile) sendAttach(ticketPQRS.corporateInfo.crearTicket.ID)
            setLoading(false)
            localStorage.clear()
            toast.success(`Su PQRSF fue radicada con el ID #${ticketPQRS.corporateInfo.crearTicket.ID}. Próximamente nos estaremos comunicando con usted`, { autoClose: 4000, position: toast.POSITION.TOP_CENTER })
            return navigate(`/`)
          } catch (error) {
            toast.error(`Hubo un error al registrar su PQRSF`, { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
            setFormError(true)
            console.log(error)
            setLoading(false)
          }
        }
      } else {
        let formData = {
          auditoria: {
            idPeticion: "122145",
            usuario: "jpalacia",
            ip: "10.1.1.1",
            fecha: "2022-01-01",
            hora: "10:10:10",
            operacionWeb: "attachTicket",
            aplicativoPeticion: "attachTicket"
          },
          serviceRequest: {
            crearTicket: {
              processingTypeCode: "ZSAC",
              LISTADECATEGORIAS_KUT: formInfo.tipoTicket,
              serviceIssueCategoryID: formInfo.whereTicket,
              incidentServiceIssueCategoryID: formInfo.inWhatTicket,
              causeServiceIssueCategoryID: "",
              descripcinmanifestacin: formInfo.yourComments,
              name: "PQRSF Web",
              buyerPartyID: params,
              buyerMainContactPartyID: "",
              iDCorredor: "",
              canaldeComunicacin: formInfo.canalComunicacion
            }
          }
        }
        // console.log(formData)
        try {
          let ticketPQRS = await TicketService.createTicketIncripcion(formData)
          if (selectedFile) sendAttach(ticketPQRS.corporateInfo.crearTicket.ID)
          setLoading(false)
          localStorage.clear()
          toast.success(`Su PQRSF fue radicada con el numero #${ticketPQRS.corporateInfo.crearTicket.ID}. Próximamente nos estaremos comunicando con usted`, { autoClose: 4000, position: toast.POSITION.TOP_CENTER })
          return navigate(`/`)
        } catch (error) {
          toast.error(`Hubo un error al registrar su PQRSF`, { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
          setFormError(true)
          console.log(error)
          setLoading(false)
        }
      }

    } else {
      setLoading(false)
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 7000);
    }


    // console.log(contactInfo)

  }

  const sendAttach = async (ticketId) => {
    let adjuntoData = selectedFile.split(';')
    let separeAdjunto = adjuntoData[1].split(',')
    let newAdjunto = separeAdjunto[1]

    let formData = {
      auditoria: {
        idPeticion: "12212",
        usuario: "jpalacia",
        ip: "10.1.1.1",
        fecha: "2022-01-01",
        hora: "10:10:10",
        operacionWeb: "attachTicket",
        aplicativoPeticion: "attachTicket"
      },
      serviceRequestAttachment: {
        srAttachTicket: {
          parentObjectID: "",
          serviceRequestID: ticketId,
          typeCode: "10001",
          mimeType: "application/pdf",
          binary: newAdjunto,
          documentLink: "",
          name: "Adjunto_PQRS.pdf",
          categoryCode: "2",
          linkWebURI: ""
        }

      }
    }

    try {
      let attachData = await TicketService.attachTicket(formData)
      if (!attachData.error) {
        // console.log(attachData)
        return
      } else {
        toast.error(`Hubo un error al enviar el adjunto`, { autoClose: 2000 })
      }
    } catch (error) {

    }
  }

  const handleInputFile = (e) => {
    const [file] = e.target.files
    const imgSize2Mb = 5 * 1024 * 1024
    const isValidSize = file.size < imgSize2Mb
    const isNameOfOneImageRegEx = /.(pdf)$/i
    const isValidType = isNameOfOneImageRegEx.test(file.name)

    if (!isValidSize) {
      e.target.value = ''
      return toast.error('El archivo es demasiado pesado, máximo 5mb', { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
    }
    if (!isValidType) {
      e.target.value = ''
      return toast.error('Sólo se admiten formatos PDF', { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
    }

    const reader = new FileReader()
    reader.onloadstart = () => {
      setLoading(true)
    }
    reader.onloadend = () => {
      console.log(reader.result)
      setLoading(false)
      setSelectedFile(reader.result)
    }
    reader.readAsDataURL(file)

    // handleFormChange()
  }

  const getTypePQRSF = React.useCallback(async () => {
    try {
      let getTypePQRSF = await ApiService.GetSuperPQRSF()
      // console.log(getTypePQRSF)
      if(getTypePQRSF){
        setTicketType(getTypePQRSF.getSuperPQRSF)
      }
    } catch (error) {
      const newErrors = {}
      newErrors.formError = "Hubo un error al tarer la información del servicio, recarga la página e intenta de nuevo."
      setErrors(newErrors)
      console.log(error)
    }
  },[])

  const getServiceCategory = React.useCallback(async() => {
    try {
      let getServiceCategoryPQRSF = await ApiService.GetServiceCategoryPQRSF()
      // console.log(getServiceCategoryPQRSF)
      if(getServiceCategoryPQRSF){
        setServiceCategory(getServiceCategoryPQRSF.getServiceCategoryPQRSF)
      }
    } catch (error) {
      const newErrors = {}
      newErrors.formError = "Hubo un error al tarer la información del servicio, recarga la página e intenta de nuevo."
      setErrors(newErrors)
      console.log(error)
    }
  },[])

  const getServiceIssueCategory = React.useCallback(async() => {
    try {
      let getServiceIssueCategory = await ApiService.GetIssueMasterCategory()
      // console.log(getServiceCategoryPQRSF)
      if(getServiceIssueCategory){
        setServiceIssueCategory(getServiceIssueCategory.getIssueMasterCategory)
      }
    } catch (error) {
      const newErrors = {}
      newErrors.formError = "Hubo un error al tarer la información del servicio, recarga la página e intenta de nuevo."
      setErrors(newErrors)
      console.log(error)
    }
  },[])

  React.useEffect(() => {
    getTypePQRSF()
    getServiceCategory()
    getServiceIssueCategory()
  },[getTypePQRSF,getServiceCategory, getServiceIssueCategory])

  React.useEffect(() => {
    handlerSelectedCategory()
  }, [handlerSelectedCategory])

  React.useEffect(() => {
    if (typeUser === 'NIT') {
      setLoading(true)
      const getContactData = async () => {
        // console.log(params)
        let formData2 = {
          auditoria: {
            idPeticion: "12212",
            usuario: "jpalacia",
            ip: "10.1.1.1",
            fecha: "2022-01-01",
            hora: "10:10:10",
            operacionWeb: "ConsultaContacto",
            aplicativoPeticion: "ConsultaContacto"
          },
          parametros: {
            contacto: {
              accountID: params,
              functionCode: "Z033"
            }
          }
        }
        let fetchContact = await CorporateService.fetchContact(formData2)
        // console.log(fetchContact)
        setLoading(false)
        if (fetchContact.contactData !== "") {
          setContactInfo(fetchContact.contactData.contacto)
          setFormInfo(formdataInfo => {
            return {
              ...formdataInfo,
              firstName: fetchContact.contactData.contacto.FirstName,
              lastName: fetchContact.contactData.contacto.LastName,
              phone: JSON.stringify(fetchContact.contactData.contacto.Mobile),
              email: fetchContact.contactData.contacto.Email
            }
          })
        }
      }
      getContactData()
    }
  }, [params, typeUser])

  return (
    <div className="App">
      <main className='App-main'>
        <section className='Banner-informativo'>
          <div className='comf-container'>

            <div className='comf-col-12 container-text-informativo'>
              <h2>PETICIONES, QUEJAS, RECLAMOS, SUGERENCIAS, ASESORIAS Y FELICITACIONES</h2>
              <p className='comf-subtitulo'>Tu opinión es muy importante para nosotros!</p>
              <p className='comf-subtitulo'>Queremos conocer tu experiencia con nuestros servicios, programas y subsidios. En este formulario puedes crear tu solicitud de PQRSF.</p>
            </div>

          </div>
        </section>

        <div className='container-pqrs-flex'>
          <div className='comf-col-6'>
            <section className='App-main-container'>

              <div className='cart-component'>

                <div className='cart-header margin-center'>
                  <h2 className='title-form'>Tipos de solicitud</h2>
                </div>

                <div className="card-pqr">
                  <div>
                    <img src='/asset/pqrs-2.svg' alt='Icono crear corredor' />
                    <div>
                      <h3 className="title">Felicitación:</h3>
                      <p className=''>Si quieres reconocernos por nuestro buen servicio y por haberte brindado una buena experiencia.</p>
                    </div>
                  </div>
                </div>

                <div className="card-pqr">
                  <div>

                    <img src='/asset/pqrs-1.svg' alt='Icono referir corredor' />
                    <div>
                      <h3 className="title">Sugerencia:</h3>
                      <p className=''>Gracias por compartir tus ideas y recomendaciones para mejorar tu experiencia.</p>
                    </div>

                  </div>
                </div>

                <div className="card-pqr">
                  <div>

                    <img src='/asset/pqrs-3.svg' alt='Icono crear PQRS' />
                    <div>
                      <h3 className="title">Petición, asesoría:</h3>
                      <p className=''>Si necesitas información o asesoría acerca de nuestros programas, productos, servicios e información general.</p>
                    </div>

                  </div>
                </div>

                <div className="card-pqr">
                  <div>

                    <img src='/asset/pqrs-5.svg' alt='Icono crear PQRS' />
                    <div>
                      <h3 className="title">Queja / Reclamo:</h3>
                      <p className=''>Si quieres reportarnos o manifestarnos una inconformidad frente a nuestros programas, productos o servicios.</p>
                    </div>

                  </div>
                </div>

              </div>

            </section>
          </div>

          <div className='comf-col-6'>
            <section className='App-main-container'>

              <div className='cart-component2'>

                <div className='cart-header margin-center'>
                  <h2 className='title-form'>Datos de la solicitud</h2>
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
                        <form ref={formCreateTicket} className='' onSubmit={(e) => handleSubmit(e)}>
                          <div className=''>
                            <div className=''>
                              <div className={!errors.tipoTicket ? 'fila-col' : 'fila-col form-component form-component-error'}>

                                <span htmlFor="tipoTicket" className="text-label label-select-form">¿Cuál es tu tipo de manifestación? *</span>
                                <select onChange={(e) => inputChangeHandler(e)} id='tipoTicket' value={formInfo.tipoTicket} name='tipoTicket' className='type-identification custom-select custom-select-lg'>
                                  <option value=""></option>
                                  {
                                    ticketType.length > 0 &&
                                    ticketType.map((tipo, i) => (
                                      <option key={i} value={`${tipo.code}`}>{tipo.desc}</option>
                                    ))
                                  }
                                </select>
                              </div>
                              {
                                errors.tipoTicket && <h4 className='errorMsg'>{errors.tipoTicket}</h4>
                              }
                              <div className={!errors.whereTicket ? 'fila-col' : 'fila-col form-component form-component-error'}>
                                <div className='position-relative'>

                                  <span htmlFor="whereTicket" className="text-label label-select-form">¿En qué sede te ocurrió? *</span>
                                  <select onChange={(e) => inputChangeHandler(e)} id='whereTicket' value={formInfo.whereTicket} name='whereTicket' className='type-identification custom-select custom-select-lg'>
                                    <option value=""></option>
                                    {
                                      serviceCategory.length > 0 &&
                                      serviceCategory.map((superCat, i) => (
                                        <option key={i} value={`${superCat.code}`}>{superCat.desc}</option>
                                      ))
                                    }
                                  </select>

                                </div>
                              </div>
                              {
                                errors.whereTicket && <h4 className='errorMsg'>{errors.whereTicket}</h4>
                              }

                              <div className={!errors.inWhatTicket ? 'fila-col' : 'fila-col form-component form-component-error'}>
                                <div className='position-relative'>

                                  <span htmlFor="inWhatTicket" className="text-label label-select-form">¿En qué servicio? *</span>
                                  <select onChange={(e) => inputChangeHandler(e)} id='inWhatTicket' value={formInfo.inWhatTicket} name='inWhatTicket' className='type-identification custom-select custom-select-lg'>
                                    <option value=""></option>
                                    {
                                      serviceIssue && serviceIssue.length > 0 &&
                                      serviceIssue.map((superCat, i) => (
                                        <option key={i} value={`${superCat.code}`}>{superCat.desc}</option>
                                      ))
                                    }
                                  </select>
                                </div>

                              </div>

                              {
                                errors.inWhatTicket && <h4 className='errorMsg'>{errors.inWhatTicket}</h4>
                              }

                              <div className={!errors.canalComunicacion ? 'fila-col' : 'fila-col form-component form-component-error'}>
                                <div className='position-relative'>

                                  <span htmlFor="canalComunicacion" className="text-label label-select-form">¿Cómo deseas recibir tu respuesta? *</span>
                                  <select onChange={(e) => inputChangeHandler(e)} id='canalComunicacion' value={formInfo.canalComunicacion} name='canalComunicacion' className='type-identification custom-select custom-select-lg'>
                                    {
                                      CanalComunicacion.length > 0 &&
                                      CanalComunicacion.map((superCat, i) => (
                                        <option key={i} value={`${superCat.value}`}>{superCat.label}</option>
                                      ))
                                    }
                                  </select>

                                </div>
                              </div>
                              {
                                errors.canalComunicacion && <h4 className='errorMsg'>{errors.canalComunicacion}</h4>
                              }

                            </div>
                          </div>


                          <div className=''>
                            <div className=''>
                              <div className='fila-col '>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <span htmlFor="yourComments" className='text-label label-select-form'>¿Cuéntanos que te ocurrió?</span>
                                    <textarea autoComplete={'none'} rows={3} wrap='soft' onChange={(e) => inputChangeHandler(e)} value={formInfo.yourComments} type='string' id='yourComments' name='yourComments' className='text-area-form'>
                                    </textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {
                              typeUser === 'NIT' &&
                              <>
                                <div className=''>
                                  <div className=''>
                                    <h2 className='title-form'> Datos de contacto</h2>
                                  </div>
                                </div>

                                <div className=''>
                                  <div className='fila-col '>
                                    <div className='position-relative'>
                                      <div className={'form-component'}>
                                        <span htmlFor="firstName" className='text-label label-select-form'>Nombres de contacto *</span>
                                        <input onChange={(e) => inputChangeHandler(e)} value={formInfo.firstName} type='string' id='firstName' name='firstName' readOnly={contactInfo.FirstName ? true : false} className={contactInfo.FirstName ? 'primer-apellido input-form disabledTextInput' : 'primer-apellido input-form'} />
                                      </div>
                                    </div>
                                  </div>

                                  <div className='fila-col'>
                                    <div className='position-relative'>
                                      <div className={'form-component'}>

                                        <span htmlFor="lastName" className='text-label label-select-form'>Apellidos de contacto*</span>
                                        <input onChange={(e) => inputChangeHandler(e)} value={formInfo.lastName} type='string' id='lastName' name='lastName' readOnly={contactInfo.FirstName ? true : false} className={contactInfo.FirstName ? 'segundo-apellido input-form disabledTextInput' : 'segundo-apellido input-form'} />
                                      </div>
                                    </div>
                                  </div>

                                  {
                                    !contactInfo.FirstName &&
                                    <>
                                      <div className='fila-col'>
                                        <div className='position-relative'>
                                          <div className={'form-component'}>

                                            <span htmlFor="tipoIdentContacto" className='text-label label-select-form'>Tipo de identificación de contacto *</span>
                                            <select onChange={(e) => inputChangeHandler(e)} id='tipoIdentContacto' value={formInfo.tipoIdentContacto} name='tipoIdentContacto' className='tipoIdentContacto custom-select custom-select-lg'>
                                              <option value={""}></option>
                                              {
                                                tipoIdentFiscal.length > 0 &&
                                                tipoIdentFiscal.map((tipo) => (
                                                  <option key={tipo.value} value={`${tipo.value}`}>{tipo.label}</option>
                                                ))

                                              }
                                            </select>
                                          </div>

                                        </div>
                                      </div>

                                      <div className='fila-col '>
                                        <div className='position-relative'>

                                          <div className={'form-component'}>

                                            <span htmlFor="numIdentContacto" className='text-label label-select-form'>Número de identificación de contacto *</span>
                                            <input onChange={(e) => inputChangeHandler(e)} value={formInfo.numIdentContacto} type='string' id='numIdentContacto' name='numIdentContacto' className='genero input-form' />
                                          </div>

                                        </div>
                                      </div>
                                    </>
                                  }

                                  <div className='fila-col '>
                                    <div className='position-relative'>
                                      <div className={'form-component'}>

                                        <span htmlFor="phone" className='text-label label-select-form'>Celular *</span>
                                        <input onChange={(e) => inputChangeHandler(e)} value={formInfo.phone} type='string' id='phone' name='phone' readOnly={contactInfo.FirstName ? true : false} className={contactInfo.FirstName ? 'celular input-form disabledTextInput' : 'celular input-form'} />
                                      </div>
                                    </div>
                                  </div>

                                  <div className='fila-col '>
                                    <div className='position-relative'>

                                      <div className={'form-component'}>
                                        <span htmlFor="email" className='text-label label-select-form'>Correo electrónico *</span>
                                        <input onChange={(e) => inputChangeHandler(e)} value={formInfo.email} type='email' id='email' name='email' readOnly={contactInfo.FirstName ? true : false} className={contactInfo.FirstName ? 'email input-form disabledTextInput' : 'email input-form'} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            }

                            <div className=''>
                              <div className=''>
                                <div className='fila-col'>
                                  <div className='position-relative'>

                                    <div className={'form-component'}>
                                      <h4>Archivo adjunto:</h4>
                                      <h5>Formatos válidos .pdf (Máx. 50Mb)</h5>
                                      <h5>El sistema permite adjuntar unicamente un archivo.</h5>
                                      <input onChange={(e) => handleInputFile(e)} type="file" id='file' name='file' className='file input-form' accept='.pdf' />

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className=''>
                              <div className='fila-col'>
                                <div className='position-relative'>
                                  <div className={'form-component'}>
                                    <input onChange={(e) => inputChangeHandler(e)} type="checkbox" id='aceptTerms' name='aceptTerms' className='acept-terms mycheck' />
                                    <span htmlFor="acept-terms" className=''>Acepto <a rel="noreferrer" target="_blank" href='https://www.comfenalcoantioquia.com.co/wcm/connect/b7439004-32ff-4f46-b3dd-7327c09b135e/AVISO+HABEAS+DATA.pdf?MOD=AJPERES&CVID=o7e-Axi'>términos y condiciones</a> y tratamiento de datos personales</span>
                                  </div>
                                  {
                                    errors.aceptTerms && <h4 className='errorMsg'>{errors.aceptTerms}</h4>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=''>
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
                                      <div>
                                        <button className='btn-cancel-back margin-auto' type='button' readOnly>Cancelar</button>
                                        <button className='btn-submit-search margin-auto' type='button' readOnly>Crear PQRSF</button>
                                      </div>
                                    )
                                    :
                                    (
                                      <div>
                                        <button className='btn-cancel-back margin-auto' onClick={() => backToHome()} type='button'>Cancelar</button>
                                        <button className='btn-submit-search margin-center' type='submit'>Crear PQRSF</button>
                                      </div>
                                    )
                                }
                              </div>
                            </div>
                          </div>
                        </form>
                      )
                  }

                </div>

              </div>

            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateTicketPQRS