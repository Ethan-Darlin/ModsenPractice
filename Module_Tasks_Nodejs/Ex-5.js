const http = require('http');
const https = require('https');

// Функция для выполнения HTTPS-запроса к API GitHub
function fetchGitHubData(username, callback) {
  const options = {
    hostname: 'api.github.com',
    path: `/users/${username}/repos`,
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js',
    },
  };

  const req = https.request(options, (res) => {
    let data = '';

    // Обработка поступающих данных
    res.on('data', (chunk) => {
      data += chunk;
    });

    // Обработка завершения получения данных
    res.on('end', () => {
      if (res.statusCode === 200) {
        const repos = JSON.parse(data);
        callback(null, repos);
      } else {
        callback(new Error(`Failed to fetch data. Status code: ${res.statusCode}`));
      }
    });
  });

  // Обработка ошибки запроса
  req.on('error', (err) => {
    callback(err);
  });

  req.end();
}

// Создание HTTP-сервера
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const urlParts = req.url.split('/');
    const username = urlParts[1];

    if (username) {
      fetchGitHubData(username, (err, repos) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
          console.error(err);
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          const response = {
            username: username,
            repositories: repos.map((repo) => repo.name),
          };
          res.end(JSON.stringify(response));
          console.log(response);
        }
      });
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Username is required in the URL' }));
    }
  } else {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Only GET method is supported' }));
  }
});

// Запуск сервера на порту 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});