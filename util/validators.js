const Joi = require("joi");
const { resourceState, attendenceTypeEnum, attendenceStatusEnum, shiftEnum } = require("./constant");
const { default: mongoose } = require("mongoose");

const userSchema = Joi.object({
    name: Joi.string().min(1).required(),
    roleId: Joi.string().required(),
    adhar: Joi.string().required(),
    pan: Joi.string().optional(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({"string.pattern.base":"Required Valid Mobile Number","any.required": "Mobile number is required"}), // basic Indian mobile validation
    email: Joi.string().email().optional().allow(""),
    address: Joi.string().required(),
    pincode: Joi.string().length(6).pattern(/^[1-9][0-9]{5}$/).required(), // Indian pincode
    dob: Joi.string().optional() // optionally validate as a date: Joi.date().iso().required()
});
const userUpdateSchema = Joi.object({
    name: Joi.string().min(1).optional().allow(""),
    roleId: Joi.string().optional(),
    adhar: Joi.string().optional().allow(""),
    pan: Joi.string().optional(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional().messages({"string.pattern.base":"Required Valid Mobile Number","any.required": "Mobile number is required"}), // basic Indian mobile validation
    email: Joi.string().email().optional().allow(""),
    address: Joi.string().optional(),
    pincode: Joi.string().length(6).pattern(/^[1-9][0-9]{5}$/).optional(), // Indian pincode
    dob: Joi.string().optional() // optionally validate as a date: Joi.date().iso().required()
});

const clientSchema = Joi.object({
    name: Joi.string().min(1).required(),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional().allow(""), // basic Indian mobile validation
    email: Joi.string().email().required().allow(""),
    address: Joi.string().required(),
    pincode: Joi.string().length(6).pattern(/^[1-9][0-9]{5}$/).required(), // Indian pincode
    gst:Joi.string().optional().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
});
const updateclientSchema = Joi.object({
    name: Joi.string().min(1).optional().allow(""),
    mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional().allow(""), // basic Indian mobile validation
    email: Joi.string().email().optional().allow(""),
    address: Joi.string().optional().allow(""),
    pincode: Joi.string().length(6).pattern(/^[1-9][0-9]{5}$/).optional(), // Indian pincode
    gst:Joi.string().optional().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).allow("")
}).required().min(1).messages({
    "object.min": "Minimum 1 Feild Required",
});
const clientSchemaFetch = Joi.object({
    name: Joi.string().min(1).optional(),
    mobile: Joi.string().optional(), // basic Indian mobile validation
    email: Joi.string().optional(),
    address: Joi.string().optional(),
    pincode: Joi.string().optional(), // Indian pincode
    gst:Joi.string().optional()
});

const attendanceSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId validation')
        .required(),
     clientId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId validation')
        .required(),
           

    date: Joi.string()
        .isoDate()
        .required()
        .messages({
            'string.isoDate': 'Date must be in ISO format (YYYY-MM-DD)',
        }),

    AttendanceType: Joi.string()
        .valid(...attendenceTypeEnum)
        .required(),

    shift: Joi.string()
        .valid(...shiftEnum)
        .required(),

    status: Joi.string()
        .valid(...attendenceStatusEnum)
        .required(),
});
const checkAttendanceDataSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId validation')
        .optional(),
     clientId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId validation')
        .optional(),
           

    date: Joi.string()
        .isoDate()
        .optional()
        .messages({
            'string.isoDate': 'Date must be in ISO format (YYYY-MM-DD)',
        }),

    AttendanceType: Joi.string()
        .valid(...attendenceTypeEnum)
        .optional(),

    shift: Joi.string()
        .valid(...shiftEnum)
        .optional(),

    status: Joi.string()
        .valid(...attendenceStatusEnum)
        .optional(),
});

const changePasswordSchema=Joi.object({
    newPassword:Joi.string().pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).required(),
    userId:Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        }, 'ObjectId validation')
        .required(),
})

function validateAttendence(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = attendanceSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}
function validateCheckAttendence(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = checkAttendanceDataSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}
function validateCheckChangePassword(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}
// Validate function
function validateUser(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}

function validateUpdateUser(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}

function validateClient(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = clientSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}

function validateUpdateClient(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = updateclientSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}
function validateClientFetch(req, res, next) {
    console.log("validateRole", req.body)
    let { error, value } = clientSchemaFetch.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    } else {
        next()
    }
}



const roleSchema = Joi.object({
    roleName: Joi.string().min(3).max(30).required(),
    permissions: Joi.object({
        client: Joi.array().items(Joi.string().valid(...resourceState)).required(),
        manager: Joi.array().items(Joi.string().valid(...resourceState)).required(),
        employee: Joi.array().items(Joi.string().valid(...resourceState)).required()
    }).required()
});

// Validate function
function validateRole(req, res, next) {
    try {

        console.log("validateRole", req.body)
        let { error, value } = roleSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        } else {
            next()
        }
    } catch (err) {
        console.log(err, "validate error")
    }
}

module.exports = {
    validateRole,
    validateUser,
    validateAttendence,
    validateClient,
    validateClientFetch,
    validateCheckAttendence,
    validateCheckChangePassword,
    validateUpdateClient,
    validateUpdateUser
}