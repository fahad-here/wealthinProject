const Joi = require('joi')

const getResponseMessage = (
    res,
    resultCode,
    error = true,
    message = "",
    payload = null
) => {
    res.status(resultCode)
    res.send({
        error: error,
        message: message,
        payload: payload
    })
}

const validateBody= (schema) => {
    return async (req, res, next) => {
        try {
            const result = await Joi.validate(req.body, schema, {allowUnknown: false})
            if (!req.value) {
                req.value = {}
            }
            req.value['body'] = result.value
            next()
        } catch (e) {
            next(e)
        }
    }
}

const schemas = {
    listingSchema: Joi.object().keys({
        id: Joi.number().required(),
        unitNumber: Joi.number().required(),
        propertyType: Joi.string().required(),
        category: Joi.string().required(),
        location: Joi.string().required(),
        bedrooms: Joi.number().required(),
        bathrooms: Joi.number().required(),
        listingType: Joi.string().required(),
        listingPrice: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        images: Joi.array().items(Joi.string()),
    })
}

module.exports = {
    getResponseMessage,
    schemas,
    validateBody
}