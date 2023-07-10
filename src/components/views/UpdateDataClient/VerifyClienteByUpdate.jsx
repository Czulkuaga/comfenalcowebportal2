import React from 'react'
import '../../../App.css'
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import Setting from '../../../config/Server'

//import CustomComponents
import Spinner from '../../custom/Spinner';

//Import Services
import CorporateService from '../../../services/CorporateService';
import IndividualCustomerService from '../../../services/IndividualCustomerService';

const VerifyClienteByUpdate = () => {
    //LocalStorage
    let typeUser = JSON.parse(localStorage.getItem('typeCusto'))

    //States
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState({})
    const navigate = useNavigate();
    const location = useLocation()
    const [code, setCode] = React.useState("")
    const [emailUser, setEmailUser] = React.useState(null)

    //Params
    const query = new URLSearchParams(location.search)
    const obtainData = query.get('usuario')
    const params = window.atob(obtainData)

    //useRef
    const formVerifyCorredor = React.useRef(null)

    //Funsctions
    const TransformEmail = (email) => {
        //console.log(email)
        let separeEmail = email.split('@')
        //console.log(separeEmail)
        let newStringEmail = separeEmail[0].slice(0, 5) + "xxxxxx"
        //console.log(newStringEmail)
        let newConvertEmail = `${newStringEmail}@${separeEmail[1]}`
        //console.log(newConvertEmail)
        return newConvertEmail
    }

    const getUserData = React.useCallback(async (params) => {
        setLoading(true)
        if (typeUser === "NIT") {
            if (params !== "" || params || params !== null) {
                try {
                    let formdata = {
                        parametros: {
                            empresa: {
                                idCuenta: params
                            }
                        },
                        auditoria: {
                            idPeticion: "012334344",
                            usuario: "jpalacia",
                            ip: "10.10.8.52",
                            fecha: "2023-04-11",
                            hora: "01:00:00",
                            operacionWeb: "Datos Basicos",
                            aplicativoPeticion: "prueba"
                        }
                    }
                    let response = await CorporateService.findCorporateData(formdata)
                    if (response.corporateInfo.empresa) {
                        let corporateInfo = response.corporateInfo.empresa[0]
                        // console.log(corporateInfo)
                        setEmailUser(corporateInfo.email)
                        setLoading(false)
                    }
                } catch (error) {
                    toast.error(`Hubo un error al enviar los datos`, { autoClose: 3000 })
                    console.log(error)
                    setLoading(false)
                }
            }
        } else {
            let urlCustomer = 'https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/Odata/DatosBasicos'
            let user = 'PISERVICE'
            let password = '8Chw0MsH@7Gbs'
            let auth = window.btoa(`${user}:${password}`)

            let headers = new Headers()

            headers.set('Content-Type', 'text/json');
            headers.set('Authorization', 'Basic ' + auth)
            //console.log(params)

            let SendForValidation =
            {
                customerID: params
            }


            if (params !== "" || params || params !== null) {
                await fetch(urlCustomer, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify(SendForValidation)
                }).then(response => response.json()).then(res => {
                    if (res.error) {
                        toast.error(`Hubo un error al enviar los datos`, { autoClose: 3000 })
                        console.log(res.error)
                        setLoading(false)
                    } else {
                        //   console.log(res)
                        //toast.success(`Verificación enviada`, { autoClose: 3000 })
                        setEmailUser(res.email)
                        setLoading(false)

                    }
                })
                    .catch(err => {
                        toast.error(`${err}`, { autoClose: 3000 })
                        setLoading(false)
                    })
            } else {
                toast.error(`No hay usuario para verificar`, { autoClose: 3000 })
                setLoading(false)
            }
        }
    }, [typeUser])

    const SendEmailVerification = async (emailUser, customerID) => {
        setLoading(true)
        let data = {
            emailUser: emailUser,
            customerID: customerID
        }
        // console.log(emailUser)
        if (emailUser) {
            await fetch(`${Setting}/api/users/verify/customer-verify`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(res => {
                    toast.success(`Email enviado correctamente`, { autoClose: 3000 })
                    console.log(res)
                    setLoading(false)
                })
                .catch(err => toast.error('Hubo un error al envia el email', 2000))
        } else {
            toast.error(`No hay email registrado`, { autoClose: 3000 })
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}

        if (code === "") newErrors.code = 'El código de usuario es requerido';

        if (Object.keys(newErrors).length === 0) {
            postData(params)
        } else {
            setLoading(false)
            setErrors(newErrors);
            setTimeout(() => {
                setErrors({});
            }, 7000);
        }
    }

    const postData = async (clientId) => {
        setLoading(true)
        const newErrors = {}

        let formData = {
            parametros: {
                empresa: {
                    idCuenta: clientId
                }
            },
            auditoria: {
                idPeticion: "012334344",
                usuario: "jpalacia",
                ip: "10.10.8.52",
                fecha: "2023-04-11",
                hora: "01:00:00",
                operacionWeb: "Datos Basicos",
                aplicativoPeticion: "prueba"
            }
        }

        if (code !== params) newErrors.code = 'El código del usuario es diferente del ingresado';


        if (Object.keys(newErrors).length === 0) {
            if (typeUser === "NIT") {
                let response = await CorporateService.findCorporateData(formData)
                console.log(response)
                toast.success(`Verificación realizada exitosamente`, { autoClose: 3000 })
                navigate(`/programa-referidos/corredor/crear-ticket?idcorredor=${response.corporateInfo.empresa[0].idCuenta}`)
                setLoading(false)
            } else {
                let response = await IndividualCustomerService.searchIndividualCustomerService(clientId)
                if (response.code === 'Error500') {
                    newErrors.formError = "Hubo un error al verificar el usuario, recarga e intenta de nuevo si no contactate con nosotros"
                    setErrors(newErrors)
                    console.log(response)
                } else {
                    //   console.log(response)
                    let corredorIdEncrypt = window.btoa(`${JSON.stringify(response.customerID)}`)
                    toast.success(`Verificación realizada exitosamente`, { autoClose: 3000 })
                    navigate(`/programa-referidos/clientes/update-client-by-update?usuario=${corredorIdEncrypt}`)
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
    }

    const handleChange = (e) => {
        // console.log(e.target.value)
        setCode(e.target.value)
    }

    const sendEmailVerificationClient = (emailUser, params) => {
        SendEmailVerification(emailUser, params)
    }


    //useEffect
    React.useEffect(() => {
        getUserData(params)
    }, [params, getUserData])

    return (
        <div className="App">
            <main className='App-main'>
                <section className='Banner-informativo'>
                    <div className='comf-container'>
                        <div className=''>
                            <div className='comf-col-12 container-text-informativo'>
                                <h2>Ingrese el código de usuario</h2>
                                <p className='comf-subtitulo'>En el campo que mostramos a continuación, indica el código que te llegará al email.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='App-main-container'>
                    <div className='components-main'>
                        <div className='cart-component'>
                            <div className='cart-header'>
                                {
                                    errors.formError && <h4 className='errorForm'>{errors.formError}</h4>
                                }

                                <h2 className='title-form'>Verificación</h2>

                            </div>
                            <div className='cart-main'>

                                {
                                    loading ?
                                        (
                                            <Spinner />
                                        )
                                        :
                                        (
                                            <form ref={formVerifyCorredor} className='search-corredor' onSubmit={(e) => handleSubmit(e)}>
                                                <div>
                                                    <div className='form-component'>
                                                        <p className='nota-form'><br></br>Haz clic en el botón enviar, para recibir el código de verificación. Este será enviado al correo <b>{emailUser !== null ? TransformEmail(emailUser) : 'email@correo.com'}</b>. Si los datos no son correctos, actualice sus datos en <b>www.serviciosenlínea.com</b> ó <b>6044447110</b>.</p>
                                                    </div>
                                                </div>
                                                <div className='form-component' style={{ marginBottom: 30 }}>
                                                    <button className='btn-submit-search' type='button' onClick={() => sendEmailVerificationClient(emailUser, params)}>Enviar código de verificación</button>
                                                </div>
                                                <div>
                                                    <div className='position-relative'>
                                                        <div className={!errors.code ? 'form-component' : 'form-component form-component-error'}>
                                                            <span htmlFor="number-identification" className="text-label label-select-form">Escribe el código de verificación *</span>
                                                            <input onChange={(e) => handleChange(e)} type='string' id='code-verification' name='code-verification' className='number-identification input-form' />
                                                        </div>
                                                        {
                                                            errors.code && <h4 className='errorMsg'>{errors.code}</h4>
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='form-component'>
                                                        <button className='btn-submit-search' type='submit'>Verificar cliente</button>
                                                    </div>
                                                </div>



                                            </form>
                                        )
                                }
                            </div>
                        </div >
                    </div >
                </section >
            </main >
        </div>
    )
}

export default VerifyClienteByUpdate