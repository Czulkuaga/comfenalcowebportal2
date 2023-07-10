import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Server from '../../../config/Server'
// import { format } from "date-fns";
import { RemoveTilde } from '../../../utils/functions'

//Services
import ApiService from '../../../services/ApiService';
import CorporateService from '../../../services/CorporateService'

//import CustomComponents
import Spinner from '../../custom/Spinner';

const rows = []
const typeClient = []
const typeSector = []

const tipoIdentFiscal = [
  {
    value: '11',
    label: "REGISTRO DE NACIMIENTO"
  },
  {
    value: '12',
    label: 'TARJETA DE IDENTIDAD'
  },
  {
    value: '13',
    label: 'CÉDULA DE CIUDADANÍA'
  },
  {
    value: '16',
    label: 'PERMISO ESPECIAL VENEZOLANO'
  },
  {
    value: '21',
    label: 'TARJETA DE EXTRANJERÍA'
  },
  {
    value: '41',
    label: 'PASAPORTE'
  }
]

const CreateCorporate = () => {
  //RegExp
  let validNumber = /^[0-9]{10}$/g
  let isValidNumCont = /^[0-9]{6,11}$/g
  let validEmail = /^[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9*+/={|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/g

  //LocalStorage
  let typeUser = JSON.parse(localStorage.getItem('typeCusto'))
  let typedoc = JSON.parse(localStorage.getItem('typeEmpre'))
  //console.log(typeUser)

  //UseRef
  const formCreateTicket = React.useRef(null)

  //Routes and Params
  // const location = useLocation()
  // const query = new URLSearchParams(location.search)
  // const params = query.get('idcorredor')
  const navigate = useNavigate();

  //useState
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({})
  // const [formError, setFormError] = React.useState(false)
  const [finderTypeDoc, setFinderTypeDoc] = React.useState("")
  const [formDataInfo, setFormDataInfo] = React.useState({
    typeIdentification: `${typedoc}-${typeUser}`,
    numberIdentification: `${JSON.parse(localStorage.getItem('numDoc'))}`,
    typePerson: "",
    razonSocial: "",
    sectorType: "",
    firstName: "",
    lastName: "",
    tipoIdentContacto: "",
    numIdentContacto: "",
    phone: "",
    email: "",
    aceptTerms: false
  })

  //array data
  const [tipoIdentificacion, setTipoIdentificacion] = React.useState([])
  const [tipoCliente, setTipoCliente] = React.useState([])
  const [tipoSector, setTipoSector] = React.useState([])

  //Cleaning functions
  const CleaningTipoCliente = () => {
    typeClient.splice(0, typeClient.lenght)
  }

  const backToHome = () => {
    navigate('/programa-referidos/corredor/find-corporate')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    setLoading(true)

    if (formDataInfo.typePerson === "") newErrors.typePerson = 'El tipo de persona es requerido';
    if (formDataInfo.razonSocial === "") newErrors.razonSocial = 'La razón social es requerida';
    if (formDataInfo.sectorType === "") newErrors.sectorType = 'El tipo de sector es requerida';
    if (formDataInfo.firstName === "") newErrors.firstName = 'Los nombres del contacto son requeridos';
    if (formDataInfo.lastName === "") newErrors.lastName = 'Los apellidos del contacto son requeridos';
    if (formDataInfo.tipoIdentContacto === "") newErrors.tipoIdentContacto = 'El tipo de identificación del contacto es requerido';
    if (formDataInfo.numIdentContacto === "") newErrors.numIdentContacto = 'El número de identificación del contacto es requerido';
    if (formDataInfo.phone === "") newErrors.phone = 'El número de celular del contacto es requerido';
    if (formDataInfo.emailUser === "") newErrors.emailUser = 'El correo electrónico del contacto es requerido';
    if (formDataInfo.aceptTerms === false) newErrors.aceptTerms = 'Si debes continuar, acepta los términos, condiciones y tratamiento de datos personales';

    let formData = {
      auditoria:
      {
        idPeticion: "122198663",
        usuario: "jpalacia",
        ip: "10.1.1.1",
        fecha: "2023-04-11",
        hora: "04:49:10",
        operacionWeb: "DatosBasicosEmpresa",
        aplicativoPeticion: "Formulario C4C"
      },
      parametros: {
        empresa: {
          RoleCode: "CRM000",
          LifeCycleStatusCode: "2",
          ContactPermissionCode: "1",
          Name: RemoveTilde(formDataInfo.razonSocial),
          CountryCode: "CO",
          LanguageCode: "ES",
          zFlagNoCopiarDirec_SDK: "RC",
          Phone: "",
          Mobile: formDataInfo.phone,
          Email: formDataInfo.email,
          Clasedeimpuesto_KUT: "RC",
          Tipodecliente_KUT: formDataInfo.typePerson,
          Tiposector_KUT: formDataInfo.sectorType
        }
      }
    }

    if (formDataInfo.phone !== "") {
      let isValidNumber = formData.parametros.empresa.Mobile.match(validNumber)
      if (!isValidNumber) {
        newErrors.phone = 'El número de contacto que ingresate no es válido debe contener 10 dígitos';
      }
    }

    if (formDataInfo.emailUser !== "") {
      let isValidEmail = formData.parametros.empresa.Email.match(validEmail)
      if (!isValidEmail) {
        newErrors.emailUser = 'El correo electrónico de contacto que ingresate no es válido';
      }
    }

    if (formDataInfo.numIdentContacto !== "") {
      let isValidNumContact = formDataInfo.numIdentContacto.match(isValidNumCont)
      if (!isValidNumContact) {
        newErrors.numIdentContacto = 'El número de documento del contacto que ingresaste no es válido';
      }
    }

    if (Object.keys(newErrors).length === 0) {
      postData(formData)
    } else {
      setLoading(false)
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 7000);
    }
  }

  const postData = async (formData) => {
    try {
      let response = await CorporateService.createCorporateAccount(formData)
      console.log(response)

      if (response.corporateInfo.empresa) {
        let corporateInfo = response.corporateInfo.empresa[0]

        let formData2 = {
          auditoria: {
            idPeticion: "12213",
            usuario: "jpalacia",
            ip: "10.1.1.1",
            fecha: "2022-01-01",
            hora: "10:10:10",
            operacionWeb: "IdentificacionfiscalEmpresa",
            aplicativoPeticion: "Formulario C4C"
          },
          parametros: {
            empresa: {
              CustomerID: corporateInfo.AccountID,
              CountryCode: corporateInfo.CountryCode,
              TaxTypeCode: "1",
              TaxID: formDataInfo.numberIdentification
            }
          }
        }
        // console.log(formData2)

        let response2 = await CorporateService.createCorporateAccountTaxNumber(formData2)
        // console.log(response2)
        if (response2.corporateInfoTaxNumber.empresa) {
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
                FirstName: RemoveTilde(formDataInfo.firstName),
                LastName: RemoveTilde(formDataInfo.lastName),
                Tipodeidentificacindelcontacto_KUT: "11",
                Nmerodeidentificaciondelcontacto_KUT: formDataInfo.numIdentContacto,
                LanguageCode: "ES",
                ContactPermissionCode: "1",
                AccountID: corporateInfo.AccountID,
                FunctionCode: "Z038",
                DepartmentCode: "ZD01",
                Phone: "",
                Mobile: formDataInfo.phone,
                Email: formDataInfo.email,
                BusinessAddressCountryCode: "CO"
              }
            }
          }

          // console.log(formData3)

          let response3 = await CorporateService.createCorporateContactData(formData3)
          // console.log(response3)
          if (response3.corporateInfoContactData.contacto) {
            // let corporateInfoContactdata = response3.corporateInfoContactData.contacto[0]
            setLoading(false)
            toast.success(`Empresa registrada satisfactoriamente`, { autoClose: 2000 })
            
            // let corredorIdEncrypt = window.btoa(`${JSON.stringify(response.corporateInfo.empresa[0].AccountID)}`)
            navigate(`/programa-referidos/corredor/find-corporate`)
          } else {
            setLoading(false)
            toast.error(`No se pudo crear la empresa`, { autoClose: 2000 })
          }
        } else {
          setLoading(false)
          toast.error(`No se pudo crear la empresa`, { autoClose: 2000 })
        }
      } else {
        setLoading(false)
        toast.error(`No se pudo crear la empresa`, { autoClose: 2000 })
      }

    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(`Hubo un error al enviar la información`, { autoClose: 2000 })
    }
  }

  const inputChangeHandler = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFormDataInfo(invoice => {
      return {
        ...invoice,
        [name]: value
      }
    })
  }

  const getOneTypeIdentification = React.useCallback((identificationTypeData) => {
    let findOneIdentificationtype = identificationTypeData.find((identType) => identType.identificador === typeUser)
    // console.log(findOneIdentificationtype)
    setFinderTypeDoc(findOneIdentificationtype)
  }, [typeUser])

  const getTipoIdentificacion = React.useCallback(async () => {
    const newErrors = {}
    try {
      let response = await ApiService.GetIdentificationtype()
      if (response.code === 'success') {
        setTipoIdentificacion(response.identificationType)
        response.identificationType.map((tipo) => (
          rows.push(tipo)
        ))
        getOneTypeIdentification(response.identificationType)
      }
    } catch (error) {
      newErrors.formError = "Hubo un error al conectarse con el servicio, recarga la página e intenta de nuevo o contáctate con nosotros"
      setErrors(newErrors)
      console.log(error)
    }
  },[getOneTypeIdentification])

  const gettipoCliente = React.useCallback(async () => {
    await fetch(`${Server}/api/master-client-type/get`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(res => {
        //console.log(res)
        if (res.code === 'success') {
          CleaningTipoCliente()
          setTipoCliente(res.tipocliente)
          res.tipocliente.map((tipo) => (
            typeClient.push(tipo)
          ))
        }
      })
  },[])

  const gettipoSector = async () => {
    await fetch(`${Server}/api/master-sector-type/get`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(res => {
        //console.log(res)
        if (res.code === 'success') {
          setTipoSector(res.tiposector)
          res.tiposector.map((tipo) => (
            typeSector.push(tipo)
          ))
        }
      })
  }

  React.useEffect(() => {
    getTipoIdentificacion()
    gettipoCliente()
    gettipoSector()
    return () => {
      //cleaningArray()
    }
  }, [getTipoIdentificacion, gettipoCliente])

  return (
    <div className="App">
      <main className='App-main'>
        <section className='Banner-informativo'>
          <div className='comf-container'>
            <div className=''>
              <div className='comf-col-12 container-text-informativo'>
                <h2>Solicitud de creación de cliente corporativo</h2>
                <p className='comf-subtitulo'>En esta ventana podrás registrar como cliente corporativo para acceder a la referencia de corredor.</p>
              </div>
            </div>
          </div>
        </section>
        <section className='App-main-container'>
          <div className='components-main'>
            <div className='cart-component'>

              <div className='cart-header margin-center'>
                <h2 className='title-form'>Solicitud de inscripción de cliente corporativo</h2>
                {
                  errors.formError && <h4 className='errorForm'>{errors.formError}</h4>
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
                      <form className='search-corredor' ref={formCreateTicket} onSubmit={(e) => handleSubmit(e)}>
                        <div className="fila-col ">
                          <span htmlFor="type-identification" className="text-label label-select-form">Tipo de identificación fiscal *</span>
                          <select onChange={(e) => inputChangeHandler(e)} id='type-identification' value={formDataInfo.typeIdentification} name='type-identification' readOnly={true} className='type-identification custom-select custom-select-lg disabledTextInput'>
                            {
                              tipoIdentificacion.length > 0 &&
                              <option value={`${finderTypeDoc.ididen}-${finderTypeDoc.identificador}`}>{finderTypeDoc.nombre}</option>
                            }
                          </select>
                        </div>

                        <div className='fila-col '>
                          <div className='position-relative'>

                            <div className={'form-component'}>

                              <span htmlFor="number-identification" className='text-label label-select-form'>Número de identificación fiscal *</span>
                              <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.numberIdentification} type='text' id='number-identification' name='number-identification' readOnly={true} className='number-identification input-form disabledTextInput' />
                            </div>
                          </div>
                        </div>

                        <div className='fila-col '>
                          <div className='position-relative'>

                            <div className={!errors.typePerson ? 'form-component' : 'form-component form-component-error'}>

                              <span htmlFor="typePerson" className='text-label label-select-form'>Tipo de persona *</span>
                              <select onChange={(e) => inputChangeHandler(e)} id='typePerson' value={formDataInfo.typePerson} name='typePerson' className='type-cliente custom-select custom-select-lg'>
                                <option value={""}></option>
                                {
                                  tipoCliente.length > 0 &&
                                    typeUser === "NIT" ?
                                    (
                                      <option value={`${tipoCliente[0].code}`}>{tipoCliente[0].description}</option>
                                    )
                                    :
                                    (
                                      null
                                    )
                                }
                              </select>
                            </div>
                            {
                              errors.typePerson && <h4 className='errorMsg'>{errors.typePerson}</h4>
                            }
                          </div>
                        </div>


                        <div className=''>
                          <div className=''>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.razonSocial ? 'form-component': 'form-component form-component-error'}>

                                  <span htmlFor="razonSocial" className='text-label label-select-form'>Razon social</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.razonSocial} type='text' id='razonSocial' name='razonSocial' className='razon-social input-form' />
                                </div>
                                {
                                  errors.razonSocial && <h4 className='errorMsg'>{errors.razonSocial}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.sectorType ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="segundo-nombre" className='text-label label-select-form'>Tipo de sector</span>
                                  <select onChange={(e) => inputChangeHandler(e)} id='sectorType' value={formDataInfo.sectorType} name='sectorType' className='type-identification custom-select custom-select-lg'>
                                    <option value={""}></option>
                                    {
                                      tipoSector.length > 0 &&
                                      tipoSector.map((tipo) => (
                                        <option key={tipo.code} value={`${tipo.code}`}>{tipo.description}</option>
                                      ))

                                    }
                                  </select>
                                </div>
                                {
                                  errors.sectorType && <h4 className='errorMsg'>{errors.sectorType}</h4>
                                }
                              </div>
                            </div>


                            <div className='fila-col'>
                              <h2 className='title-form'> Datos de contacto</h2>
                            </div>


                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.firstName ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="firstName" className='text-label label-select-form'>Nombres de contacto *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.firstName} type='text' id='firstName' name='firstName' className='primer-apellido input-form' />
                                </div>
                                {
                                  errors.firstName && <h4 className='errorMsg'>{errors.firstName}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.lastName ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="lastName" className='text-label label-select-form'>Apellidos de contacto*</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.lastName} type='text' id='lastName' name='lastName' className='segundo-apellido input-form' />
                                </div>
                                {
                                  errors.lastName && <h4 className='errorMsg'>{errors.lastName}</h4>
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className=''>
                          <div className=''>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.tipoIdentContacto ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="tipoIdentContacto" className='text-label label-select-form'>Tipo de identificación de contacto *</span>
                                  <select onChange={(e) => inputChangeHandler(e)} id='tipoIdentContacto' value={formDataInfo.tipoIdentContacto} name='tipoIdentContacto' className='tipoIdentContacto custom-select custom-select-lg'>
                                    <option value={""}></option>
                                    {
                                      tipoIdentFiscal.length > 0 &&
                                      tipoIdentFiscal.map((tipo) => (
                                        <option key={tipo.value} value={`${tipo.value}`}>{tipo.label}</option>
                                      ))

                                    }
                                  </select>
                                </div>
                                {
                                  errors.tipoIdentContacto && <h4 className='errorMsg'>{errors.tipoIdentContacto}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>

                                <div className={!errors.numIdentContacto ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="genero" className='text-label label-select-form'>Número de identificación de contacto *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.numIdentContacto} type='text' id='numIdentContacto' name='numIdentContacto' className='genero input-form' />
                                </div>
                                {
                                  errors.numIdentContacto && <h4 className='errorMsg'>{errors.numIdentContacto}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.phone ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="phone" className='text-label label-select-form'>Celular *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.phone} type='text' id='phone' name='phone' className='celular input-form' />
                                </div>
                                {
                                  errors.phone && <h4 className='errorMsg'>{errors.phone}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>

                                <div className={!errors.emailUser ? 'form-component' : 'form-component form-component-error'}>
                                  <span htmlFor="email" className='text-label label-select-form'>Correo electrónico *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.emailUser} type='text' id='email' name='emailUser' className='email input-form' />
                                </div>
                                {
                                  errors.emailUser && <h4 className='errorMsg'>{errors.emailUser}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
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

                          <div>
                            <div className='form-component'>
                              <p className='nota-form'>* indica los campos requeridos</p>
                            </div>
                          </div>
                          <div>
                            <div className='form-component'>
                              {
                                Object.keys(errors).length !== 0 ?
                                  (
                                    <div>
                                      <button className='btn-cancel-back margin-auto' type='button' readOnly>Cancelar</button>
                                      <button className='btn-submit-search margin-auto' type='button' readOnly>Crear Empresa</button>
                                    </div>
                                  )
                                  :
                                  (
                                    <div>
                                      <button className='btn-cancel-back margin-auto' onClick={() => backToHome()} type='button'>Cancelar</button>
                                      <button className='btn-submit-search margin-center' type='submit'>Crear Empresa</button>
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
          </div>
        </section>

      </main>
    </div>
  )
}

export default CreateCorporate