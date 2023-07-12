import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import Server from '../../../config/Server'

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

const CreateTicketReferirCorporate = () => {
    //LocalStorage
    let typeUser = JSON.parse(localStorage.getItem('typeCusto'))
    let typedoc = JSON.parse(localStorage.getItem('typeEmpre'))
    let numDoc = JSON.parse(localStorage.getItem('numDoc'))

    //UseRef
    const formCreateTicket = React.useRef(null)

    //Routes and Params
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const obtainData = query.get('usuario')
    const params = window.atob(obtainData)
    const corredorEncrypt = query.get('idcorredor')
    const corredor = JSON.parse(window.atob(corredorEncrypt))

    //useState
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState({})
    const [formError, setFormError] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState(null)
    const [imageLoad, setImageLoad] = React.useState(false)
    const [finderTypeDoc, setFinderTypeDoc] = React.useState("")
    const [tipoIdentificacion, setTipoIdentificacion] = React.useState([])
    const [tipoCliente, setTipoCliente] = React.useState([])
    const [tipoSector, setTipoSector] = React.useState([])
    const [formDataInfoCorporate, setFormDataInfoCorporate] = React.useState({
        idCorredor: "",
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
        email: "",
        aceptTerms: false
    })

    //Cleaning functions
    const CleaningTipoCliente = () => {
        typeClient.splice(0, typeClient.lenght)
    }

    //Functions

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

    const getUserData = React.useCallback(async (params) => {
        setLoading(true)
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
                    if (getCorporateData.corporateInfo.empresa[0].idCuenta === "") {
                        toast.error("Hay un error al traer los datos de la empresa", 3000)
                        setLoading(false)
                    } else {
                        let contactDataInfo = await getContactData(getCorporateData.corporateInfo.empresa[0].idCuenta)
                        // console.log(contactDataInfo)
                        if (contactDataInfo.contactData === "") {
                            setFormDataInfoCorporate({
                                idCorredor: corredor,
                                typeIdentification: `${typedoc}-${typeUser}`,
                                numberIdentification: numDoc,
                                typePerson: getCorporateData.corporateInfo.empresa[0].tipoCliente,
                                firstName: "",
                                lastName: "",
                                tipoIdentContacto: "",
                                numIdentContacto: "",
                                phone: "",
                                email: "",
                                aceptTerms: false,
                                razonSocial: getCorporateData.corporateInfo.empresa[0].nombreEmpesa,
                                sectorType: getCorporateData.corporateInfo.empresa[0].tipoSector
                            })
                            setLoading(false)
                        } else {
                            setFormDataInfoCorporate({
                                idCorredor: corredor,
                                typeIdentification: `${typedoc}-${typeUser}`,
                                numberIdentification: numDoc,
                                typePerson: getCorporateData.corporateInfo.empresa[0].tipoCliente,
                                tipoIdentContacto: "",
                                numIdentContacto: "",
                                aceptTerms: false,
                                razonSocial: getCorporateData.corporateInfo.empresa[0].nombreEmpesa,
                                sectorType: getCorporateData.corporateInfo.empresa[0].tipoSector,
                                firstName: contactDataInfo.contactData.contacto.FirstName,
                                lastName: contactDataInfo.contactData.contacto.LastName,
                                phone: contactDataInfo.contactData.contacto.Mobile,
                                email: contactDataInfo.contactData.contacto.Email
                            })
                            setLoading(false)
                        }
                    }
                }
            } catch (error) {
                setLoading(false)
                toast.error(`Hubo un error en el servicio`, { autoClose: 3000 })
            }
        }
    }, [typeUser, numDoc, typedoc, corredor])

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
                    functionCode: "Z038"
                }
            }
        }
        let fetchContact = await CorporateService.fetchContact(formData2)
        // console.log(fetchContact)
        return fetchContact
    }

    const inputChangeHandler = e => {
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
        setLoading(true)
        const newErrors = {}

        if (formDataInfoCorporate.aceptTerms === false) newErrors.aceptTerms = 'Si debes continuar, acepta los términos, condiciones y tratamiento de datos personales';

        if (Object.keys(newErrors).length === 0) {
            if (typeUser === 'NIT') {
                if (formDataInfoCorporate.idCorredor === "") {
                    toast.error(`El idCorredor es requerido para este proceso`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                    setLoading(false)
                } else {
                    let formDataCorporate = {
                        parametros: {
                            empresa: {
                                idCuenta: formDataInfoCorporate.idCorredor
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
                        customerID: formDataInfoCorporate.idCorredor
                    }
                    let verifyIsCorredorCorporate = await CorporateService.findCorporateData(formDataCorporate)
                    let verifyCorredorIndividualCustomer = await IndividualCustomerService.searchIndividualCustomerService(formDataCustomer.customerID)
                    // console.log(verifyIsCorredorCorporate)
                    // console.log(verifyCorredorIndividualCustomer)
    
                    if (verifyIsCorredorCorporate.corporateInfo.empresa[0].idCuenta !== "") {
                        if (verifyIsCorredorCorporate.error) {
                            toast.error(`Hubo un error al verificar el corredor`, { autoClose: 3000,position: toast.POSITION.TOP_CENTER })
                            // console.log(verifyIsCorredorCorporate.error)
                            setLoading(false)
                            return;
                        } else {
                            if (verifyIsCorredorCorporate.corporateInfo.empresa[0].corredor === false) {
                                toast.error(`El corredor ingresado aún no puede referir`, { autoClose: 3000,position: toast.POSITION.TOP_CENTER })
                                console.log(verifyIsCorredorCorporate)
                                setLoading(false)
                                return;
                            } else {
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
                                                LISTADECATEGORIAS_KUT: "741",
                                                serviceIssueCategoryID: "41000",
                                                incidentServiceIssueCategoryID: "41300",
                                                causeServiceIssueCategoryID: "",
                                                descripcinmanifestacin: "Descripcinmanifestacin1234CABECERA",
                                                name: "Referir Corredor",
                                                buyerPartyID: params,
                                                buyerMainContactPartyID: "",
                                                iDCorredor: formDataInfoCorporate.idCorredor
                                            }
                                        }
                                    }
                                    let inscriptionCorporate = await TicketService.createTicketIncripcion(formData)
                                    if (!inscriptionCorporate.error) {
                                        console.log(inscriptionCorporate)
                                        if (selectedFile) sendAttach(inscriptionCorporate.corporateInfo.crearTicket.ID)
                                        setLoading(false)
                                        localStorage.clear()
                                        toast.success(`Se ha referido el cliente exitosamente`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                                        return navigate(`/`)
                                    } else {
                                        toast.error(`Hubo un error al intentar crear el ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                                        setLoading(false)
                                    }
                                } catch (error) {
                                    toast.error(`Hubo un error en el servicio de ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                                    setLoading(false)
                                }
                            }
                        }
                    }
    
                    if (verifyCorredorIndividualCustomer.corredor !== "") {
                        if (verifyCorredorIndividualCustomer.error) {
                            toast.error(`Hubo un error al verificar el corredor`, { autoClose: 3000,position: toast.POSITION.TOP_CENTER })
                            setLoading(false)
                            return;
                        } else {
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
                                            LISTADECATEGORIAS_KUT: "741",
                                            serviceIssueCategoryID: "41000",
                                            incidentServiceIssueCategoryID: "41300",
                                            causeServiceIssueCategoryID: "",
                                            descripcinmanifestacin: "Descripcinmanifestacin1234CABECERA",
                                            name: "Referir Corredor",
                                            buyerPartyID: params,
                                            buyerMainContactPartyID: "",
                                            iDCorredor: formDataInfoCorporate.idCorredor
                                        }
                                    }
                                }
                                let inscriptionCorporate = await TicketService.createTicketIncripcion(formData)
                                if (inscriptionCorporate.code !== "Error500") {
                                    console.log(inscriptionCorporate)
                                    if (selectedFile) sendAttach(inscriptionCorporate.corporateInfo.crearTicket.ID)
                                    setLoading(false)
                                    localStorage.clear()
                                    toast.success(`Se ha referido el cliente exitosamente`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                                    return navigate(`/`)
                                } else {
                                    toast.error(`Hubo un error al intentar crear el ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                                    setLoading(false)
                                }
                            } catch (error) {
                                toast.error(`Hubo un error en el servicio de ticket`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                                setLoading(false)
                            }
                        }
                    }
    
                    if (verifyIsCorredorCorporate.corporateInfo.empresa[0].idCuenta === "" ||
                        verifyCorredorIndividualCustomer.corredor === ""
                    ) {
                        toast.error(`Hubo un error al verificar el corredor`, { autoClose: 3000,position: toast.POSITION.TOP_CENTER })
                        // console.log(verifyIsCorredorCorporate.error)
                        setLoading(false)
                    }
                }
            }
        } else {
            setLoading(false)
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({});
            }, 7000);
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
                    name: "Adjunto_CorporateRef.pdf",
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
            console.log(reader.result)
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

    React.useEffect(() => {
        if (typeUser === 'NIT') {
            gettipoSector()
        }
    }, [typeUser, gettipoSector])

    return (
        <div className="App">
            <main className='App-main'>
                <section className='Banner-informativo'>
                    <div className='comf-container'>
                        <div className=''>
                            <div className='comf-col-12 container-text-informativo'>
                                <h2>Solicitud para referir cliente corporativo</h2>
                                <p className='comf-subtitulo'>En esta ventana podrás referir la empresa que se va a refirir en Comfenalco.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='App-main-container'>
                    <div className='components-main'>
                        <div className='cart-component'>

                            <div className='cart-header margin-center'>
                                <h2 className='title-form'>Solicitud para referir cliente corporativo</h2>
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
                                                        <div className="fila-col ">
                                                            <span htmlFor="idCorredor" className="text-label label-select-form">ID del corredor que refiere *</span>
                                                            <input readOnly onChange={(e) => inputChangeHandler(e)} value={formDataInfoCorporate.idCorredor} type='string' id='idCorredor' name='idCorredor' className='number-identification input-form disabledTextInput' />
                                                        </div>
                                                    </div>
                                                    <div className=''>
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
                                                                                typeUser === "NIT" ?
                                                                                (
                                                                                    <option value={`${tipoCliente[0].code}`}>{tipoCliente[0].description}</option>
                                                                                )
                                                                                :
                                                                                (
                                                                                    null
                                                                                )
                                                                            // tipoCliente.map((tipo) => (
                                                                            //   <option key={tipo.code} value={`${tipo.code}`}>{tipo.description}</option>
                                                                            // ))
                                                                        }
                                                                    </select>
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

                                                    <div className=''>
                                                        <div className='fila-col'>
                                                            <h2 className='title-form'> Datos de contacto</h2>
                                                        </div>
                                                    </div>

                                                    <div className=''>
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

                                                </div>

                                                <div className=''>
                                                    <div>
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
                                                    </div>

                                                    <div className=''>
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
                                                                imageLoad && formError ?
                                                                    (
                                                                        <button className='btn-submit-search  margin-auto' type='button' readOnly>Referir empresa</button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button className='btn-submit-search  margin-center' type='submit'>Referir empresa</button>
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

export default CreateTicketReferirCorporate