import { isValidIMEI } from "../functions";

export const imeiMiddleware = (request , response , next) => { 

    var imei =  request.get('imei');

    if (!imei || imei.trim() == "") { 
        request.imeiValid = false ; 
        return next() ; 

    }

    request.imeiValid = isValidIMEI(imei) ;  
    request.imei = imei ; 
    
 
    
    
    return next() ; 
}