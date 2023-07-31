const IndividualCustomerService = {}
//QA
// const userApi = 'POFORMWEBC4C'
// const passwordApi = 'd7d38Hnojmi7f6'

//Poduccion
const userApi = 'POFORMWEBC4C'
const passwordApi = 'xAXx6hyKU5wQT'

const IndividualCustomerTaxNumberColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/wsCustomerC4C/Consulta/`
const IndividualCustomerColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/Odata/DatosBasicos`
const CreateIndividualCustomerColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/CreaClienteDatosBasicos`
const CreateIndividualCustomerTaxNumberColletion_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/IdentificacionFiscal`
const ModificarClienteC4COdata_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/wsModificarClienteC4COData/`

IndividualCustomerService.searchIndividualCustomer = async (NumDoc, TipoDoc) => {
    
    //basic Authentication
    let auth = window.btoa(`${userApi}:${passwordApi}`)
    //Customer Headers
    let headersCustomer = new Headers()

    headersCustomer.set('Content-Type', 'text/json')
    headersCustomer.set('Authorization', 'Basic ' + auth)
    headersCustomer.set('Calculator_Operation', 'consultaCliente')

    //Query Individual Customer
    let requestDataCustomer = {
        Item: {
          TipoDoc: TipoDoc,
          NumDoc: NumDoc,
        }
      }

    let infoIndividualCustomer = await fetch(IndividualCustomerTaxNumberColletion_API_URL,{
        headers: headersCustomer,
        method: "POST",
        body: JSON.stringify(requestDataCustomer)
    })

    if (!infoIndividualCustomer.ok){
        let response = {
            code: 'Error500',
            msg: 'Something went wrong'
        }
        return response
    }

    let data = await infoIndividualCustomer.json()
    let response = data
    return response
}

IndividualCustomerService.searchIndividualCustomerService = async (formData) => {

    //basic Authentication
    let auth = window.btoa(`${userApi}:${passwordApi}`)
    //Customer Headers
    let headersCustomer = new Headers()

    headersCustomer.set('Content-Type', 'text/json')
    headersCustomer.set('Authorization', 'Basic ' + auth)

    //Query Individual Customer
    let requestDataCustomer = {
        customerID:formData
    }
    
    let infoIndividualCustomer = await fetch(IndividualCustomerColletion_API_URL,{
        headers: headersCustomer,
        method: "POST",
        body: JSON.stringify(requestDataCustomer)
    })
    // console.log(infoIndividualCustomer)
    if (!infoIndividualCustomer.ok){
        let response = {
            code: 'Error500',
            msg: 'Something went wrong'
        }
        return response
    }

    let data = await infoIndividualCustomer.json()
    let response = data
    return response   
}

IndividualCustomerService.createIndividualCustomerDatosBasicos = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${userApi}:${passwordApi}`)
    //Customer Headers
    let headersCustomer = new Headers()

    headersCustomer.set('Content-Type', 'text/json')
    headersCustomer.set('Authorization', 'Basic ' + auth)

    let infoIndividualCustomer = await fetch(CreateIndividualCustomerColletion_API_URL,{
        headers: headersCustomer,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if (!infoIndividualCustomer.ok){
        let response = {
            code: 'Error500',
            msg: 'Something went wrong'
        }
        return response
    }

    let data = await infoIndividualCustomer.json()
    let response = data
    return response
}

IndividualCustomerService.createIndividualCustomerIdentification = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${userApi}:${passwordApi}`)
    //Customer Headers
    let headersCustomer = new Headers()

    headersCustomer.set('Content-Type', 'text/json')
    headersCustomer.set('Authorization', 'Basic ' + auth)

    let infoIndividualCustomer = await fetch(CreateIndividualCustomerTaxNumberColletion_API_URL,{
        headers: headersCustomer,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if (!infoIndividualCustomer.ok){
        let response = {
            code: 'Error500',
            msg: 'Something went wrong'
        }
        return response
    }

    let data = await infoIndividualCustomer.json()
    let response = data
    return response
}

IndividualCustomerService.updateIndividualCustomerDatosbasicos = async (formdata) => {
    //basic Authentication
    let auth = window.btoa(`${userApi}:${passwordApi}`)
    //Customer Headers
    let headersCustomer = new Headers()

    headersCustomer.set('Content-Type', 'text/json')
    headersCustomer.set('Authorization', 'Basic ' + auth)
    headersCustomer.set('Calculator_Operation', 'actualizarDatosBasicosPersona')

    let updateIndividualCustomer = await fetch(ModificarClienteC4COdata_API_URL,{
        headers: headersCustomer,
        method: "POST",
        body: JSON.stringify(formdata)
    })

    if (!updateIndividualCustomer.ok){
        let response = {
            code: 'Error500',
            msg: 'Something went wrong'
        }
        return response
    }

    let data = await updateIndividualCustomer.json()
    let response = data
    return response
}

export default IndividualCustomerService