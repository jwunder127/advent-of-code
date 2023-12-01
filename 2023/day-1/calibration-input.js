#!/usr/bin/env node

const fs = require('fs')

fs.readFile('./calibration-input.txt', 'utf8', (err, data) => {
    
    const stringArr = data.split('\n');
    let output = 0;
    stringArr.forEach(line => {
        const splitChars = line.split('');
        const firstNumber = splitChars.find(x => x.match(/[0-9]/));
        const reversed = splitChars.reverse();
        const lastNumber = reversed.find(x => x.match(/[0-9]/));
        const combined = parseInt(`${firstNumber}${lastNumber}`)
    
        output += combined
    })

    console.log('PART I:', output);
})

const dictionary = {
    1: 1,
    2: 2,
    3: 3,
    4:4,
    5:5,
    6:6,
    7:7,
    8:8,
    9:9, 
    one: 1,
    two: 2,
    three: 3,
    four: 4, 
    five: 5, 
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
}

const digitStrings = Object.keys(dictionary);


fs.readFile('./calibration-input.txt', 'utf8', (err, data) => {
    const stringArr = data.split('\n');
    let output = 0;
    
    stringArr.forEach(line => {

        let firstNumber;
        let firstNumberIndex;
        let lastNumber;
        let lastNumberIndex;
        digitStrings.forEach(str => {
            const maybeMatch = line.match(str)
            if (maybeMatch) {
                if ((isNaN(firstNumberIndex)) || maybeMatch.index < firstNumberIndex) {
                    firstNumber = dictionary[str];
                    firstNumberIndex = maybeMatch.index;
                }
                if ((isNaN(lastNumberIndex)) || line.lastIndexOf(str) > lastNumberIndex) {
                    lastNumber = dictionary[str];
                    lastNumberIndex = line.lastIndexOf(str);
                }
            }
        })
        if (isNaN(firstNumber) || isNaN(lastNumber)) {
            console.log('trouble')
        }
        const combined = parseInt(`${firstNumber}${lastNumber}`)
        output += combined;

    })

    console.log('PART II:', output);
})