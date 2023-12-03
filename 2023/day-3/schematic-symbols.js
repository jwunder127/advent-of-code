#!/usr/bin/env node

const fs = require("fs");

/*
PROMPT: https://adventofcode.com/2023/day/3

PART I: Given a matrix, find the sum of all numbers that are adjacent to a symbol. 
"Adjacent" includes lines above and below. Numbers that are diagonally "touching"
a symbol are valid. A period (".") is not a valid symbol


THOUGHT PROCESS:
You cannot consider a line until you look at the line before and after it

to get all symbols: /[^\w.]/
to find numbers: /\d+/g

APPROACH:
- Iterate through lines.
- Given a line, find all the numbers in that line, in particular their start/end indexes. 
- Find the indexes all symbols in the line AND the symbols in the next and previous lines (if applicable)
- Determine the start and end indexes of each line.
- a number is valid if there is a symbol located in the previous, current, or next line where the index is greater than or
equal to the starting index of a number minus 1 AND less than or equal to the ending index of that number plus 1.

EXAMPLE:
617*......
.....+.58.
..592.....

617 is valid,  58 is not, 592 is valid.


PART II: Find the * symbols. If there are TWO numbers touching that symbol, multiply them together
Then return the sum of those products
*/


fs.readFile('schematic-symbols.txt', "utf8", (err, data) => {
    if (err) {
        console.log("err", err);
        throw err;
    }

    const lines = data.split("\n");
    let output = 0;
    let previousLine = '';
    let currentLine = '';
    let nextLine = '';

    for (let i = 0; i < lines.length; i++) {
        let lineSum = 0;
        currentLine = lines[i];
        nextLine = i < lines.length - 1 ? lines[i+1] : '';

        // get the indexes of the symbols in the previous, current, and next lines. Only save the indexes
        const previousSymbolIndexes = previousLine.split("").map((x, i) => x.match( /[^\w.]/) ? i : null).filter(y => y !== null);
        const currentSymbolIndexes = currentLine.split("").map((x, i) => x.match( /[^\w.]/) ? i : null).filter(y => y !== null);
        const nextLineIndexes = nextLine?.split("").map((x, i) => x.match( /[^\w.]/) ? i : null).filter(y => y !== null);    

        // combine them for easy comparison
        const allSymbolIndexes = [...previousSymbolIndexes, ...currentSymbolIndexes, ...nextLineIndexes];

        // all the numbers in the current line
        const numbersInLine = currentLine.match(/\d+/g) || [];

        // use a substring of the line to avoid issues with duplicate numbers in the same line.
        let lineSubstring = currentLine;
        numbersInLine.forEach(n => {
            // get the location of the first and last indexes of a particular number
            const firstIndex = lineSubstring.indexOf(n);
            const lastIndex = firstIndex + n.length;
            // determine if valid by determining if there's a symbol that touches the positions around the number
            const isMatch = allSymbolIndexes.find(x => {
                return x >= firstIndex - 1 && x <= lastIndex;
            })
            if (isMatch) {
                lineSum += parseInt(n);
            } 
            // blank out the number to avoid counting it again.
            lineSubstring = lineSubstring.split('').fill('.', firstIndex, lastIndex).join('');
        });
    
        previousLine = currentLine;
        output += lineSum;
    }
    console.log('PART I', output);
})

fs.readFile('schematic-symbols.txt', "utf8", (err, data) => {
    if (err) {
        console.log("err", err);
        throw err;
    }

    const lines = data.split("\n");
    let gearDictionary = {};
    let previousLine = '';
    let currentLine = '';
    let nextLine = '';

    let previousLineIdx, currentLineIdx, nextLineIdx;

    for (let i = 0; i < lines.length; i++) {
        currentLine = lines[i];
        nextLine = i < lines.length - 1 ? lines[i+1] : '';
    
        previousLineIdx = i-1;
        currentLineIdx = i;
        nextLineIdx = i + 1;

        const previousPotentialGears = previousLine.split("").map((x, i) => x.match( /[*]/) ? i : null).filter(y => y !== null);
        const currentPotentialGears = currentLine.split("").map((x, i) => x.match( /[*]/) ? i : null).filter(y => y !== null);
        const nextPotentialGears = nextLine?.split("").map((x, i) => x.match( /[*]/) ? i : null).filter(y => y !== null); 

        const numbersInLine = currentLine.match(/\d+/g) || [];

        let lineSubstring = currentLine;
        numbersInLine.forEach(n => {
        // get the location of the first and last indexes of a particular number
            const firstIndex = lineSubstring.indexOf(n);
            const lastIndex = firstIndex + n.length;

            // determine if a * is touching that number
        
            const prevMatch = previousPotentialGears.find(x => {
                return x >= firstIndex - 1 && x <= lastIndex;
            });

            const currMatch =currentPotentialGears.find(x => {
                return x >= firstIndex - 1 && x <= lastIndex;
            });

            const nextMatch = nextPotentialGears.find(x => {
                return x >= firstIndex - 1 && x <= lastIndex;
            });

            // keep track of which * are touching numbers (probably a more elegant solution)
            if (prevMatch) {
                gearDictionary[`line${previousLineIdx}i${prevMatch}`] ? gearDictionary[`line${previousLineIdx}i${prevMatch}`].push(parseInt(n)) : gearDictionary[`line${previousLineIdx}i${prevMatch}`] = [parseInt(n)];
            }

            if (currMatch) {
                gearDictionary[`line${currentLineIdx}i${currMatch}`] ? gearDictionary[`line${currentLineIdx}i${currMatch}`].push(parseInt(n)) : gearDictionary[`line${currentLineIdx}i${currMatch}`] = [parseInt(n)];
            }

            if (nextMatch) {
                gearDictionary[`line${nextLineIdx}i${nextMatch}`] ? gearDictionary[`line${nextLineIdx}i${nextMatch}`].push(parseInt(n)) : gearDictionary[`line${nextLineIdx}i${nextMatch}`] = [parseInt(n)];
            }
            lineSubstring = lineSubstring.split('').fill('.', firstIndex, lastIndex).join('');
        })
        previousLine = currentLine;
    }   

    let output = 0
    
    Object.keys(gearDictionary).forEach(key => {
        let sumProduct = 0;
        // if a gear is touching exactly two numbers, add the product of those two numbers to the output
        if (gearDictionary[key].length === 2) {
            sumProduct += gearDictionary[key].reduce((acc, cur) => acc * cur, 1);
        }

        output += sumProduct;
    })
    console.log('PART II', output);
});