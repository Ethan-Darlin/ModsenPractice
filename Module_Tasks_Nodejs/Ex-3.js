const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class FileWatcher extends EventEmitter {
  constructor(directory) {
    super();
    this.directory = directory;
    this.files = new Map();
    this.watch();
  }

  watch() {
    fs.readdir(this.directory, (err, initialFiles) => {
      if (err) throw err;
      initialFiles.forEach(file => {
        const filePath = path.join(this.directory, file);
        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          this.files.set(file, stats.mtimeMs);
        });
      });

      // Start watching the directory
      fs.watch(this.directory, (eventType, filename) => {
        if (filename) {
          const filePath = path.join(this.directory, filename);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              if (err.code === 'ENOENT') {
                // File has been removed
                if (this.files.has(filename)) {
                  this.files.delete(filename);
                  this.emit('deleted', filename);
                }
              }
            } else {
              const previousMtime = this.files.get(filename);
              if (previousMtime) {
                if (stats.mtimeMs !== previousMtime) {
                  // File has been changed
                  this.files.set(filename, stats.mtimeMs);
                  this.emit('changed', filename);
                }
              } else {
                // New file added
                this.files.set(filename, stats.mtimeMs);
                this.emit('added', filename);
              }
            }
          });
        }
      });
    });
  }
}

// Использование FileWatcher
const watcher = new FileWatcher('./watched_directory');

watcher.on('added', (filename) => {
  console.log(`File added: ${filename}`);
});

watcher.on('changed', (filename) => {
  console.log(`File changed: ${filename}`);
});

watcher.on('deleted', (filename) => {
  console.log(`File deleted: ${filename}`);
});