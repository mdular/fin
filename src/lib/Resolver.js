class Resolver {
    constructor (config) {
        this.fields = {};
        this.fieldDefaults = {
            required: false
        }
    }

    addFields (fields) {
        for (let fieldName in fields) {
            let field = fields[fieldName];

            this.fields[fieldName] = Object.assign({}, this.fieldDefaults, field);
        }
    }

    /**
    * value can be result of function or data field name
    */
    resolveField (fieldName, data) {
        let field = this.fields[fieldName];

        if (typeof field === 'undefined') {
            return undefined;
        }

        if (typeof field.value === 'function') {
            return field.value(data);
        }

        return data[field.value];
    }

    validateField (fieldName, value) {
        let field = this.fields[fieldName];

        if (typeof field === 'undefined') {
            return true;
        }

        if (typeof field.validate === 'function') {
            return field.validate(value);
        }

        return true;
    }

    generateReference (idx, data) {
        return idx;
    }
}

module.exports = Resolver;
