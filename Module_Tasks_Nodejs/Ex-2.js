const fs = require('fs');
const path = require('path');
const sourceDir = './source';
const destDir = './destination';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const moveFiles = (source, destination) => {
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении директории:', err);
      return;
    }

    files.forEach(file => {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      fs.rename(sourcePath, destPath, err => {
        if (err) {
          console.error(`Ошибка при перемещении файла ${file}:`, err);
        } else {
          console.log(`Файл ${file} успешно перемещен в ${destPath}`);
        }
      });
    });
  });
};

// Перемещение файлов из sourceDir в destDir
moveFiles(sourceDir, destDir);