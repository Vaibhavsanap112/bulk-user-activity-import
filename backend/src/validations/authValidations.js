const Joi  = require("joi");


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password:Joi.string().min(6).required(),
})

const validateLogin = (data)=>
{
  if(error) {
    return error.details[0].message;
  }
  return null;
}


const signupSchema =Joi.object({
  name:Joi.string().min(3).max(50).required(),
  email:Joi.string().email().required(),
  password:Joi.string().min(6).required(),
})

const validateSignup = (data)=>{
  const {error} = signupSchema.validate(data);
  return error? error.details[0].message:null;
}

module.exports = {validateLogin, validateSignup};