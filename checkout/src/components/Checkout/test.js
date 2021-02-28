function Cat(color, name) {
    this.color=color;
    this.name=name;
}


function myNew(constructor, ...args) {
    const obj= {}
    Object.setPrototypeOf(obj, constructor.prototype)
    return constructor.apply(obj, args) || obj
}

const cat = myNew(Cat, 'black', 'KOT')
// console.log(cat)

let arrInner = [1,2,3,4,5];

const summ = (arr) => {
    let answerArray = [];
    let total = arr.reduce(function(sum, current) {
        answerArray.push(sum)
        return sum + current;
    });
    answerArray.push(total)
    return answerArray
}
// console.log(summ([-2,-1,0,1]))

let masOne = [5,1,0,1,0,1];

const calcOneLength = (arr) => {
    let lengthNumb = 0;
    let tempNumb = 0;
    arr.map((ittem) => {
        if(ittem === 1) {
            tempNumb++;
            tempNumb > lengthNumb ? lengthNumb = tempNumb : null
        } else {
            tempNumb = 0
        }
    });
    return lengthNumb
};
// console.log(calcOneLength([,0,0,0,0,0,0,0,0,0,0,0]));

let startArr = [2,2,2,8,8,9,9,9,10,11,11,11,11,11,11,11,23,213,21312,12,3123,123,];
const showIndividualArr = (arr) => {
    let tempNumb = arr[0];
    let resultArray = [];
    arr.map((ittem, index) => {
        if(index === 0) {
            resultArray.push(tempNumb)
        } else if (ittem > tempNumb) {
            tempNumb = ittem;
            resultArray.push(tempNumb)
        }
    });
    return resultArray
};
// console.log(showIndividualArr(startArr))
let arr1 = "qiu";
let arr2 = "iuq";

const checkAnagramm = (str1, str2) => str1.split('').reverse().sort().join('') === str2.split('').reverse().sort().join('') ? 1 : 0;
console.log(checkAnagramm(arr1, arr2))

