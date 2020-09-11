const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var romanLetters = ["I", "V", "X", "L", "C", "D", "M"];

var regexp = /^((\(M\)){0,3})(\(C\)\(M\)|\(C\)\(D\)|(\(D\))?(\(C\)){0,3})(\(X\)\(C\)|\(X\)\(L\)|(\(L\))?(\(X\)){0,3})(M\(X\)|M\(V\)|(\(V\))?)(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

const AsyncReadLine = function () {
    var seviceRoman = new RomanNumbers();
    var coin = {}
    var intergalacticUnit = {}
    var rege = /([A-Z])\w+\s+(is)+\s+\d([0-9]*)/g;
    var rege2 = /([A-Z])\w+/g;
    var rege3 = /(is)+\s+([a-z])\w+/g;

    this.run = () => {
        rl.question('Input: ', (answer) => {
            const assign = answer.split(" ")

            let intergalacticUnitList1;
            let intergalacticUnitList2;
            let romanNumber;

            if(isAssignedSentence(assign)){
                setRomanNumbers(assign);
            } else if(isIntergalacticUnitSentence(assign)){
                intergalacticUnitList1 = getWordsToConvert(assign)
                romanNumber = getRomanNumber(intergalacticUnitList1[0].split(" "));
                setIntergalacticUnitValues(seviceRoman.getArabicNumber(romanNumber), intergalacticUnitList1[1].split(" "))
            } else if(isQuestion(assign)){
                intergalacticUnitList2 = getWordsToConvertQuestion(assign)
                romanNumber = getRomanNumber(intergalacticUnitList2[0].split(" "));
                let message = intergalacticUnitList2[0] + " " + (intergalacticUnitList2[1] ? intergalacticUnitList2[1] : "")
                getIntergalacticUnitValues(seviceRoman.getArabicNumber(romanNumber), intergalacticUnitList2[1] ? intergalacticUnitList2[1].split(" ") : null, message.trimRight())
            } else {
                console.log("I have no idea what you are talking about.")
            }

            console.log("coins: ", coin)
            console.log("product: ",intergalacticUnit)


            if (answer === 'exit')
                return rl.close();
            this.run();
        })
    }

    function setRomanNumbers(valueArray) {
        const value=valueArray[2]
        const word=valueArray[0]
        if(Object.keys(coin).length > 0){
            let temporalValueList = Object.values(coin)
            if(temporalValueList.includes(value)){
                return null
            }
        }
        coin = {...coin, [word]:value}
    }

    function setIntergalacticUnitValues(arabicNumber, valueArray) {
        const value=parseInt(valueArray[2])
        const word=valueArray[0]
        let newValue = 0;
        if(arabicNumber && value >= arabicNumber){
            newValue = value / arabicNumber;
            intergalacticUnit = {...intergalacticUnit, [word]:newValue}
        }
    }

    function getIntergalacticUnitValues(arabicNumber, valueArray, message) {

        let value = arabicNumber;

        if(valueArray){
            value = intergalacticUnit[valueArray] * arabicNumber
        }

        console.log("Output: " + message + " is", value)
    }

    function getRomanNumber(value) {
        let romanNumber = '';
        value.forEach(element => {
            romanNumber += coin[element]
        })
        return romanNumber;
    }

    function getWordsToConvert(value){
        let sentenceProduct = value.join(" ")
        let resultRegex = sentenceProduct.match(rege)
        return [sentenceProduct.split(resultRegex[0])[0].trim(), resultRegex[0]]
    }

    function getWordsToConvertQuestion(value){

        value.splice(value.length - 1,1)

        let index = value.indexOf("is")

        do {
            value.splice(index, 1);
            index--
        }
        while (index >= 0);

        let sentenceProduct = value.join(" ")
        let resultRegex = sentenceProduct.match(rege2)

        if(resultRegex){
            return [sentenceProduct.split(resultRegex[0])[0].trim(), resultRegex[0]]
        } else {
            return [sentenceProduct]
        }

    }

    function isAssignedSentence(value){
        return value.length === 3 && value[1] === "is" && isValidRoman(value[2]);
    }

    function isIntergalacticUnitSentence(value){
        return rege.test(value.join(" "));
    }

    function isQuestion(value){
        return value.join(" ").match(rege3) && value[value.length - 1] === '?';
    }

    function isValidRoman(value){
        return romanLetters.includes(value);
    }

};

const RomanNumbers = function () {

    this.getArabicNumber = function (roman) {

        if (!this.validateRomanNumber(roman)){
            console.log("You have entered an invalid roman number. Please try with another value");
            return false;
        }

        var reg = /(\()(\w)(\))/g;
        var simple = "";
        var values = 0;
        var array = regexp.exec(roman);

        array.splice(0, 1);
        array.splice(1, 1);
        array.splice(2, 2);
        array.splice(3, 2);
        array.splice(4, 1);

        var parser = function (item, index, a) {

            switch (index) {

                case 0:
                case 1:
                case 2:
                    simple = item.replace(reg, "$2");
                    values += getValue(simple) * 1000;
                    break;
                case 3:
                    simple = item.replace(reg, "$2");
                    values += ((simple.slice(0, 1) == "M") ? getValue(simple.slice(1, 2)) * 1000 - getValue(simple.slice(0, 1)) : getValue(simple) * 1000);
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                    values += getValue(item);
                    break;
            }
        }

        array.forEach(parser);
        return values;
    }

    this.validateRomanNumber = validateRomanNumber;
    function validateRomanNumber(value){
        return regexp.test(value);
    }

    function getValue(str) {
        var cant = str.length;
        var chars = [];
        var ret = 0;

        switch (cant) {

            case 1:
                ret = getNumberByIndex(romanLetters.indexOf(str));
                break;

            case 2:
                chars = str.split("");
                ret = ((romanLetters.indexOf(chars[0]) < romanLetters.indexOf(chars[1])) ? getNumberByIndex(romanLetters.indexOf(chars[1])) - getNumberByIndex(romanLetters.indexOf(chars[0])) : getNumberByIndex(romanLetters.indexOf(chars[0])) + getNumberByIndex(romanLetters.indexOf(chars[1])));
                break;

            case 3:
                chars = str.split("");
                ret = sumAllNumbers(getNumberByIndex(romanLetters.indexOf(chars[0])), getNumberByIndex(romanLetters.indexOf(chars[1])), getNumberByIndex(romanLetters.indexOf(chars[2])));
                break;

            case 4:
                chars = str.split("");
                ret = sumAllNumbers(getNumberByIndex(romanLetters.indexOf(chars[0])), getNumberByIndex(romanLetters.indexOf(chars[1])), getNumberByIndex(romanLetters.indexOf(chars[2])), getNumberByIndex(romanLetters.indexOf(chars[3])));
                break;

        }

        return ret;

    }

    function getNumberByIndex(index) {
        return ((index % 2 == 0) ? Math.pow(10, index / 2) : Math.pow(10, (index + 1) / 2) / 2);
    }
    this.sumAllNumbers = sumAllNumbers;
    function sumAllNumbers() {

        return Array.prototype.reduce.call(arguments, function (s, n) {
            return s + n;
        }, 0);

    }
};

asyncInputProblem = new AsyncReadLine();
asyncInputProblem.run()

module.exports = {RomanNumbers, AsyncReadLine};
