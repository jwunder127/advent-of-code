#!/usr/bin/env node

const fs = require("fs");

/*
https://adventofcode.com/2023/day/2
PROMPT 

I. Given a game of "gems" in which an elf pulls several handfuls of gems from a bag, 
determine if a game is possible if there are a maximum of 12 red, 13 green, and 14 blue
gems in the bag. Then, return the sum of the "possible" games

II. Using the same data from part I, calculate the minimum number of each color gems each game would
require to be valid. Then, multiple those terms together. Finally add up the products of all these powers
*/

const bluePattern = /((\d{2}|\d{1})\sblue)/
const greenPattern = /((\d{2}|\d{1})\sgreen)/
const redPattern = /((\d{2}|\d{1})\sred)/

const BLUE_MAX = 14;
const GREEN_MAX = 13;
const RED_MAX = 12;

function calculateGameScore(game, id) {
    // return 1 if valid
    // return 0 if invalid

    const terms = game.split(/[:;,]/);
    for (let i = 0; i < terms.length; i++) {
        let valid = true;
        if (terms[i].match(bluePattern)) {
            valid = parseInt(terms[i].match(bluePattern)[0].split(' ')[0]) <= BLUE_MAX
        } else if (terms[i].match(greenPattern)) {
            valid = parseInt(terms[i].match(greenPattern)[0].split(' ')[0]) <= GREEN_MAX
        } else if (terms[i].match(redPattern)) {
            valid = parseInt(terms[i].match(redPattern)[0].split(' ')[0]) <= RED_MAX
        }
        if (!valid) {
            return 0;
        }
    }
    return 1 + id;
}

function calculatePowerSet(game) {
    const terms = game.split(/[:;,]/);
    let minBlue = 0
    let minGreen = 0
    let minRed = 0;
    for (let i = 0; i < terms.length; i++) {
        if (terms[i].match(bluePattern)) {
            const newValue = parseInt(terms[i].match(bluePattern)[0].split(' ')[0]);
            minBlue = newValue > minBlue ? newValue : minBlue;
        } else if (terms[i].match(greenPattern)) {
            const newValue = parseInt(terms[i].match(greenPattern)[0].split(' ')[0]);
            minGreen = newValue > minGreen ? newValue : minGreen;
        } else if (terms[i].match(redPattern)) {
            const newValue = parseInt(terms[i].match(redPattern)[0].split(' ')[0]);
            minRed = newValue > minRed ? newValue : minRed;
        }
    }
    return minBlue * minGreen * minRed;
}

fs.readFile('gem-game.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    }
    const lines = data.split('\n');
    let output = 0;
    lines.forEach((line, i) => {
        output += calculateGameScore(line, i);
    })  
    console.log('PART I:', output);
})


fs.readFile('gem-game.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    }
    const lines = data.split('\n');
    let output = 0;
    lines.forEach((line, i) => {
        output += calculatePowerSet(line);
    })  
    console.log('PART II:', output);
})