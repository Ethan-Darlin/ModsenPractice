const { Transform, pipeline } = require('stream');
const fs = require('fs');

// Создание трансформирующего потока
class UpperCaseTransform extends Transform {
  constructor() {
    super();
  }

  _transform(chunk, encoding, callback) {
    // Преобразование данных в верхний регистр
    const upperCaseChunk = chunk.toString().toUpperCase();
    this.push(upperCaseChunk);
    callback();
  }
}

// Создание потоков чтения, трансформации и записи
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');
const upperCaseTransform = new UpperCaseTransform();

// Использование pipeline для соединения потоков
pipeline(
  readStream,
  upperCaseTransform,
  writeStream,
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);