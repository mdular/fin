class DateStrings {
    dateToHexString(input) {
        if (input.constructor.name !== 'Date') {
            throw new Error("Type error: input must be type Date");
        }

        let string = (input.getTime()).toString(16);

        let paddedString = ('0' + string).substr(-11);

        return paddedString;
    }

    hexStringToDate(input) {
        if (input.constructor.name !== 'String') {
            throw new Error("Type error: input must be type String");
        }

        let number = parseInt(input, 16);

        let date = new Date(number);

        return date;
    }
}

module.exports = new DateStrings();
