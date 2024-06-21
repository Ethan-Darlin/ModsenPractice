function findFirstUniqueChar(s) {
    const Count = {};

    for (let char of s) {
        if (Count[char]) {
            Count[char]++;
        } else {
            Count[char] = 1;
        }
    }

    for (let char of s) {
        if (Count[char] === 1) {
            return char;
        }
    }
    return null;
}

console.log(findFirstUniqueChar('aabbc')); // c
