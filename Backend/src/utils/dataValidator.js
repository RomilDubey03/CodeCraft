import validator from 'validator';
import ApiError from './apiError';

const validate = (data)=>{
    const mandatoryFields = ['fullName', 'email', 'password'];

    const isAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));

    if(!isAllowed){
        throw new ApiError(400, "Some fields are missing");
    }
    if(!validator.isEmail(data.email)){
        throw new  ApiError(400, "Invalid Email ID");
    }
    if(!validator.isStrongPassword(data.password)){
        throw new ApiError(400, "Password entered is weak");
    }
}

export default validate;
