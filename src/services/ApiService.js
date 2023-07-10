import URLServer from '../config/Server'
const ApiService = {}

const GET_IDENTIFICATION_TYPE_API_URL = `${URLServer}/api/master-identification-type/get`
const GET_CLIENT_TYPE_API_URL = `${URLServer}/api/master-client-type/get`
const GET_GENDER_TYPE_API_URL = `${URLServer}/api/master-gender/get`

// const GET_CATEGORY_PQRS = `http://localhost:4000/files/get-file-data/CategoriasPQRS`

ApiService.GetIdentificationtype = async () => {
    let getIdentificationtype = await fetch(GET_IDENTIFICATION_TYPE_API_URL)
    if(!getIdentificationtype.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getIdentificationtype.json()
    let response = {
        code: 'success',
        identificationType: data.tipoidentificacion
    }
    return response
}

ApiService.GetClientType = async () => {
    let getClientType = await fetch(GET_CLIENT_TYPE_API_URL)
    if(!getClientType.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getClientType.json()
    let response = {
        code: 'success',
        clientType: data.tipocliente
    }
    return response
}

ApiService.getGenderType = async () => {
    let getGenderType = await fetch(GET_GENDER_TYPE_API_URL)
    if(!getGenderType.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getGenderType.json()
    let response = {
        code: 'success',
        genderType: data.gender
    }
    return response
}

export default ApiService