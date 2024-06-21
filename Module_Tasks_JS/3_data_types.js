function sum(num) {
    const numString = String(Math.abs(num));
    const first = parseInt(numString[0]);
    const last = parseInt(numString[numString.length - 1]);

    console.log(first + last);
}

sum(12345); // 6
