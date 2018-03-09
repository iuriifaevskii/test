const codeStringFirst = "Code 'GENIECODE0' is applied to your cart, Total price is: 90$";
const codeStringSecond = "Code 'GENIECODE1' is applied to your cart, Total price is: 80$";
const codeStringThird = "Code 'GENIECODE2' is applied to your cart, Total price is: 70$";
const totalPrice = "Total price is: 150.12$";

const arrayStrings = [
    codeStringFirst, 
    codeStringSecond, 
    codeStringThird
];

function getCodeName(arr) {
    const regexp = /'(.*?)'/
    if(regexp.test(arr)) {
        return arr.match(regexp)[1];
    } else {
        return null;
    };
};

function getTotalPrice(arr) {
    const regexp = /\d+(\.\d+)?/g;
    const codePrice = arr.match(regexp);
    if (regexp.test(arr)) {
        if (Array.isArray(codePrice)) {
            return +codePrice[codePrice.length - 1]
        } else {
            return +codeString.match(regexp);
        }
    } else {
        return null;
    };
};

function getBestCode(arr, total) {
    const codes = getAllCodePrices(arr, total);
    const discountCodes = arr.map(item => {
        return getTotalPrice(total) - getTotalPrice(item);
    });

    const maxDiscount = Math.max(...discountCodes);
    for (var key in codes) {
        if (codes.hasOwnProperty(key) && codes[key] === maxDiscount) {
            return {
                bestCode: key,
                bestCodeDiscount: codes[key]
            }
        }
    }
};
function getAllCodePrices(arr, total) {
    const allCodePrices = arr.map(item => {
        const nameCode = getCodeName(item)
        const discount = getTotalPrice(total) - getTotalPrice(item);
        const codeObject = {
            [nameCode]: +discount.toFixed(2)
        };

        return codeObject;
    });

    return Object.assign(...allCodePrices);
}

function getResult(arr, total) {
    const objectCodes = getAllCodePrices(arr, total);
    const bestCode = getBestCode(arr, total);
    const originalPrice = getTotalPrice(total);
    
    return resultObject = [
        objectCodes,
        bestCode, {
        originalPrice
    }];
}

console.log(getResult(arrayStrings, totalPrice));