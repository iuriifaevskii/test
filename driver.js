const codeStringFirst = "Code 'GENIECODE0' is applied to your cart, Total price is: 90$";
const codeStringSecond = "Code 'GENIECODE1' is applied to your cart, Total price is: 80$";
const codeStringThird = "Code 'GENIECODE2' is applied to your cart, Total price is: 70$";
const totalPrice = "Total price is: 150$";

const arrayCodesString = [
    codeStringFirst, 
    codeStringSecond, 
    codeStringThird
];

function getCodeName(codeString) {
    const regexp = /'(.*?)'/
    if(regexp.test(codeString)) {
        return codeString.match(regexp)[1];
    } else {
        return null;
    };
};

function getTotalPrice(codeString) {
    const regexp = /\d+/g;
    const codePrice = codeString.match(regexp);
    if (regexp.test(codeString)) {
        if (Array.isArray(codePrice)) {
            return parseInt(codePrice[codePrice.length - 1])
        } else {
            return parseInt(codeString.match(regexp));
        }
    } else {
        return null;
    };
};

function getBestCode() {
    const maxDiscount = Math.max(...discountArrayCodes);
    for (var key in objectCodes) {
        if (objectCodes.hasOwnProperty(key) && objectCodes[key] === maxDiscount) {
            return {
                bestCode: key,
                bestCodeDiscount: objectCodes[key]
            }
        }
    }
};

const discountArrayCodes = arrayCodesString.map(item => {
    return getTotalPrice(totalPrice) - getTotalPrice(item);
});

const allCodePrices = arrayCodesString.map(item => {
    const nameCode = getCodeName(item)
    const discount = getTotalPrice(totalPrice) - getTotalPrice(item);
    const codeObject = {
        [nameCode]: discount
    };
    return codeObject;
});

const objectCodes = Object.assign(...allCodePrices)
const bestCode = getBestCode();
const originalPrice = getTotalPrice(totalPrice);

const resultObject = [
    objectCodes,
    bestCode, {
    originalPrice
}];

console.log(resultObject);