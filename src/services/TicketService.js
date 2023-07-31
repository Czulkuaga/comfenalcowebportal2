const TicketService = {}

//QA
// const crearTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsTicketC4COData/`
// const attachTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsTicketC4COData/`
// const consultaTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsTicketC4COData/`
// const updateTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45400/RESTAdapter/wsTicketC4COData/`

//Produccion
const crearTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/wsTicketC4COData/`
const attachTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/wsTicketC4COData/`
const consultaTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/wsTicketC4COData/`
const updateTicket_API_URL = `https://srvdpsap.comfenalcoantioquia.com:45500/RESTAdapter/wsTicketC4COData/`

//QA
// const Username = 'POFORMWEBC4C'
// const Password = 'd7d38Hnojmi7f6'

//Producción
const Username = 'POFORMWEBC4C'
const Password = 'd7d38Hnojmi7f6'

TicketService.createTicketIncripcion = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headers = new Headers()

    headers.set('Content-Type', 'text/json')
    headers.set('Authorization', 'Basic ' + auth)
    headers.set('Calculator_Operation', 'crearTicket')

    let createTicket = await fetch(crearTicket_API_URL, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(formData)
    })
    
    if(!createTicket.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al crear ticket de inscripción'
        }
        return response
    }

    let data = await createTicket.json()
    let response = {
        code: 'success',
        corporateInfo: data.serviceRequest
    }
    return response
}

TicketService.attachTicket = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headers = new Headers()

    headers.set('Content-Type', 'text/json')
    headers.set('Authorization', 'Basic ' + auth)
    headers.set('Calculator_Operation', 'attachTicket')

    let createTicket = await fetch(attachTicket_API_URL, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!createTicket.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al crear ticket de inscripción'
        }
        return response
    }

    let data = await createTicket.json()
    let response = {
        code: 'success',
        corporateTicketInfo: data
    }
    return response
}

TicketService.fetchTicketPQRS = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headers = new Headers()

    headers.set('Content-Type', 'text/json')
    headers.set('Authorization', 'Basic ' + auth)
    headers.set('Calculator_Operation', 'consultaTicket')

    let createTicket = await fetch(consultaTicket_API_URL, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(formData)
    })

    if(!createTicket.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al crear ticket de inscripción'
        }
        return response
    }

    let data = await createTicket.json()
    let response = {
        code: 'success',
        consultaTicket: data
    }
    return response
}

TicketService.updateTicket = async (formData) => {
    //basic Authentication
    let auth = window.btoa(`${Username}:${Password}`)
    //Customer Headers
    let headers = new Headers()

    headers.set('Content-Type', 'text/json')
    headers.set('Authorization', 'Basic ' + auth)
    headers.set('Calculator_Operation', 'modificarTicket')

    // console.log(formData)

    let updatedTicket = await fetch(updateTicket_API_URL, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(formData)
    })
    // console.log(updatedTicket)
    if(!updatedTicket.ok){
        let response = {
            code: 'Error500',
            msg: 'Error al crear ticket de inscripción'
        }
        return response
    }

    let data = await updatedTicket.json()
    // console.log(data)
    let response = {
        code: 'success',
        actualizarticket: data
    }
    return response
}

export default TicketService