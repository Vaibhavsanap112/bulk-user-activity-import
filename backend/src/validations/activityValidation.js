const Joi = require("joi");


const recordSchema = Joi.object({
  userId:Joi.number().required(),
  email: Joi.string().email().required(),
  activity: Joi.string().required(),
  timesstamp : Joi.date().required(),
});

const validateRecord = (record) =>{
  const {error} = recordSchema.validate(record);


  if(error){
    return error. details[0].message;

  }

  return null;
};

module.exports = {validateRecord}