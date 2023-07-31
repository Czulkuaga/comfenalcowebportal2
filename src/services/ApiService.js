import URLServer from '../config/Server'
const ApiService = {}

const GET_IDENTIFICATION_TYPE_API_URL = `${URLServer}/corredores-back/master-identification-type/get`
const GET_CLIENT_TYPE_API_URL = `${URLServer}/corredores-back/master-client-type/get`
const GET_GENDER_TYPE_API_URL = `${URLServer}/corredores-back/master-person-sex/get`
const GET_SECTOR_TYPE_API_URL = `${URLServer}/corredores-back/master-person-sector/get`
const GET_SUPER_PQRSF_API_URL = `${URLServer}/corredores-back/master-category-pqrs/get`
const GET_SERVICE_PQRSF_API_URL = `${URLServer}/corredores-back/master-super-pqrs/get`
const GET_ISSUE_MASTER_CATEGORY_API_URL = `${URLServer}/corredores-back/master-issue-category/get`

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
    // console.log(data)
    let response = {
        code: 'success',
        identificationType: data
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
    // console.log(data)
    let response = {
        code: 'success',
        clientType: data
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
        genderType: data
    }
    return response
}

ApiService.GetSectorType = async () => {
    let getSectorType = await fetch(GET_SECTOR_TYPE_API_URL)
    if(!getSectorType.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getSectorType.json()
    // console.log(data)
    let response = {
        code: 'success',
        getSectorType: data
    }
    return response
}

ApiService.GetSuperPQRSF = async () => {
    let getSuperPQRSF = await fetch(GET_SUPER_PQRSF_API_URL)
    if(!getSuperPQRSF.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getSuperPQRSF.json()
    // console.log(data)
    let response = {
        code: 'success',
        getSuperPQRSF: data
    }
    return response
}

ApiService.GetServiceCategoryPQRSF = async () => {
    let getServiceCategoryPQRSF = await fetch(GET_SERVICE_PQRSF_API_URL)
    if(!getServiceCategoryPQRSF.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getServiceCategoryPQRSF.json()
    // console.log(data)
    let response = {
        code: 'success',
        getServiceCategoryPQRSF: data
    }
    return response
}

ApiService.GetIssueMasterCategory = async () => {
    let getIssueMasterCategory = await fetch(GET_ISSUE_MASTER_CATEGORY_API_URL)
    if(!getIssueMasterCategory.ok){
        let response = {
            code: 'error500',
            msg: "Something went wrong"
        }
        return response
    }
    let data = await getIssueMasterCategory.json()
    // console.log(data)
    let response = {
        code: 'success',
        getIssueMasterCategory: data
    }
    return response
}
export default ApiService