export const RemoveTilde = (string) => {
    const ValidateVocales = {'á': 'a', 'Á': 'A', 'é': 'e', 'É': 'E', 'í': 'i','Í':'I', 'ó': 'o','Ó':'O', 'ú': 'u', 'Ú':'U'};
  for (let vocalTilde in ValidateVocales) {
    const vocal = ValidateVocales[vocalTilde];
    const expresionRegular = new RegExp(vocalTilde, 'g');
    string = string.replace(expresionRegular, vocal);
  }
  return string;
}

export const VerifyDigitNIT = (nit) => {
    nit = nit.replace(/\./g, "");
    nit = nit.replace(/-/g, "");
    nit = nit.replace(/ /g, "");
    if (nit.length < 6 || nit.length > 11) {
        let response = {
            status: false,
            msg: "El NIT debe tener entre 6 y 11 dígitos."
        }
      return response
    }
    if (isNaN(nit)) {
        let response = {
            status: false,
            msg: "El NIT debe contener solo números."
        }
      return response;
    }
    let secuenciaDian = [71,67,59,53,47,43,41,37,29,23,19,17,13,7,3]
    let qtyLentNit = nit.length
    let secBase = secuenciaDian.slice(secuenciaDian.length - qtyLentNit)

    const arrayMultiplicacion = secBase.map((valor, indice) => {
        let value = valor * nit[indice]
        return value
    });

    let sumaArrayMul = 0

    arrayMultiplicacion.forEach((val) => sumaArrayMul = sumaArrayMul + val)

    let modResult = sumaArrayMul / 11
    let IntMod = parseInt(modResult)
    let NewMulResult = IntMod * 11
    let newResult = sumaArrayMul - NewMulResult
    let resta = 11 - newResult
    let dig

    if(newResult === 0 || newResult === 1){
        dig = newResult
    }else{
        dig = resta
    }


    let response = {
        status: true,
        msg: dig
    }
    return response
}
