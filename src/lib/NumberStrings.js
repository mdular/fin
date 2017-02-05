class NumberStrings {
    numberToBinaryString(input, bits = 32, signed = true) {
        if (input.constructor.name !== 'Number') {
            throw new Error("Type error: input value must be type Number");
        }

        if (signed === true && input > 2147483647) {
            throw new Error("Out of bounds: signed input must be no higher than 2147483647")
        }

        if (input < 0) {
            // force to 32 bit uint
            input = input >>> 0;
        }

        let string = input.toString(2);
        let paddedString = ('00000000000000000000000000000000' + string).substr(-bits);

        // console.log('input:', number);
        // console.log('bits:', binaryString.length);
        // console.log('amount binary string:', binaryString);
        // console.log(`padded to ${bits} bits:`, paddedAmount);
        // console.log('hex amount', number.toString(16));

        return paddedString;
    }

    binaryStringToNumber(input, signed = true) {
        if (input.constructor.name !== 'String') {
            throw new Error("Type error: input value must be type String");
        }

        let isNegative = signed === true && input.charAt(0) === '1';

        let number = parseInt(input, 2);

        if (isNegative) {
            // bitwise not and sign
            input = -(~input + 1);
        }

        return input;
    }

    numberToHexString(input, bits = 32, signed = true) {
        if (input.constructor.name !== 'Number') {
            throw new Error("Type error: input value must be type Number");
        }

        if (signed === true && input > 2147483647) {
            throw new Error("Out of bounds: signed input must be no higher than 2147483647")
        }

        if (input < 0) {
            // force to 32 bit uint
            input = input >>> 0;
        }

        let string = input.toString(16);
        let paddedString = ('00000000' + string).substr(-bits / 4);

        return paddedString;
    }

    hexStringToNumber(input, signed = true) {
        if (input.constructor.name !== 'String') {
            throw new Error("Type error: input value must be type String");
        }

        let number = parseInt(input, 16);

        let isNegative = signed === true && number > 2147483647;

        if (isNegative) {
            // bitwise not and sign
            number = -(~number + 1);
        }

        return number;
    }
}

module.exports = new NumberStrings();
