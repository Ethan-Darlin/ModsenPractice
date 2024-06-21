class DivisionByZeroError extends Error {
    constructor(message = "Ошибка: деление на ноль! Так нельзя! ") {
        super(message); 
        this.name = "DivisionByZeroErr"; 
    }
}

function divideNumbers(num1, num2) {
    if (num2 === 0) {
        throw new DivisionByZeroError();
    }
    return num1 / num2;
}

try {
    console.log(divideNumbers(10, 0)); // Err
} catch (error) {
    if (error instanceof DivisionByZeroError) {
        console.error(error.message); 
    } else {
        console.error(error); 
    }
}
