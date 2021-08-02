import Joi from 'joi';

const validate = (type, params) => (req, res, next) => {
  const schema = Joi.object(params);
  const { value, error } = schema.validate(req[type]);
  req[type] = value;
  return error ? res.status(422).send({ error: error.details }) : next();
};

export const Validate = validate;
