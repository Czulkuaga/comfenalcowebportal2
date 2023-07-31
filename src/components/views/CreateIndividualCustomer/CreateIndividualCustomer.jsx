import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { RemoveTilde } from '../../../utils/functions'

//Services
import ApiService from '../../../services/ApiService';

//import CustomComponents
import Spinner from '../../custom/Spinner';
import IndividualCustomerService from '../../../services/IndividualCustomerService';

const rows = []
const typeClient = []
const genderList = []

const CreateIndividualCustomer = () => {
  //RegExp
  let ValidPhone = /^[0-9]{10}$/g
  // let validNumber = /^\b\d{6,11}\b/g
  let validEmail = /^[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9*+/={|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/g

  //LocalStorage
  let typeUser = JSON.parse(localStorage.getItem('typeCusto'))
  let typedoc = JSON.parse(localStorage.getItem('typeEmpre'))

  //UseRef
  const formCreateTicket = React.useRef(null)

  //Routes and Params
  const navigate = useNavigate();

  //useState
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({})
  const [formError, setFormError] = React.useState(false)
  const [finderTypeDoc, setFinderTypeDoc] = React.useState("")

  const [formDataInfo, setFormDataInfo] = React.useState({
    typeIdentification: `${typedoc}-${typeUser}`,
    numberIdentification: `${JSON.parse(localStorage.getItem('numDoc'))}`,
    typePerson: "",
    firstName: "",
    secondName: "",
    lastName: "",
    secondLastName: "",
    birthday: "",
    gender: "",
    phone: "",
    emailUser: "",
    aceptTerms: false
  })

  //Array data
  const [tipoIdentificacion, setTipoIdentificacion] = React.useState([])
  const [tipoCliente, setTipoCliente] = React.useState([])
  const [genero, setGenero] = React.useState([])

  //Functions
  const CleaningTipoCliente = () => {
    typeClient.splice(0, typeClient.lenght)
  }

  const backToHome = () => {
    navigate('/programa-referidos/corredor/buscar')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const newErrors = {}

    if (formDataInfo.typePerson === "") newErrors.typePerson = '¿Eres persona o empresa? es requerido';
    if (formDataInfo.firstName === "") newErrors.firstName = '¿Cuál es tu primer nombre? es requerido';
    if (formDataInfo.lastName === "") newErrors.lastName = '¿Cuál es tu segundo nombre? es requerido';
    if (formDataInfo.birthday === "") newErrors.birthday = '¿Cuál es tu fecha de nacimiento? es requerida';
    if (formDataInfo.gender === "") newErrors.gender = '¿Cuál es tu género? es requerido';
    if (formDataInfo.phone === "") newErrors.phone = '¿A qué número de celular te podemos contactar? es requerido';
    if (formDataInfo.emailUser === "") newErrors.emailUser = '¿A cuál correo electrónico te podemos contactar? es requerido';
    if (formDataInfo.aceptTerms === false) newErrors.aceptTerms = 'Si debes continuar, acepta los términos y condiciones y tratamiento de datos personales';

    if (formDataInfo.phone !== "") {
      let isValidNumber = formDataInfo.phone.match(ValidPhone)
      if (!isValidNumber) {
        newErrors.phone = 'El número de contacto que ingresate no es válido debe contener 10 dígitos';
      }
    }

    if (formDataInfo.emailUser !== "") {
      let isValidEmail = formDataInfo.emailUser.match(validEmail)
      if (!isValidEmail) {
        newErrors.emailUser = 'El correo electrónico de contacto que ingresate no es válido';
      }
    }

    let typeSearch = formDataInfo.typeIdentification.split('-')

    let searchIndividualCustomerTaxNumberCollection = typeSearch[1]

    let newData = {
      ...formDataInfo,
      typeIdentification: searchIndividualCustomerTaxNumberCollection
    }

    if (Object.keys(newErrors).length === 0) {
      await postData(newData)
    } else {
      setLoading(false)
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 7000);
    }
  }

  const postData = async (formData) => {
    const newErrors = {}
    let requestDataCustomer = {
      RoleCode: "CRM000",
      LifeCycleStatusCode: "2",
      FirstName: RemoveTilde(formData.firstName),
      MiddleName: RemoveTilde(formData.secondName),
      LastName: RemoveTilde(formData.lastName),
      AdditionalLastName: RemoveTilde(formData.secondLastName),
      LanguageCode: "ES",
      NationalityCountryCode: "CO",
      Phone: "",
      Mobile: formData.phone,
      Email: formData.emailUser,
      FechadeNacimiento_KUT: formData.birthday + "T00:00:00",
      Tipodecliente_KUT: "I",
      GenderCode: formData.gender,
      ContactPermissionCode: "1"
    }
    let createCustomerDatosBasicos = await IndividualCustomerService.createIndividualCustomerDatosBasicos(requestDataCustomer)
    // console.log(createCustomerDatosBasicos)

    if (!createCustomerDatosBasicos.error) {
      let formData2 = {
        CustomerID: createCustomerDatosBasicos.results.CustomerID,
        CountryCode: "CO",
        TaxTypeCode: formData.typeIdentification,
        TaxID: formData.numberIdentification
      }

      let createCustomerTaxId = await IndividualCustomerService.createIndividualCustomerIdentification(formData2)
      // console.log(createCustomerTaxId)
      if (!createCustomerTaxId.error) {
        toast.success(`Cliente registrado correctamente`, { autoClose: 2000, position: toast.POSITION.TOP_CENTER })
        navigate(`/programa-referidos/corredor/crear-ticket?idcorredor=${createCustomerTaxId.results.CustomerID}`)
        setLoading(false)
      } else {
        newErrors.formError = "Hubo un error al intentar crear el usuario, por favor intentalo de nuevo"
        setErrors(newErrors)
        setLoading(false)
        setTimeout(() => {
          setErrors({})
        }, 7000);
      }
    } else {
      newErrors.formError = "Hubo un error al intentar crear el usuario, por favor intentalo de nuevo"
      setErrors(newErrors)
      setLoading(false)
      setTimeout(() => {
        setErrors({})
      }, 7000);
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
      setFormError(true)
      console.log(error)
    }
  }, [getOneTypeIdentification])

  const gettipoCliente = React.useCallback(async () => {
    try {
      let getClientType = await ApiService.GetClientType()
      if (getClientType.code === 'success') {
        CleaningTipoCliente()
        setTipoCliente(getClientType.clientType)
        getClientType.clientType.map((tipo) => (
          typeClient.push(tipo)
        ))
      }
    } catch (error) {
      setFormError(true)
      console.log(error)
    }
  }, [])

  const getTipoGenero = React.useCallback(async () => {
    try {
      let getGenderType = await ApiService.getGenderType()
      if (getGenderType.code === 'success') {
        CleaningTipoCliente()
        setGenero(getGenderType.genderType)
        getGenderType.genderType.map((genero) => (
          genderList.push(genero)
        ))
      }
    } catch (error) {
      setFormError(true)
      console.log(error)
    }
  }, [])

  //useEffect
  React.useEffect(() => {
    getTipoIdentificacion()
    gettipoCliente()
    getTipoGenero()
    return () => {
      //cleaningArray()
    }
  }, [getTipoGenero, gettipoCliente, getTipoIdentificacion])

  return (
    <div className="App">
      <main className='App-main'>
        <section className='Banner-informativo'>
          <div className='comf-container'>
            <div className=''>
              <div className='comf-col-12 container-text-informativo'>
                <h2>Solicitud de creación de cliente</h2>
                <p className='comf-subtitulo'>Aquí podrás ingresar los datos para el registro inicial de la solicitud de inscripción de corredor.</p>
              </div>
            </div>
          </div>
        </section>
        <section className='App-main-container'>
          <div className='components-main'>
            <div className='cart-component'>

              <div className='cart-header margin-center'>
                {/* <h2 className='title-form'>Solicitud de inscripción de cliente</h2> */}
                {
                  errors.formError && <h4 className='errorForm'>{errors.formError}</h4>
                }
              </div>
              <div className='card-main'>
                {
                  loading ?
                    (
                      <div>
                        <Spinner />
                      </div>
                    )
                    :
                    (
                      <form className="search-corredor" ref={formCreateTicket} onSubmit={(e) => handleSubmit(e)}>

                        <div className="fila-col ">
                          <span htmlFor="typeIdentification" className="text-label label-select-form">Tipo de identificación fiscal *</span>
                          <select onChange={(e) => inputChangeHandler(e)} id='typeIdentification' value={formDataInfo.typeIdentification} readOnly={true} name='typeIdentification' className='type-identification custom-select custom-select-lg disabledTextInput'>
                            {
                              tipoIdentificacion.length > 0 &&
                              <option value={`${finderTypeDoc.ididen}-${finderTypeDoc.identificador}`}>{finderTypeDoc.nombre}</option>

                              // tipoIdentificacion.map((tipo) => (
                              //   <option key={tipo.id} value={`${tipo.ididen}-${tipo.identificador}`}>{tipo.nombre}</option>
                              // ))
                            }
                          </select>
                        </div>

                        <div className='fila-col '>
                          <div className='position-relative'>

                            <div className={'form-component'}>

                              <span htmlFor="numberIdentification" className='text-label label-select-form'>Número de identificación fiscal *</span>
                              <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.numberIdentification} type='string' readOnly={true} id='numberIdentification' name='numberIdentification' className='number-identification input-form disabledTextInput' />
                            </div>
                          </div>
                        </div>

                        <div className='fila-col '>
                          <div className='position-relative'>

                            <div className={!errors.typePerson ? 'form-component' : 'form-component form-component-error'}>

                              <span htmlFor="tipo-persona" className='text-label label-select-form'>¿Eres persona o empresa? *</span>
                              <select onChange={(e) => inputChangeHandler(e)} id='typePerson' value={formDataInfo.typePerson} name='typePerson' className='type-cliente custom-select custom-select-lg'>
                                <option value={""}></option>
                                {
                                  tipoCliente.length > 0 &&
                                  <>
                                    {typeUser === "CC" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "PA" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "RC" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "TI" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "CE" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "PE" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "SE" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "VI" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "PT" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "DE" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "SI" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "CD" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "PEP" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                    {typeUser === "NOP" && <option value={`${tipoCliente[1].code}`}>{tipoCliente[1].description}</option>}
                                  </>
                                  // tipoCliente.map((tipo) => (
                                  //   <option key={tipo.code} value={`${tipo.code}`}>{tipo.description}</option>
                                  // ))
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
                                <div className={!errors.firstName ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="firstName" className='text-label label-select-form'>¿Cuál es tu primer nombre? *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.firstName} type='string' id='firstName' name='firstName' className='primer-nombre input-form' />
                                </div>
                                {
                                  errors.firstName && <h4 className='errorMsg'>{errors.firstName}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={'form-component'}>

                                  <span htmlFor="secondName" className='text-label label-select-form'>¿Cuál es tu segundo nombre?</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.secondName} type='string' id='secondName' name='secondName' className='segundo-nombre input-form' />
                                </div>
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.lastName ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="lastName" className='text-label label-select-form'>¿Cuál es tu primer apellido? *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.lastName} type='string' id='lastName' name='lastName' className='primer-apellido input-form' />
                                </div>
                                {
                                  errors.lastName && <h4 className='errorMsg'>{errors.lastName}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={'form-component'}>

                                  <span htmlFor="secondLastName" className='text-label label-select-form'>¿Cuál es tu segundo apellido?</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.secondLastName} type='string' id='secondLastName' name='secondLastName' className='segundo-apellido input-form' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className=''>
                          <div className=''>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.birthday ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="birthday" className='text-label label-select-form'>¿Cuál es tu fecha de nacimiento? *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.birthday} type='date' id='birthday' name='birthday' className='fecha-nacimiento input-form' />
                                </div>
                                {
                                  errors.birthday && <h4 className='errorMsg'>{errors.birthday}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>

                                <div className={!errors.gender ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="gender" className='text-label label-select-form'>¿Cuál es tu género? *</span>
                                  <select onChange={(e) => inputChangeHandler(e)} id='gender' value={formDataInfo.gender} name='gender' className='genero custom-select custom-select-lg'>
                                    <option value={""}></option>
                                    {
                                      genero.length > 0 &&
                                      genero.map((tipo) => (
                                        <option key={tipo.code} value={`${tipo.code}`}>{tipo.descripcion}</option>
                                      ))

                                    }
                                  </select>
                                </div>
                                {
                                  errors.gender && <h4 className='errorMsg'>{errors.gender}</h4>
                                }
                              </div>
                            </div>

                            <div className='fila-col '>
                              <div className='position-relative'>
                                <div className={!errors.phone ? 'form-component' : 'form-component form-component-error'}>

                                  <span htmlFor="phone" className='text-label label-select-form'>¿A qué número de celular te podemos contactar? *</span>
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
                                  <span htmlFor="emailUser" className='text-label label-select-form'>¿A cuál correo electrónico te podemos contactar? *</span>
                                  <input onChange={(e) => inputChangeHandler(e)} value={formDataInfo.emailUser} type='text' id='emailUser' name='emailUser' className='email input-form' />
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

export default CreateIndividualCustomer