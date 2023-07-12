import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import Server from '../../../config/Server'
import { format } from "date-fns";

//import CustomComponents
import Spinner from '../../custom/Spinner';

//Import Services
import ApiService from '../../../services/ApiService';
import CorporateService from '../../../services/CorporateService';
import IndividualCustomerService from '../../../services/IndividualCustomerService';
import TicketService from '../../../services/TicketService'


const rows = []
const typeClient = []
const typeSector = []
const genderList = []
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

const TicketInscriptionCorredor = () => {
    //LocalStorage
    let typeUser = JSON.parse(localStorage.getItem('typeCusto'))
    let typedoc = JSON.parse(localStorage.getItem('typeEmpre'))
    let numDoc = JSON.parse(localStorage.getItem('numDoc'))

    //UseRef
    const formCreateTicket = React.useRef(null)

    //Routes and Params
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const params = query.get('idcorredor')
    const navigate = useNavigate();

    //useState
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState({})
    const [formError, setFormError] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState(null)
    const [imageLoad, setImageLoad] = React.useState(false)
    const [finderTypeDoc, setFinderTypeDoc] = React.useState("")
    const [tipoIdentificacion, setTipoIdentificacion] = React.useState([])
    const [tipoCliente, setTipoCliente] = React.useState([])
    const [tipoSector, setTipoSector] = React.useState([])
    const [genero, setGenero] = React.useState([])
    const [formDataInfoCustomer, setFormDataInfoCustomer] = React.useState({
        typeIdentification: `${typedoc}-${typeUser}`,
        numberIdentification: numDoc,
        typePerson: "",
        firstName: "",
        secondName: "",
        lastName: "",
        secondLastName: "",
        birthday: Date.now(),
        gender: "",
        phone: "",
        emailUser: "",
        aceptTerms: false
    })
    const [formDataInfoCorporate, setFormDataInfoCorporate] = React.useState({
        typeIdentification: `${typedoc}-${typeUser}`,
        numberIdentification: numDoc,
        typePerson: "",
        razonSocial: "",
        sectorType: "",
        firstName: "",
        lastName: "",
        tipoIdentContacto: "",
        numIdentContacto: "",
        phone: "",
        gender: "",
        email: "",
        aceptTerms: false
    })

    // tipoSector
    //Cleaning functions
    const CleaningTipoCliente = () => {
        typeClient.splice(0, typeClient.lenght)
    }

    //Functions
    const convertDate = (date) => {
        let day = new Date(date)
        let numberDay = day.getDate()
        let month = new Date(date)
        let numberMonth = month.getMonth()
        let year = new Date(date)
        let numberYear = year.getFullYear()
        let newDate = format(new Date(numberYear, numberMonth, numberDay), 'yyyy-MM-dd')
        return newDate
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
    }, [])

    const gettipoSector = React.useCallback(async () => {
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
    }, [])

    const getTipoGenero = React.useCallback(async () => {
        try {
            let getGenderType = await ApiService.getGenderType()
            if (getGenderType.code === 'success') {
                // console.log(getGenderType.genderType)
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

    const getUserData = React.useCallback(async (params) => {
        setLoading(true)
        // console.log(formDataInfoCustomer.numberIdentification)
        if (typeUser === 'NIT') {
            try {
                if (params) {
                    let formData = {
                        parametros: {
                            empresa: {
                                idCuenta: params
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
                    let getCorporateData = await CorporateService.findCorporateData(formData)
                    // console.log(getCorporateData)
                    if (getCorporateData.corporateInfo.empresa[0].idCuenta) {
                        let contactInfo = await getContactData(getCorporateData.corporateInfo.empresa[0].idCuenta)
                        console.log(contactInfo)
                        if (contactInfo.contactData === "") {
                            setFormDataInfoCorporate({
                                ...formDataInfoCorporate,
                                razonSocial: getCorporateData.corporateInfo.empresa[0].nombreEmpesa,
                                sectorType: getCorporateData.corporateInfo.empresa[0].tipoSector
                            })
                            setLoading(false)
                        } else {
                            setFormDataInfoCorporate({
                                ...formDataInfoCorporate,
                                razonSocial: getCorporateData.corporateInfo.empresa[0].nombreEmpesa,
                                sectorType: getCorporateData.corporateInfo.empresa[0].tipoSector,
                                firstName: contactInfo.contactData.contacto.FirstName,
                                lastName: contactInfo.contactData.contacto.LastName,
                                phone: contactInfo.contactData.contacto.Mobile,
                                email: contactInfo.contactData.contacto.Email,
                                aceptTerms: false
                            })
                            setLoading(false)
                        }

                    } else {
                        toast.error(`Hubo un error al traer la información de la empresa`, { autoClose: 3000 })
                        setLoading(false)
                    }
                }
            } catch (error) {
                toast.error(`Hubo un error en el servicio`, { autoClose: 3000 })
                setLoading(false)
            }
        } else {
            try {
                if (params) {
                    let getIndividualCustomerData = await IndividualCustomerService.searchIndividualCustomerService(params)
                    if (!getIndividualCustomerData.error) {
                        // console.log(getIndividualCustomerData)
                        setFormDataInfoCustomer({
                            numberIdentification: numDoc,
                            typePerson: 'Persona Natural',
                            firstName: getIndividualCustomerData.primernombre,
                            secondName: getIndividualCustomerData.segundonombre,
                            lastName: getIndividualCustomerData.primerapellido,
                            secondLastName: getIndividualCustomerData.segundoapellido,
                            birthday: getIndividualCustomerData.fechanacimiento,
                            gender: getIndividualCustomerData.codigogenero,
                            phone: getIndividualCustomerData.mobile,
                            emailUser: getIndividualCustomerData.email,
                            aceptTerms: false
                        })
                        setLoading(false)
                    } else {
                        toast.error(`Hubo un error al traer la información de la empresa`, { autoClose: 3000 })
                        setLoading(false)
                    }
                } else {
                    toast.error(`Hubo un error al traer la información de la empresa`, { autoClose: 3000 })
                    setLoading(false)
                }
            } catch (error) {
                toast.error(`Hubo un error en el servicio`, { autoClose: 3000 })
                setLoading(false)
            }
        }
    }, [typeUser])

    const getContactData = async (accountId) => {
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
                    accountID: accountId,
                    functionCode: "0005"
                }
            }
        }
        let fetchContact = await CorporateService.fetchContact(formData2)

        return fetchContact
    }

    const inputChangeHandler = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormDataInfoCustomer(invoice => {
            return {
                ...invoice,
                [name]: value
            }
        })
    }

    const inputChangeHandlerCorporate = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormDataInfoCorporate(invoice => {
            return {
                ...invoice,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = {}
        setLoading(true)

        if (typeUser === 'NIT') {
            if (formDataInfoCorporate.aceptTerms === false) newErrors.aceptTerms = 'Si deseas continuar, acepta los términos y condiciones y tratamiento de datos personales';
            
            if (Object.keys(newErrors).length === 0) {
                try {
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
                                processingTypeCode: "ZGCR",
                                LISTADECATEGORIAS_KUT: "671",
                                serviceIssueCategoryID: "39000",
                                incidentServiceIssueCategoryID: "39100",
                                causeServiceIssueCategoryID: "",
                                descripcinmanifestacin: "Descripcinmanifestacin1234CABECERA",
                                name: "Inscripción corredor",
                                buyerPartyID: params,
                                buyerMainContactPartyID: "",
                                iDCorredor: ""
                            }
                        }
                    }
                    let inscriptionCorporate = await TicketService.createTicketIncripcion(formData)
                    if (!inscriptionCorporate.error) {
                        // console.log(inscriptionCorporate)
                        sendAttach(inscriptionCorporate.corporateInfo.crearTicket.ID)
                        setLoading(false)
                        localStorage.clear()
                        toast.success(`Se ha creado el ticket exitosamente`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                        navigate(`/`)
                    } else {
                        toast.error(`Hubo un error al intentar crear el ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                        setLoading(false)
                    }
                } catch (error) {
                    toast.error(`Hubo un error en el servicio de ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                    setLoading(false)
                }
            } else {
                setLoading(false)
                setErrors(newErrors);
                setTimeout(() => {
                    setErrors({});
                }, 7000);
            }

        } else {
            if (formDataInfoCustomer.aceptTerms === false) newErrors.aceptTerms = 'Si deseas continuar, acepta los términos y condiciones y tratamiento de datos personales';
            
            if (Object.keys(newErrors).length === 0) {
                try {
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
                                processingTypeCode: "ZGCR",
                                LISTADECATEGORIAS_KUT: "671",
                                serviceIssueCategoryID: "39000",
                                incidentServiceIssueCategoryID: "39100",
                                causeServiceIssueCategoryID: "",
                                descripcinmanifestacin: "Descripcinmanifestacin1234CABECERA",
                                name: "Inscripción corredor",
                                buyerPartyID: params,
                                buyerMainContactPartyID: "",
                                iDCorredor: ""
                            }
                        }
                    }
                    let inscriptionCorporate = await TicketService.createTicketIncripcion(formData)
                    if (!inscriptionCorporate.error) {
                        console.log(inscriptionCorporate)
                        sendAttach(inscriptionCorporate.corporateInfo.crearTicket.ID)
                        setLoading(false)
                        localStorage.clear()
                        toast.success(`Se ha creado el ticket exitosamente`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                        navigate(`/`)
                    } else {
                        toast.error(`Hubo un error al intentar crear el ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                        setLoading(false)
                    }
                } catch (error) {
                    toast.error(`Hubo un error en el servicio de ticket`, { autoClose: 2000, position: toast.POSITION.TOP_CENTER})
                    setLoading(false)
                }
            }else{
                setLoading(false)
                setErrors(newErrors);
                setTimeout(() => {
                    setErrors({});
                }, 7000);
            }
        }

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
                    name: "Documentacion_Inscripcion_Corredores.pdf",
                    categoryCode: "2",
                    linkWebURI: ""
                }

            }
        }

        try {
            let attachData = await TicketService.attachTicket(formData)
            if (!attachData.error) {
                console.log(attachData)
            } else {
                toast.error(`Hubo un error al enviar el adjunto`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
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
            setImageLoad(true)
        }
        reader.onloadend = () => {
            // console.log(reader.result)
            setImageLoad(false)
            setSelectedFile(reader.result)
        }
        reader.readAsDataURL(file)

        // handleFormChange()
    }

    //useEffect
    React.useEffect(() => {
        getUserData(params)
    }, [params, getUserData])

    React.useEffect(() => {
        getTipoIdentificacion()
    }, [getTipoIdentificacion])

    React.useState(() => {
        gettipoCliente()
    }, [gettipoCliente])

    React.useState(() => {
        if (typeUser !== 'NIT') {
            getTipoGenero()
        }
    }, [typeUser, getTipoGenero])

    React.useEffect(() => {
        if (typeUser === 'NIT') {
            gettipoSector()
        }
    }, [typeUser, gettipoSector])

    if (typeUser === 'NIT') {
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
                                        formError && <h4 className='errorForm'>Hubo un error en el envío del formulario, intenta de nuevo o cantactáte con nosotros</h4>
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
                                                        <select onChange={(e) => inputChangeHandler(e)} id='type-identification' value={formDataInfoCorporate.typeIdentification} name='type-identification' readOnly={true} className='type-identification custom-select custom-select-lg disabledTextInput'>
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

                                                                <span htmlFor="number-identification" className='text-label label-select-form'>Número de identificación fiscal *</span>
                                                                <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.numberIdentification} type='string' id='number-identification' name='number-identification' readOnly={true} className='number-identification input-form disabledTextInput' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='fila-col '>
                                                        <div className='position-relative'>

                                                            <div className={'form-component'}>

                                                                <span htmlFor="typePerson" className='text-label label-select-form'>Tipo de persona *</span>
                                                                <select readOnly onChange={(e) => inputChangeHandler(e)} id='typePerson' value={formDataInfoCorporate.typePerson} name='typePerson' className='type-cliente custom-select custom-select-lg disabledTextInput'>
                                                                    {/* <option value={""}>Seleccione tipo de cliente</option> */}
                                                                    {
                                                                        tipoCliente.length > 0 &&
                                                                        <>
                                                                            {typeUser === "NIT" && <option value={`${tipoCliente[0].code}`}>{tipoCliente[0].description}</option>}
                                                                        </>
                                                                        // tipoCliente.map((tipo) => (
                                                                        //   <option key={tipo.code} value={`${tipo.code}`}>{tipo.description}</option>
                                                                        // ))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className=''>
                                                        <div className=''>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="razonSocial" className='text-label label-select-form'>Razon social</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.razonSocial} type='string' id='razonSocial' name='razonSocial' className='razon-social input-form disabledTextInput' />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="segundo-nombre" className='text-label label-select-form'>Tipo de sector</span>
                                                                        <select readOnly onChange={(e) => inputChangeHandler(e)} id='sectorType' value={formDataInfoCorporate.sectorType} name='sectorType' className='type-identification custom-select custom-select-lg disabledTextInput'>
                                                                            {/* <option value={""}>Seleccione tipo de sector</option> */}
                                                                            {
                                                                                <>

                                                                                    {tipoSector.length > 0 &&
                                                                                        formDataInfoCorporate.sectorType === "R" && <option value={`${tipoSector[3].code}`}>{tipoSector[3].description}</option>}

                                                                                    {tipoSector.length > 0 &&
                                                                                        formDataInfoCorporate.sectorType === "M" && <option value={`${tipoSector[0].code}`}>{tipoSector[0].description}</option>}

                                                                                    {tipoSector.length > 0 &&
                                                                                        formDataInfoCorporate.sectorType === "P" && <option value={`${tipoSector[2].code}`}>{tipoSector[2].description}</option>}

                                                                                    {tipoSector.length > 0 &&
                                                                                        formDataInfoCorporate.sectorType === "N" && <option value={`${tipoSector[1].code}`}>{tipoSector[1].description}</option>}
                                                                                </>
                                                                                // tipoSector.map((tipo) => (
                                                                                //     <option key={tipo.code} value={`${tipo.code}`}>{tipo.description}</option>
                                                                                // ))

                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>


                                                        <div className='cart-header margin-center'>
                                                            <h2 className='title-form'> Datos de contacto</h2>
                                                        </div>



                                                        <div className='fila-col '>
                                                            <div className='position-relative'>
                                                                <div className={'form-component'}>

                                                                    <span htmlFor="firstName" className='text-label label-select-form'>Nombres de contacto *</span>
                                                                    <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.firstName} type='string' id='firstName' name='firstName' readOnly={true} className='primer-apellido input-form disabledTextInput' />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='fila-col '>
                                                            <div className='position-relative'>
                                                                <div className={'form-component'}>

                                                                    <span htmlFor="lastName" className='text-label label-select-form'>Apellidos de contacto*</span>
                                                                    <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.lastName} type='string' id='lastName' name='lastName' readOnly={true} className='segundo-apellido input-form disabledTextInput' />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='fila-col '>
                                                            <div className='position-relative'>
                                                                <div className={'form-component'}>

                                                                    <span htmlFor="phone" className='text-label label-select-form'>Celular *</span>
                                                                    <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.phone} type='string' id='phone' name='phone' readOnly={true} className='celular input-form disabledTextInput' />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='fila-col '>
                                                            <div className='position-relative'>

                                                                <div className={'form-component'}>
                                                                    <span htmlFor="email" className='text-label label-select-form'>Correo electrónico *</span>
                                                                    <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.email} type='email' id='email' name='email' readOnly={true} className='email input-form disabledTextInput' />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className=''>

                                                        <div className=''>
                                                            <div className='fila-col'>
                                                                <div className='position-relative'>

                                                                    <div className={'form-component'}>
                                                                        <h4>Archivos adjunto:</h4>
                                                                        <h5>Formatos válidos .pdf (Máx. 50Mb)</h5>
                                                                        <h5>El sistema permite adjuntar unicamente un archivo.</h5>
                                                                        <input onChange={(e) => handleInputFile(e)} type="file" id='file' name='file' className='file input-form' accept='.pdf' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className=''>
                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>
                                                                        <input onChange={(e) => inputChangeHandlerCorporate(e)} type="checkbox" id='aceptTerms' name='aceptTerms' className='acept-terms mycheck' />
                                                                        <span htmlFor="acept-terms" className=''>Acepto <a rel="noreferrer" target="_blank" href='https://www.comfenalcoantioquia.com.co/wcm/connect/b7439004-32ff-4f46-b3dd-7327c09b135e/AVISO+HABEAS+DATA.pdf?MOD=AJPERES&CVID=o7e-Axi'>términos y condiciones y tratamiento de datos personales</a></span>
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
                                                                            <button className='btn-submit-search margin-auto' type='button' readOnly>Crear Corredor</button>
                                                                        )
                                                                        :
                                                                        (
                                                                            <button className='btn-submit-search margin-center' type='submit'>Crear Corredor</button>
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
    } else {
        return (
            <div className="App">
                <main className='App-main'>
                    <section className='Banner-informativo'>
                        <div className='comf-container'>
                            <div className=''>
                                <div className='comf-col-12 container-text-informativo'>
                                    <h2>Solicitud de creación de corredor</h2>
                                    <p className='comf-subtitulo'>En esta ventana podrás iniciar el proceso para la inscripción del corredor adjuntando los documentos.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='App-main-container'>
                        <div className='components-main'>
                            <div className='cart-component'>

                                <div className='cart-header margin-center'>
                                    <h2 className='title-form'>Solicitud de inscripción de corredor</h2>
                                    {
                                        formError && <h4 className='errorForm'>Hubo un error en el envío del formulario, intenta de nuevo o cantactáte con nosotros</h4>
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

                                                    <div className="fila-col ">
                                                        <span htmlFor="typeIdentification" className="text-label label-select-form">Tipo de identificación fiscal *</span>
                                                        <select onChange={(e) => inputChangeHandler(e)} id='typeIdentification' value={formDataInfoCustomer.typeIdentification} readOnly={true} name='typeIdentification' className='type-identification custom-select custom-select-lg disabledTextInput'>
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
                                                                <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.numberIdentification} type='string' readOnly={true} id='numberIdentification' name='numberIdentification' className='number-identification input-form disabledTextInput' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='fila-col '>
                                                        <div className='position-relative'>

                                                            <div className={'form-component'}>

                                                                <span htmlFor="tipo-persona" className='text-label label-select-form'>Tipo de persona *</span>
                                                                <select onChange={(e) => inputChangeHandler(e)} id='typePerson' value={formDataInfoCustomer.typePerson} name='typePerson' className='type-cliente custom-select custom-select-lg disabledTextInput'>
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
                                                        </div>
                                                    </div>


                                                    <div className=''>
                                                        <div className=''>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="firstName" className='text-label label-select-form'>Primer nombre *</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.firstName} type='string' id='firstName' name='firstName' className='primer-nombre input-form disabledTextInput' />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="secondName" className='text-label label-select-form'>Segundo Nombre</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.secondName} type='string' id='secondName' name='secondName' className='segundo-nombre input-form disabledTextInput' />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="lastName" className='text-label label-select-form'>Primer Apellido *</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.lastName} type='string' id='lastName' name='lastName' className='primer-apellido input-form disabledTextInput' />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="secondLastName" className='text-label label-select-form'>Segundo Apellido</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.secondLastName} type='string' id='secondLastName' name='secondLastName' className='segundo-apellido input-form disabledTextInput' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className=''>
                                                        <div className=''>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="birthday" className='text-label label-select-form'>Fecha de nacimiento *</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.birthday ? convertDate(formDataInfoCustomer.birthday) : ""} type='date' id='birthday' name='birthday' className='fecha-nacimiento input-form disabledTextInput' />
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>

                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="gender" className='text-label label-select-form'>Género *</span>
                                                                        <select readOnly onChange={(e) => inputChangeHandler(e)} id='gender' value={formDataInfoCustomer.gender} name='gender' className='genero custom-select custom-select-lg disabledTextInput'>
                                                                            {
                                                                                genero.length > 0 &&
                                                                                <>
                                                                                    {formDataInfoCustomer.gender === 0 && <option value={`${genero[0].code}`}>{genero[0].description}</option>}
                                                                                    {formDataInfoCustomer.gender === 1 && <option value={`${genero[1].code}`}>{genero[1].description}</option>}
                                                                                    {formDataInfoCustomer.gender === 2 && <option value={`${genero[2].code}`}>{genero[2].description}</option>}
                                                                                    {formDataInfoCustomer.gender === 3 && <option value={`${genero[3].code}`}>{genero[3].description}</option>}
                                                                                    {formDataInfoCustomer.gender === 9 && <option value={`${genero[4].code}`}>{genero[4].description}</option>}
                                                                                </>

                                                                            }
                                                                        </select>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>
                                                                    <div className={'form-component'}>

                                                                        <span htmlFor="phone" className='text-label label-select-form'>Celular *</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.phone} type='string' id='phone' name='phone' className='celular input-form disabledTextInput' />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='fila-col '>
                                                                <div className='position-relative'>

                                                                    <div className={'form-component'}>
                                                                        <span htmlFor="emailUser" className='text-label label-select-form'>Correo electrónico *</span>
                                                                        <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.emailUser} type='email' id='emailUser' name='emailUser' className='email input-form disabledTextInput' />
                                                                    </div>
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
                                                            <div className='row'>
                                                                <div className='fila-col'>
                                                                    <div className='position-relative'>
                                                                        <div className={'form-component'}>
                                                                            <h4>Archivos adjunto:</h4>
                                                                            <h5>Formatos válidos .pdf (Máx. 50Mb)</h5>
                                                                            <h5>El sistema permite adjuntar unicamente un archivo.</h5>
                                                                            <input onChange={(e) => handleInputFile(e)} type="file" id='file' name='file' className='file input-form' accept='.pdf' />
                                                                        </div>
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
                                                                    Object.keys(errors).length !== 0 ?
                                                                        (
                                                                            <button className='btn-submit-search margin-auto' type='button' readOnly>Crear Corredor</button>
                                                                        )
                                                                        :
                                                                        (
                                                                            <button className='btn-submit-search margin-auto' type='submit'>Crear Corredor</button>
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
}

export default TicketInscriptionCorredor