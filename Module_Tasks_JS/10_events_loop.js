function genDelay() {
    return new Promise((resolve, reject) => {
        const randNum = Math.floor(Math.random() * 10) + 1;
        setTimeout(() => {
            if (randNum <= 5) {
                resolve(randNum);
            } else {
                reject(new Error(`Ошибка: сгенерировано число ${randNum}`));
            }
        }, randNum * 1000);
    });
}

genDelay()
   .then(number => console.log(`Успех: ${number}`))
   .catch(error => console.error(error.message));
