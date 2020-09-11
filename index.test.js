const {RomanNumbers, AsyncReadLine} = require('./index')

test('call function run', () => {

    const asyncReadLine = new AsyncReadLine();

    const spy = jest.spyOn(asyncReadLine, 'run');
    asyncReadLine.run();

    expect(spy).toHaveBeenCalled();

});

test('get arabic numbers for roman number', () => {

    const romanNumber = new RomanNumbers();

    expect(romanNumber.getArabicNumber("XLII")).toBe(42);

});


test('get arabic numbers for roman number', () => {

    const romanNumber = new RomanNumbers();

    expect(romanNumber.getArabicNumber("XLII")).toBe(42);

});

test('validate roman number', () => {

    const romanNumber = new RomanNumbers();

    expect(romanNumber.validateRomanNumber("XLII")).toBe(true);

});


test('suma all numbers', () => {

    const romanNumber = new RomanNumbers();

    expect(romanNumber.sumAllNumbers(0, 1)).toBe(1);
    expect(romanNumber.sumAllNumbers(5, 23, 0, 0 ,0 ,0)).toBe(28);


});
