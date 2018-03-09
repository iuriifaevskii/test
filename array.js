/**
 * Array Manipulation
 * 
 * Add N string elements to the array.
 * Combine 2 arrays so result array contains all elements from both initial arrays
 * Sort array form task #2
 * Remove duplicates form result array from task #2
 * Filter only elements that contain 5+ chars
 * Create new array from result in task #2 that will contain element from initial with added ' CODE' to each one
*/

const existArr1 = [44444, 444];
const existArr2 = [444, 333, 333, 99, 1, 10000, 2, 5, 'qqqqqww', 'testtest', 88888888];

function addNElements(arr, ...strings) {
    arr.push(...strings);
    return arr;
}

function combineTwoArrays(arr1, arr2) {
    const arr3 = [];
    arr3.push(...arr1, ...arr2)
    return arr3;
}

function sortArray(arr) {
    const newArr = arr.slice();
    return newArr.sort((a, b) => a - b);
}

function removeDublicate(arr) {
    const newArr = arr.slice();
    const uniqueArray = []
    for(let i = 0;i < newArr.length; i++){
        if(uniqueArray.indexOf(newArr[i]) == -1){
            uniqueArray.push(newArr[i])
        }
    }
    return uniqueArray;
}

function moreThen5Chars(arr) {
    const newArr = arr.slice();
    return newArr.filter(item => item.length > 5);
}

function addToEachElement(arr, word) {
    const newArr = arr.slice();
    return newArr.map(item => `${word}${item}`);
}

const newArray1 = addNElements(existArr1, 12,415,52);
const newArray2 = combineTwoArrays(existArr1, existArr2);
const newArray3 = sortArray(newArray2);
const newArray4 = removeDublicate(newArray3);
const newArray5 = moreThen5Chars(newArray4);
const newArray6 = addToEachElement(newArray2, 'CODE');


console.log(newArray1)
console.log(newArray2);
console.log(newArray3);
console.log(newArray4);
console.log(newArray5);
console.log(newArray6);