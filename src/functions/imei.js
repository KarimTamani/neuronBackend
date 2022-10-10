
// javascript program to check whether the
// given EMEI number is valid or not.

// Function for finding and returning
// sum of digits of a number
function sumDig(n) {
    let a = 0;
    while (n > 0) {
        a = a + n % 10;
        n = parseInt(n / 10, 10);
    }
    return a;
}

export function isValidIMEI(s) {

    // Converting the number into
    // String for finding length
    let n = parseInt(s) ; 
    let len = s.length;

    if (len != 15)
        return false;

    let sum = 0;
    for (let i = len; i >= 1; i--) {
        let d = (n % 10);

        // Doubling every alternate digit
        if (i % 2 == 0)
            d = 2 * d;

        // Finding sum of the digits
        sum += sumDig(d);
        n = parseInt(n / 10, 10);
    }

    return (sum % 10 == 0);
}

