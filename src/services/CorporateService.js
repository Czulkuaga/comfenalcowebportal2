const CorporateService = {}

const CorporateAccountTaxnumberColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsEmpresaC4COData/Consulta/`
const CorporateAccountData_API_URI = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsEmpresaC4COData/Consulta/`
const CorporateAccountColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsEmpresaC4COData/Creacion/`
const CorporateAccounttaxnumberColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsEmpresaC4COData/Creacion/`
const AccountoColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsEmpresaC4COData/Creacion/`
const findTeamCorporate_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsConsultaEquipoCliente/Consulta/`
const fetchContact_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsConsultaContacto/`

const Username = 'POFORMWEBC4C'
const Password = 'd7d38Hnojmi7f6'

CorporateService.findCorporate = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)
    headersCorporate.set('Calculator_Operation', 'consultarIdCuenta')

    let findCorporateTaxNumber = await fetch(CorporateAccountTaxnumberColletion_API_URL, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!findCorporateTaxNumber.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await findCorporateTaxNumber.json()
    let response = {
        code: 'success',
        corporateInfo: data.consultarIdCuenta
    }
    return response
}

CorporateService.findCorporateData = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)
    headersCorporate.set('Calculator_Operation', 'consultarDatosBasicos')

    let findCorporateTaxNumber = await fetch(CorporateAccountData_API_URI, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!findCorporateTaxNumber.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await findCorporateTaxNumber.json()
    let response = {
        code: 'success',
        corporateInfo: data.consultarDatosBasicos
    }
    return response
}

CorporateService.createCorporateAccount = async (formData) => {

    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)
    headersCorporate.set('Calculator_Operation', 'DatosBasicosEmpresa')

    let createCorporateBasicData = await fetch(CorporateAccountColletion_API_URL, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!createCorporateBasicData.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await createCorporateBasicData.json()
    let response = {
        code: 'success',
        corporateInfo: data.datosBasicos
    }
    return response
}

CorporateService.createCorporateAccountTaxNumber = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)
    headersCorporate.set('Calculator_Operation', 'IdentificacionfiscalEmpresa')

    let createCorporateBasicData = await fetch(CorporateAccounttaxnumberColletion_API_URL, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!createCorporateBasicData.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await createCorporateBasicData.json()
    let response = {
        code: 'success',
        corporateInfoTaxNumber: data.identificacionfiscal
    }
    return response
}

CorporateService.createCorporateContactData = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)
    headersCorporate.set('Calculator_Operation', 'DatosBasicosContacto')

    let createCorporateBasicData = await fetch(AccountoColletion_API_URL, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!createCorporateBasicData.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await createCorporateBasicData.json()
    let response = {
        code: 'success',
        corporateInfoContactData: data.datosBasicos
    }
    return response
}

CorporateService.searchTeamCorporate = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)

    let findCorporateTeam = await fetch(findTeamCorporate_API_URL, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!findCorporateTeam.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await findCorporateTeam.json()
    let response = {
        code: 'success',
        corporateTeam: data.corporateTeam
    }
    return response
}

CorporateService.fetchContact = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headersCorporate = new Headers()

    headersCorporate.set('Content-Type', 'text/json')
    headersCorporate.set('Authorization', 'Basic ' + auth)

    let findContact = await fetch(fetchContact_API_URL, {
        headers: headersCorporate,
        method: "POST",
        body: JSON.stringify(formData)
    })
    
    if(!findContact.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al enviar la información, intentelo de nuevo'
        }
        return response
    }

    let data = await findContact.json()
    let response = {
        code: 'success',
        contactData: data.datosBasicos
    }
    return response
}

export default CorporateService