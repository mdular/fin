class Parser {
    constructor (config, schema, fields, resolver) {
        this.FIELD_DELIMITER = config.FIELD_DELIMITER || /;/;
        this.LINE_DELMITER = config.LINE_DELMITER || /\n/;
        this.SANITIZE_REGEX = config.SANITIZE_REGEX || /"/g;
        this.NO_HEADER = config.NO_HEADER || false;

        this.fields = fields;
        this.schema = schema || [];
        this.resolver = resolver;

        for (let fieldName in this.fields) {
            this.validateFieldProperties(fieldName, this.fields[fieldName]);
        }
    }

    validateFieldProperties (fieldName, field) {
        if (typeof field['type'] === 'undefined') {
            throw new Error(`type must be set on field '${fieldName}'`);
        }
    }

    parse (buffer) {
        let rows = buffer.toString();
        rows = rows.split(this.LINE_DELMITER);

        if (this.NO_HEADER === true) {
            // TODO: implement
            throw new Error('CSV without header / custom schema not supported yet.');
        }

        this.schema = this.parseSchema(rows.shift());

        let parsed = this.parseRows(rows);
        return parsed;
    }

    parseRows (data) {
        let parsed = [];

        for (let i in data) {
            let row = data[i];
            row = row.replace(this.SANITIZE_REGEX, '');
            row = this.parseDataRow(row);

            if (!row) {
                continue;
            }

            let mapped = this.processRow(i, row);

            parsed.push(mapped);
        }

        return parsed;
    }

    processRow (idx, row) {
        let processedFields = this.processFields(row);

        let processed = {
            id: this.resolver.generateReference(idx, processedFields),
            body: Object.assign(processedFields, {_data: row})
        };

        return processed;
    }

    processFields (row) {
        let processed = {};

        for (let fieldName in this.fields) {
            let field = this.fields[fieldName];
            let processedField;

            // resolve field or don't set
            if (this.resolver) {
                let resolved = this.resolver.resolveField(fieldName, row);
                if (resolved) {
                    processedField = resolved;
                }
            }

            if (field.default && typeof processedField === 'undefined') {
                processedField = field.default;
            }

            // validate required: if required = true field must be defined
            if (field.required) {
                if (typeof processedField === 'undefined') {
                    throw new Error(`Parser error: required field is undefined ${fieldName}`);
                }
            }

            // validate type: if field type is declared, only set valid type
            if (typeof processedField !== 'undefined' && typeof field.type !== 'undefined' && !this.validateType(field.type, processedField)) {
                console.log(`Parser warning:  ${fieldName}:${processedField}  is not of type  ${field.type}  and was not set`);
                continue;
            }

            // validate field: custom validation function on resolver
            if (this.resolver && !this.resolver.validateField(fieldName, processedField)) {
                console.log(`Validation failed on ${fieldName}, value:${processedField}`)
                continue;
            }

            processed[fieldName] = processedField;
        }

        return processed;
    }

    /**
    * validate the following types:
    * number - JavaScript number, can be int or float
    * string - JavaScript string
    * date - valid Date string and passing isFinite test
    */
    validateType (type, value) {
        if (typeof value === 'undefined') {
            return false;
        }

        // validate date type
        if (type === 'date') {
            let date = new Date(value);

            if (date instanceof Date || isFinite(date)) {
                return true;
            }

            console.log(`Type warning: not a valid date: ${value} => ${date}`);
            return false;
        }

        // validate type
        if (typeof value === type) {
            return true;
        }

        console.log(`Type warning: ${value} not of type ${type}`);
        return false;
    }

    parseDataRow (row) {
        let parsedRow = {};
        let counter = 0;
        row = row.split(this.FIELD_DELIMITER);

        for (let idx in row) {
            let value = row[idx];
            let field = this.schema[idx] || 'col' + idx.toString(10);
            if (value.length) {
                parsedRow[field] = value;
                counter++;
            }
        }

        if (counter === 0) {
            return false;
        }

        return parsedRow;
    }

    parseSchema (row) {
        row = row.replace(this.SANITIZE_REGEX, '');
        return row.split(this.FIELD_DELIMITER);
    }
}

module.exports = Parser;
