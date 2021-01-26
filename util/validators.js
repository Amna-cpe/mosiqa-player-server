
const isEmpty = (string)=>{
    if(string.trim()===""){
        return true
    }else{
        return false
    }
       
}
const isEmail = (email)=>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)){
        return true
    }else{
        return false
    }
       
}
exports.validateSignUpData = (data)=>{
let errors={}

//VALIDATE EMAIL//
if(isEmpty(data.email)){
   errors.email = "Must not be empty"
}else if(!isEmail(data.email)){
    errors.email="Must be a valid email address"  
}

//VALIDATE PASSWORD
if(isEmpty(data.password)){
    errors.password="Must not be empty"
}

if(data.password !== data.confirmPassword)
errors.password = "Password must match "

 //VALIDATE USERNAME//
if(isEmpty(data.username)) errors.username = "Must not be empty "
// since it dousenot return respose
//if(Object.keys(errors).length>0) return res.status(400).json(errors)

return {
    errors,
    valid:Object.keys(errors).length===0?true:false
}

}
exports.validateSignInData = (data)=>{
        let errors = {};
        //VALIDATE EMAIL//
        if(isEmpty(data.email)){
        errors.email = "Must not be empty"
        }else if(!isEmail(data.email)){
        errors.email="Must be a valid email address"  
        }
        //VALIDATE PASSWORD
        if(isEmpty(data.password)){
        errors.password="Must not be empty"
        }
       
        return{
            errors,
            valid:Object.keys(errors).length===0?true:false
        }
}

