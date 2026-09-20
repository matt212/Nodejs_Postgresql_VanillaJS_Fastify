// ============================================================
// GENERIC MODULE TEST VALUE UTILITIES
// ============================================================


// ============================================================
// RANDOM ALPHABETIC VALUE
//
// string -> alphabetic characters ONLY
// No numbers
// No UUID
// No record number
// ============================================================

function generateRandomAlphabetic(maxLength) {

    const alphabet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const length =
        Math.min(
            maxLength,
            Math.floor(Math.random() * 6) + 5
        );

    let value = '';

    for (let i = 0; i < length; i++) {

        value += alphabet.charAt(
            Math.floor(
                Math.random() * alphabet.length
            )
        );
    }

    return value;
}


// ============================================================
// GENERIC TEST VALUE
//
// Driven completely by validationConfig.validationmap
// ============================================================

function generateTestValue(field) {

    const {
        fieldvalidatename,
        fieldmaxlength
    } = field;

    const maxLength =
        Number(fieldmaxlength) || 45;


    switch (
        String(fieldvalidatename).toLowerCase()
    ) {

        // ------------------------------------------------------
        // STRING
        // Alphabetic ONLY
        // ------------------------------------------------------

        case 'string':

            return generateRandomAlphabetic(
                maxLength
            );


        // ------------------------------------------------------
        // ALPHANUMERIC
        // ------------------------------------------------------

        case 'alphanumeric':

            return 'A1'.repeat(
                Math.ceil(
                    Math.min(
                        maxLength,
                        10
                    ) / 2
                )
            ).substring(
                0,
                maxLength
            );


        // ------------------------------------------------------
        // NUMBER
        // ------------------------------------------------------

        case 'number':

            return '123';


        // ------------------------------------------------------
        // INTEGER
        // ------------------------------------------------------

        case 'integer':

            return '123';


        // ------------------------------------------------------
        // DECIMAL
        // ------------------------------------------------------

        case 'decimal':

            return '123.45';


        // ------------------------------------------------------
        // DATE
        // ------------------------------------------------------

        case 'date':

            return '01-11-1990';


        // ------------------------------------------------------
        // BOOLEAN
        // ------------------------------------------------------

        case 'boolean':

            return true;


        // ------------------------------------------------------
        // UNSUPPORTED
        // ------------------------------------------------------

        default:

            throw new Error(
                `Unsupported field validation type: ${fieldvalidatename}`
            );
    }
}


// ============================================================
// DATE DISPLAY FORMAT
//
// Converts:
// 01-11-1990
//
// Into:
// 01 Nov 1990
//
// Used when comparing form values with table values.
// ============================================================

function formatExpectedTableValue(
    field,
    value
) {

    if (
        field.fieldtypename === 'DATE' &&
        value
    ) {

        const [
            day,
            month,
            year
        ] = String(value).split('-');


        return new Date(
            year,
            month - 1,
            day
        ).toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    }


    return value;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    generateRandomAlphabetic,

    generateTestValue,

    formatExpectedTableValue

};