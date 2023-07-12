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
// import CorporateService from '../../../services/CorporateService';
import IndividualCustomerService from '../../../services/IndividualCustomerService';
// import TicketService from '../../../services/TicketService'

const rows = []
const typeClient = []
// const typeSector = []
const genderList = []
// const tipoIdentFiscal = [
//     {
//         value: '11',
//         label: "REGISTRO DE NACIMIENTO"
//     },
//     {
//         value: '12',
//         label: 'TARJETA DE IDENTIDAD'
//     },
//     {
//         value: '13',
//         label: 'CÉDULA DE CIUDADANÍA'
//     },
//     {
//         value: '16',
//         label: 'PERMISO ESPECIAL VENEZOLANO'
//     },
//     {
//         value: '21',
//         label: 'TARJETA DE EXTRANJERÍA'
//     },
//     {
//         value: '41',
//         label: 'PASAPORTE'
//     }
// ]

const UpdateClientByUpdateData = () => {
    //RegExpre
    let validNumber = /^[0-9]{10}$/g
    let validEmail = /^[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9*+/={|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/g

    //LocalStorage
    let typeUser = JSON.parse(localStorage.getItem('typeCusto'))
    let typedoc = JSON.parse(localStorage.getItem('typeEmpre'))
    let numDoc = JSON.parse(localStorage.getItem('numDoc'))

    //UseRef
    const formCreateTicket = React.useRef(null)

    const navigate = useNavigate();
    //Params
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const obtainData = query.get('usuario')
    const params = window.atob(obtainData)

    //useState
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState({})
    const [formError, setFormError] = React.useState(false)
    const [finderTypeDoc, setFinderTypeDoc] = React.useState("")
    const [tipoIdentificacion, setTipoIdentificacion] = React.useState([])
    const [tipoCliente, setTipoCliente] = React.useState([])
    // const [tipoSector, setTipoSector] = React.useState([])
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
        aceptTerms: false,
        objectID: ""
    })

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
        if (typeUser !== 'NIT') {
            try {
                if (params) {
                    // console.log(params)
                    let IndividualCustomerData = await IndividualCustomerService.searchIndividualCustomer(numDoc, typeUser)
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
                            phone: JSON.stringify(getIndividualCustomerData.mobile),
                            emailUser: getIndividualCustomerData.email,
                            aceptTerms:false,
                            objectID: IndividualCustomerData.IndividualCustomerTaxNumberCollection.IndividualCustomerTaxNumber.ParentObjectID
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
        } else {
            setLoading(false)
            toast.error(`No se pudo traer la información del cliente`, { autoClose: 3000 })
            return
        }
    }, [typeUser, numDoc])

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const newErrors = {}

        if (formDataInfoCustomer.phone === "") newErrors.phone = 'El número de celular del contacto es requerido';
        if (formDataInfoCustomer.emailUser === "") newErrors.emailUser = 'El correo electrónico del contacto es requerido';
        if (formDataInfoCustomer.aceptTerms === false) newErrors.aceptTerms = 'Si debes continuar, acepta los términos, condiciones y tratamiento de datos personales';

        if (formDataInfoCustomer.phone !== "") {
            let isValidNumber = formDataInfoCustomer.phone.match(validNumber)
            if (!isValidNumber) {
                newErrors.phone = 'El número de contacto que ingresate no es válido debe contener 10 dígitos';
            }
        }

        if (formDataInfoCustomer.emailUser !== "") {
            let isValidEmail = formDataInfoCustomer.emailUser.match(validEmail)
            if (!isValidEmail) {
                newErrors.emailUser = 'El correo electrónico de contacto que ingresate no es válido';
            }
        }

        if (Object.keys(newErrors).length === 0) {
            if (typeUser !== 'NIT') {
                try {
                    let formData = {
                        auditoria: {
                            idPeticion: "12212",
                            usuario: "jpalacia",
                            ip: "10.1.1.1",
                            fecha: "2022-01-01",
                            hora: "10:10:10",
                            operacionWeb: "actualizarDatosBasicosPersona",
                            aplicativoPeticion: "actualizarDatosBasicosPersona"

                        },
                        parametros: {
                            persona: {
                                objectID: formDataInfoCustomer.objectID,
                                customerID: params,
                                email: formDataInfoCustomer.emailUser,
                                mobile: formDataInfoCustomer.phone,
                                contactopermiso: "1",
                                Z_IP_KUT: "192.168.1.113"
                            }
                        }

                    }
                    let updateIndividualCustomer = await IndividualCustomerService.updateIndividualCustomerDatosbasicos(formData)
                    // console.log(updateIndividualCustomer)
                    if (updateIndividualCustomer.code !== "Error500") {
                        setLoading(false)
                        localStorage.clear()
                        toast.success(`Se ha actualizado el cliente exitosamente`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                        navigate(`/`)
                    } else {
                        toast.error(`Hubo un error al intentar actualizar el cliente`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                        setLoading(false)
                        return;
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(`Hubo un error en el servicio de actualizar`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                    setLoading(false)
                }
            } else {
                toast.error(`No se pudo actualizar la información`, { autoClose: 2000,position: toast.POSITION.TOP_CENTER })
                setLoading(false)
                return;
            }
        } else {
            setLoading(false)
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({});
            }, 7000);
        }

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


    return (
        <div className="App">
            <main className='App-main'>
                <section className='Banner-informativo'>
                    <div className='comf-container'>
                        <div className=''>
                            <div className='comf-col-12 container-text-informativo'>
                                <h2>Actualización Datos de contacto</h2>
                                <p className='comf-subtitulo'>A continuación podrás visualizar los datos como te encuentras registrado en Comfenalco Antioquia. Aquí podrás actualizar correo electrónico, celular y autorización de datos personales.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='App-main-container'>
                    <div className='components-main'>
                        <div className='cart-component'>

                            <div className='cart-header margin-center'>
                                <h2 className='title-form'>Actualizar Datos</h2>
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
                                                <div className=''>
                                                    <div className=''>
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
                                                                <div className={!errors.phone ? 'form-component' : 'form-component form-component-error'}>

                                                                    <span htmlFor="phone" className='text-label label-select-form'>¿A qué número de celular te podemos contactar? *</span>
                                                                    <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.phone} type='text' id='phone' name='phone' className='celular input-form' />
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
                                                                    <input onChange={(e) => inputChangeHandler(e)} value={formDataInfoCustomer.emailUser} type='text' id='emailUser' name='emailUser' className='email input-form' />
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
                                                                        <button className='btn-submit-search  margin-auto' type='button' readOnly>Actualizar Información</button>
                                                                    )
                                                                    :
                                                                    (
                                                                        <button className='btn-submit-search  margin-center' type='submit'>Actualizar Información</button>
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

export default UpdateClientByUpdateData