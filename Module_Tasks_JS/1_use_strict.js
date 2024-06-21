"use strict";

function countVowels(str) {
    const letters = ['a', 'e', 'i', 'o', 'u'];
    let count = 0;

    for (let i = 0; i < str.length; i++) {
        if (letters.includes(str[i].toLowerCase())) {
            count++;
        }
    }
    return count;
}

console.log(countVowels("Hello World.aehh")); // 5
