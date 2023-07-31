import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { VerifyDigitNIT } from '../../../utils/functions';

//custom components
import Spinner from '../../custom/Spinner';

//Services
import CorporateService from '../../../services/CorporateService';
import ApiService from '../../../services/ApiService'
import IndividualCustomerService from '../../../services/IndividualCustomerService';

const rows = []

const FindCorporate = () => {
    //RegExp
    let validNumber = /^\d+$/g

    //Ref
    const formSearchCorredor = React.useRef(null)

    //Constants
    const defaultFormData = {
        typeIdentification: "",
        numberIdentification: "",
        idCorredor: ""
    }

    //States Hooks
    const [finderTypeDoc, setFinderTypeDoc] = React.useState("")
    const [errors, setErrors] = React.useState({})

    const [typeIdentification, setTypeIdentification] = React.useState(defaultFormData.typeIdentification)

    const [numberIdentification, setNumberIdentification] = React.useState(defaultFormData.numberIdentification)

    const [idCorredor, setIdCorredor] = React.useState(defaultFormData.idCorredor)

    const [formError, setFormError] = React.useState(false)

    const [loading, setLoading] = React.useState(false)

    const navigate = useNavigate()

    //Functions
    const getOneTypeIdentification = React.useCallback((identificationTypeData) => {
        let findOneIdentificationtype = identificationTypeData.find((identType) => identType.identificador === 'NIT')
        // console.log(findOneIdentificationtype)
        setFinderTypeDoc(findOneIdentificationtype)
    }, [])

    const getTipoIdentificacion = React.useCallback(async () => {
        try {
            let response = await ApiService.GetIdentificationtype()
            // console.log(response)
            if (response.code === 'success') {
                getOneTypeIdentification(response.identificationType)
                response.identificationType.map((tipo) => (
                    rows.push(tipo)
                ))
            }
        } catch (error) {
            setFormError(true)
            console.log(error)
        }
    }, [getOneTypeIdentification])

    const handleChange = (e) => {
        const newErrors = {};
        setErrors({})
        switch (e.target.name) {
            case 'type-identification':
                setTypeIdentification("")
                if (!e.target.value || e.target.value === "") {
                    newErrors.typeIdentification = "El tipo de identificación es requerida"
                    setErrors(newErrors)
                } else {
                    setErrors({})
                    setTypeIdentification(e.target.value)
                }
                break;
            case 'number-identification':
                let typeSearch = typeIdentification.split('-')
                switch (typeSearch[1]) {
                    case 'NIT':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor del NIT ingresado no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor del NIT ingresado no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'CC':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor de la cédula de ciudadanía no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor de la cédula de ciudadanía no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'RC':
                        if (e.target.value.length < 10) {
                            newErrors.numberIdentificaction = "El valor del registro cívil no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor del registro cívil no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'TI':
                        if (e.target.value.length < 10) {
                            newErrors.numberIdentificaction = "El valor de la tarjeta de identidad no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 11) {
                            newErrors.numberIdentificaction = "El valor de la tarjeta de identidad no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'CE':
                        if (e.target.value.length < 7) {
                            newErrors.numberIdentificaction = "El valor de la cédula de extranjería no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor de la cédula de extranjería no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PA':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del pasaporte no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 16) {
                            newErrors.numberIdentificaction = "El valor del pasaporte no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PE':
                        if (e.target.value.length < 15) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 16) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'SE':
                        if (e.target.value.length < 1) {
                            newErrors.numberIdentificaction = "El valor del id de secretaría de educación no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 50) {
                            newErrors.numberIdentificaction = "El valor del id de secretaría de educación no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'VI':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor de la visa no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 10) {
                            newErrors.numberIdentificaction = "El valor de la visa no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PT':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor del permiso por protección temporal no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del permiso por protección temporal no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'DE':
                        if (e.target.value.length < 6) {
                            newErrors.numberIdentificaction = "El valor del número de identificación extranjera no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del número de identificación extranjera no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'SI':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del sin identificación tributaria no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del sin identificación tributaria no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'CD':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del carnet diplomático no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del carnet diplomático no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'PEP':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del permiso especial venezolano no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    case 'NOP':
                        if (e.target.value.length < 3) {
                            newErrors.numberIdentificaction = "El valor del NIT de otro país no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else if (e.target.value.length > 20) {
                            newErrors.numberIdentificaction = "El valor del NIT de otro país no es válido, corrige para poder consultar"
                            setErrors(newErrors)
                        } else {
                            setErrors({})
                            setNumberIdentification(e.target.value)
                        }
                        break;
                    default:
                        console.log('form data not exist')
                }
                // console.log(typeof(e.target.value))
                break;
            case "idCorredor":
                if (e.target.value.length < 3) {
                    newErrors.idCorredor = "El identificador del corredor debe tener más de 3 digitos"
                    setErrors(newErrors)
                } else {
                    setErrors({})
                    setIdCorredor(e.target.value)
                }
                break;
            default:
                console.log('form data not exist')
        }
    }

    const VerifyIsCorredor = async (data) => {
        let corredor = idCorredor
        const newErrors = {}

        let formDataCorporate = {
            parametros: {
                empresa: {
                    idCuenta: corredor
                }
            },
            auditoria: {
                idPeticion: "01233434454",
                usuario: "jpalacia",
                ip: "10.10.8.52",
                fecha: "2023-04-11",
                hora: "01:00:00",
                operacionWeb: "Datos Basicos",
                aplicativoPeticion: "prueba"
            }
        }
        let formDataCustomer = {
            customerID: corredor
        }

        let verifyIsCorredorCorporate = await CorporateService.findCorporateData(formDataCorporate)
        let verifyCorredorIndividualCustomer = await IndividualCustomerService.searchIndividualCustomerService(formDataCustomer.customerID)

        if (verifyIsCorredorCorporate.corporateInfo.empresa[0].idCuenta !== "") {
            if (verifyIsCorredorCorporate.error) {
                newErrors.formError = "Hubo un error al verificar el corredor"
                console.log(verifyIsCorredorCorporate)
                setErrors(newErrors)
                setLoading(false)
                return;
            } else {
                if (verifyIsCorredorCorporate.corporateInfo.empresa[0].corredor === false) {
                    newErrors.formError = "El corredor ingresado aún no puede referir"
                    console.log(verifyIsCorredorCorporate)
                    setErrors(newErrors)
                    setLoading(false)
                    return;
                } else {
                    postData(data)
                }
            }
        } else if (verifyCorredorIndividualCustomer.corredor !== "") {
            if (verifyCorredorIndividualCustomer.error) {
                newErrors.formError = "Hubo un error al verificar el corredor"
                setErrors(newErrors)
                setLoading(false)
                return;
            } else {
                postData(data)
            }
        } else {
            newErrors.formError = "El corredor no existe"
            setErrors(newErrors)
            setLoading(false)
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

        if (typeIdentification === "") newErrors.typeIdentification = "El tipo de identificación es requerido"
        if (numberIdentification === "") newErrors.numberIdentificaction = "El número de identificación es requerido"
        if (idCorredor === "") newErrors.idCorredor = "El identificador del corredor es requerido"

        if (numberIdentification !== "") {
            let isValidNumberIdentification = numberIdentification.match(validNumber)
            if (!isValidNumberIdentification) {
                newErrors.numberIdentificaction = 'Sólo se admiten números en este campo';
            }
        }

        if (idCorredor !== "") {
            let isValidIdCorredor = idCorredor.match(validNumber)
            if (!isValidIdCorredor) {
                newErrors.idCorredor = 'Sólo se admiten números en este campo';
            }
        }

        if (Object.keys(newErrors).length === 0) {
            VerifyIsCorredor(data)
        } else {
            setLoading(false)
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({});
            }, 7000);
        }
    }

    const postData = async (data) => {
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
                    let formData2 = {
                        parametros: {
                            empresa: {
                                idCuenta: response.corporateInfo.empresa[0].idCuenta
                            }
                        },
                        auditoria: {
                            idPeticion: "01233434454",
                            usuario: "jpalacia",
                            ip: "10.10.8.52",
                            fecha: "2023-04-11",
                            hora: "01:00:00",
                            operacionWeb: "Datos Basicos",
                            aplicativoPeticion: "prueba"
                        }
                    }
                    let formData3 = {
                        auditoria: {
                            idPeticion: "12212",
                            usuario: "jpalacia",
                            ip: "10.1.1.1",
                            fecha: "2022-01-01",
                            hora: "10:10:10",
                            operacionWeb: "ConsultaEquipoCliente",
                            aplicativoPeticion: "Formulario C4C"
                        },
                        corporateTeam: {
                            consulta: {
                                accountID: response.corporateInfo.empresa[0].idCuenta,
                                partyRoleCode: "Z0030"
                            }
                        }
                    }
                    let findCorporateDatosBasicos = await CorporateService.findCorporateData(formData2)
                    // console.log(findCorporateDatosBasicos)
                    let findCorporateTeam = await CorporateService.searchTeamCorporate(formData3)
                    // console.log(findCorporateTeam)

                    // console.log(findCorporateDatosBasicos.corporateInfo.empresa[0].tipoAfiliado !== 'E2')
                    // console.log(findCorporateDatosBasicos.corporateInfo.empresa[0].corredor !== false)
                    // console.log(findCorporateTeam.corporateTeam !== "")
                    if (
                        findCorporateDatosBasicos.corporateInfo.empresa[0].tipoAfiliado !== 'E2' ||
                        findCorporateDatosBasicos.corporateInfo.empresa[0].corredor !== false ||
                        findCorporateTeam.corporateTeam !== ""
                    ) {
                        toast.info(`La empresa no puede ser atendida`, { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                        setLoading(false)
                    } else {
                        setLoading(false)
                        let clientIdEncrypt = window.btoa(`${JSON.stringify(response.corporateInfo.empresa[0].idCuenta)}`)
                        let CorredorEncrypt = window.btoa(`${JSON.stringify(idCorredor)}`)
                        toast.success(`El cliente puede ser atendido`, { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                        navigate(`/programa-referidos/corredor/referir-corredor?usuario=${clientIdEncrypt}&idcorredor=${CorredorEncrypt}`)
                    }
                } else {
                    setLoading(false)
                    toast.info(`El cliente no existe, por favor regístrate`, { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                    navigate('/programa-referidos/corredor/crear-corporativo-from-refer')
                }
            } catch (error) {
                const newErrors = {}
                newErrors.formError = "Hubo un error en el formulario, por favor intenta de nuevo"
                setErrors(newErrors)
                setLoading(false)
                setTimeout(() => {
                    setFormError(false)
                }, 4000);
            }
        }
    }

    //useEffect
    React.useEffect(() => {
        getTipoIdentificacion()
        return () => {
            //cleaningArray()
        }
    }, [getTipoIdentificacion])

    return (
        <div className="App">
            <main className='App-main'>
                <section className='App-main-container'>
                    <div className='comf-container'>
                        <div className=''>
                            <div className='comf-col-12 container-text-informativo'>
                                <h2>Consulta de empresas</h2>
                                <p className='comf-subtitulo'>Consulta con el NIT de la empresa sin incluir el dígito de verificación.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='App-main-container'>
                    <div className='components-main'>
                        <div className='cart-component'>
                            <div className='cart-header'>
                                <h2 className='title-form'>Consulta Empresa</h2>
                                {
                                    errors.formError && <h4 className='errorForm'>{errors.formError}</h4>
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
                                                    <div className='row'>
                                                        <div className="fila-col">
                                                            <div className='position-relative'>

                                                                <div className={!errors.typeIdentification ? 'form-component' : 'form-component form-component-error'}>
                                                                    <span htmlFor="type-identification" className="text-label label-select-form">¿Cuál es tu tipo de identificación? *</span>
                                                                    <select onChange={(e) => handleChange(e)} id='type-identification' value={typeIdentification} name='type-identification' className='type-identification custom-select custom-select-lg'>
                                                                        <option value={""}></option>
                                                                        {
                                                                            finderTypeDoc &&
                                                                            <option key={finderTypeDoc.id} value={`${finderTypeDoc.ididen}-${finderTypeDoc.identificador}`}>{finderTypeDoc.nombre.split('-')[1]}</option>
                                                                        }
                                                                    </select>
                                                                </div>
                                                                {
                                                                    errors.typeIdentification && <h4 className='errorMsg'>{errors.typeIdentification}</h4>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='row'>
                                                        <div className='fila-col'>
                                                            <div className='position-relative'>

                                                                <div className={!errors.numberIdentificaction ? 'form-component' : 'form-component form-component-error'}>

                                                                    <span htmlFor="number-identification" className='text-label label-select-form'>¿Cuál es tu número de identificación? *</span>
                                                                    <input onChange={(e) => handleChange(e)} type='number' id='number-identification' name='number-identification' className='number-identification input-form' />
                                                                </div>
                                                                {
                                                                    errors.numberIdentificaction && <h4 className='errorMsg'>{errors.numberIdentificaction}</h4>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ marginTop: '40px' }} className='row'>
                                                        <div className='fila-col'>
                                                            <div className='position-relative'>

                                                                <div className={!errors.idCorredor ? 'form-component' : 'form-component form-component-error'}>

                                                                    <span htmlFor="idCorredor" className='text-label label-select-form'>Identificación de corredor *</span>
                                                                    <input onChange={(e) => handleChange(e)} type='number' id='idCorredor' name='idCorredor' className='number-identification input-form' />
                                                                </div>
                                                                {
                                                                    errors.idCorredor && <h4 className='errorMsg'>{errors.idCorredor}</h4>
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
                                                            Object.keys(errors).length > 0 ?
                                                                (
                                                                    <button className='btn-submit-search' type='button' readOnly>Consultar Empresa</button>
                                                                )
                                                                :
                                                                (
                                                                    <button className='btn-submit-search' type='submit'>Consultar Empresa</button>
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

export default FindCorporate