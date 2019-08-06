import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

const path = require("path");
const fs = require('fs');

const getNewId = (array): number => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1
    } else {
        return 1
    }
};

const newDate = (): Date => new Date()/*.toString()*/;

const writeJSONFile = (filename, data) => {
    try {
        fs.writeFileSync(path.resolve(__dirname, filename), JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
};

const hashPassword = (password: string): string => {
    const salt = genSaltSync(12);
    return hashSync(password, salt);
};

const verifyPassword = (passwordAttempted, hashedPassword): boolean => {
    return compareSync(passwordAttempted, hashedPassword);
};

const scientificToDecimal = n => {

    const n$ = n.toString();

    if (~n$.indexOf('e') || ~n$.indexOf('E')) {

        const [lead, decimal, pow] = n$.split(/[eE]|\./);

        return +pow <= 0
            ? "0." + "0".repeat(Math.abs(pow) - 1) + lead + decimal
            : lead + (

            +pow >= decimal.length
                ? ( decimal + "0".repeat(+pow - decimal.length) )
                : ( decimal.slice(0, +pow) + "." + decimal.slice(+pow) )
        )
    }

    return n;

};

const noSpaceString = value => {
    return typeof value === 'string' && !~value.indexOf(' ');
};


const isFloatNumber = value => {
    const float = /^([0-9]*[.])?[0-9]+$/;
    return float.test(scientificToDecimal(value));
};

const isIntegerNumber = value => Math.floor(value) === value;

export {
    getNewId,
    newDate,
    writeJSONFile,
    hashPassword,
    verifyPassword,
    scientificToDecimal,
    noSpaceString,
    isFloatNumber,
    isIntegerNumber
};
