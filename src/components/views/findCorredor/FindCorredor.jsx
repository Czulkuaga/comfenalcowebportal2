import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

//custom components
import Spinner from '../../custom/Spinner';

//Services
import IndividualCustomerService from '../../../services/IndividualCustomerService';
import CorporateService from '../../../services/CorporateService';
import ApiService from '../../../services/ApiService'
import { VerifyDigitNIT } from '../../../utils/functions';

const rows = []

const FindCorredor = () => {
    //Ref
    const formSearchCorredor = React.useRef(null)

    //Constants
    const defaultFormData = {
        typeIdentification: "",
        numberIdentification: ""
    }

    //States Hooks
    const [tipoIdentificacion, setTipoIdentificacion] = React.useState([])
    const [error, setError] = React.useState({})

    const [typeIdentification, setTypeIdentification] = React.useState(defaultFormData.typeIdentification)
    const [numberIdentification, setNumberIdentification] = React.useState(defaultFormData.numberIdentification)

    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    //Functions

    const handleChange = (e) => {
        const newErrors = {};
        switch (e.target.name) {
            case 'type-identification':
                setTypeIdentification("")
                if (!e.target.value || e.target.value === "") {
                    newErrors.typeIdentification = "El tipo de identificación es requerida"
                    setError(newErrors)
                } else {
                    setError({})
                    setTypeIdentification(e.target.value)
                }
                break;
            case 'number-identification':
                let typeSearch = typeIdentification.split('-')
                switch (typeSearch[1]) {
                    case 'NIT':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor del NIT ingresado no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor del NIT ingresado no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'CC':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor de la cédula de ciudadanía no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor de la cédula de ciudadanía no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'RC':
                        if (e.target.value.length < 10) {
                            newErrors.numberIdentificaction = "El valor del registro cívil no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor del registro cívil no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'TI':
                        if (e.target.value.length < 10) {
                            newErrors.numberIdentificaction = "El valor de la tarjeta de identidad no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 11) {
                            newErrors.numberIdentificaction = "El valor de la tarjeta de identidad no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'CE':
                        if (e.target.value.length < 7) {
                            newErrors.numberIdentificaction = "El valor de la cédula de extranjería no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor de la cédula de extranjería no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PA':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del pasaporte no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 16) {
                            newErrors.numberIdentificaction = "El valor del pasaporte no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PE':
                        if (e.target.value.length < 15) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 16) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'SE':
                        if (e.target.value.length < 1) {
                            newErrors.numberIdentificaction = "El valor del id de secretaría de educación no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 50) {
                            newErrors.numberIdentificaction = "El valor del id de secretaría de educación no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'VI':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor de la visa no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor de la visa no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PT':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor del permiso por protección temporal no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del permiso por protección temporal no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'DE':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor del número de identificación extranjera no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del número de identificación extranjera no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'SI':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del sin identificación tributaria no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del sin identificación tributaria no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'CD':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del carnet diplomático no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del carnet diplomático no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PEP':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'NOP':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del NIT de otro país no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del NIT de otro país no es válido, corrige para poder consultar"
                            setError(newErrors)
                        } else {
                            setError({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    default:
                        console.log('form data not exist')
                }
                // console.log(typeof(e.target.value))
                break;
            default:
                console.log('form data not exist')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const newErrors = {}
        let data = {
            TipoDoc: typeIdentification,
            NumDoc: numberIdentification,
        }

        if(typeIdentification === "") newErrors.typeIdentification = "El tipo de identificación es requerido"
        if(numberIdentification === "") newErrors.numberIdentificaction = "El número de identificación es requerido"

        if (Object.keys(newErrors).length === 0) {
            postData(data)
          } else {
            setLoading(false)
            setError(newErrors);
            setTimeout(() => {
              setError({});
            }, 7000);
          }
        
    }

    const postData = async (data) => {
        const newError = {}
        let typeSearch = data.TipoDoc.split('-')
        //console.log(typeSearch)
        let searchIndividualCustomerTaxNumberCollection = typeSearch[1]
        let searchCorporateAccountTaxNumberCollection = typeSearch[0]

        if (searchIndividualCustomerTaxNumberCollection === "NIT") {
            localStorage.setItem('typeEmpre', JSON.stringify(searchCorporateAccountTaxNumberCollection))
            localStorage.setItem('typeCusto', JSON.stringify(searchIndividualCustomerTaxNumberCollection))
            localStorage.setItem('numDoc', JSON.stringify(data.NumDoc))

            let formData = {
                auditoria: {
                    idPeticion: "0043236",
                    usuario: "jamud",
                    ip: "10.10.10.10",
                    fecha: "2023-04-11",
                    hora: "01:00:00",
                    operacionWeb: "consultaCliente",
                    aplicativoPeticion: "consultaCliente"
                },
                parametros: {
                    empresa: {
                        nroDocumento: numberIdentification + VerifyDigitNIT(numberIdentification).msg,
                        tipoDocumento: "1"
                    }
                }
            }
            localStorage.setItem('numDoc', JSON.stringify(formData.parametros.empresa.nroDocumento))
            try {
                // console.log(formData)
                let response = await CorporateService.findCorporate(formData)
                // console.log(response)
                if (response.corporateInfo.empresa[0].idCuenta !== "") {
                    let corredorIdEncrypt = window.btoa(`${JSON.stringify(response.corporateInfo.empresa[0].idCuenta)}`)
                    toast.success(`Cliente encontrado`, { autoClose: 3000 })
                    navigate(`/programa-referidos/corredor/verificar?usuario=${corredorIdEncrypt}`)
                } else {
                    toast.info(`El cliente no existe, por favor regístrate`, { autoClose: 3000 })
                    navigate('/programa-referidos/corredor/crear-corporativo')
                }
            } catch (error) {
                setLoading(false)
                newError.formError = "Hubo un error al enviar la información, por favor intentalo de nuevo"
                setError(newError)
                setTimeout(() => {
                    setError({})
                }, 4000);
            }
        } else {
            localStorage.setItem('typeEmpre', JSON.stringify(searchCorporateAccountTaxNumberCollection))
            localStorage.setItem('typeCusto', JSON.stringify(searchIndividualCustomerTaxNumberCollection))
            localStorage.setItem('numDoc', JSON.stringify(data.NumDoc))

            let IndividualCustomerData = await IndividualCustomerService.searchIndividualCustomer(data.NumDoc, searchIndividualCustomerTaxNumberCollection)
            // console.log(IndividualCustomerData)
            try {
                setLoading(false)
                if (IndividualCustomerData.IndividualCustomerTaxNumberCollection.IndividualCustomerTaxNumber === "") {
                    toast.info(`El cliente no existe, por favor regístrate`, { autoClose: 3000 })
                    navigate('/programa-referidos/corredor/crear')
                } else {
                    let corredorIdEncrypt = window.btoa(`${IndividualCustomerData.IndividualCustomerTaxNumberCollection.IndividualCustomerTaxNumber.CustomerID}`)
                    toast.success(`Cliente encontrado`, { autoClose: 3000 })
                    navigate(`/programa-referidos/corredor/verificar?usuario=${corredorIdEncrypt}`)
                }
            } catch (error) {
                setLoading(false)
                newError.formError = "Hubo un error al enviar la información, por favor intentalo de nuevo"
                setError(newError)
                setTimeout(() => {
                    setError({})
                }, 4000);
            }
        }
    }

    const getTipoIdentificacion = async () => {
        const newError = {}
        try {
            let response = await ApiService.GetIdentificationtype()
            // console.log(response)
            if (response.code === 'success') {
                setTipoIdentificacion(response.identificationType)
                response.identificationType.map((tipo) => (
                    rows.push(tipo)
                ))
            }
        } catch (error) {
            newError.formError = "Hubo un error al conectarse al servicio, por favor intenta de nuevo y si no funciona contáctate con nosotros"
            setError(newError)
            console.log(error)
        }
    }

    //useEffect
    React.useEffect(() => {
        getTipoIdentificacion()
        return () => {
            //cleaningArray()
        }
    }, [])

    return (
        <div className="App">
            <main className='App-main'>
                <section className='App-main-container'>
                    <div className='comf-container'>
                        <div className=''>
                            <div className='comf-col-12 container-text-informativo'>
                                <h2>Consulta de corredores</h2>
                                <p className='comf-subtitulo'>Consulta con el documento de identidad ó el NIT sin dígito de verificación.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='App-main-container'>
                    <div className='components-main'>
                        <div className='cart-component'>
                            <div className='cart-header'>
                                <h2 className='title-form'>Consulta Corredor</h2>
                                {
                                    error.formError && <h4 className='errorForm'>{error.formError}</h4>
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
                                            <form ref={formSearchCorredor} className='search-corredor' onSubmit={(e) => handleSubmit(e)}>
                                                <div>
                                                    <div className="fila-col">
                                                        <div className={!error.typeIdentification ? 'form-component' : 'form-component form-component-error'}>
                                                            <span htmlFor="type-identification" className="text-label label-select-form">¿Cuál es tu tipo de identificación? *</span>
                                                            <select onChange={(e) => handleChange(e)} id='type-identification' value={typeIdentification} name='type-identification' className='type-identification custom-select custom-select-lg'>
                                                                <option value={""}></option>
                                                                {
                                                                    tipoIdentificacion.length > 0 &&
                                                                    tipoIdentificacion.map((tipo) => (
                                                                        <option key={tipo.id} value={`${tipo.ididen}-${tipo.identificador}`}>{tipo.nombre.split('-')[1]}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        {
                                                            error.typeIdentification && <h4 className='errorMsg'>{error.typeIdentification}</h4>
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='row'>
                                                        <div className='fila-col'>
                                                            <div className='position-relative'>

                                                                <div className={!error.numberIdentificaction ? 'form-component' : 'form-component form-component-error'}>

                                                                    <span htmlFor="number-identification" className='text-label label-select-form'>¿Cuál es tu número de identificación? *</span>
                                                                    <input onChange={(e) => handleChange(e)} type='number' id='number-identification' name='number-identification' className='number-identification input-form' />
                                                                </div>
                                                                {
                                                                    error.numberIdentificaction && <h4 className='errorMsg'>{error.numberIdentificaction}</h4>
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
                                                            Object.keys(error).length !== 0 ?
                                                                (
                                                                    <button className='btn-submit-search' type='button' readOnly>Consultar Corredor</button>
                                                                )
                                                                :
                                                                (
                                                                    <button className='btn-submit-search' type='submit'>Consultar Corredor</button>
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

export default FindCorredor