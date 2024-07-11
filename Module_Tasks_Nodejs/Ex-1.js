const http = require('http');
const { performance } = require('perf_hooks');

const urls = ['http://www.google.com', 'http://www.bing.com'];

function makeRequest(url, method) {
    return new Promise((resolve, reject) => {
        const start = performance.now();
        const req = method(url, (res) => {
            res.on('data', () => {});
            res.on('end', () => resolve(performance.now() - start));
        }).on('error', reject);
        if (req.end) req.end();
    });
}

async function runRequests(method) {
    const times = await Promise.all(urls.map((url) => makeRequest(url, method)));
    times.forEach((time, i) => console.log(`URL: ${urls[i]}, Time: ${time.toFixed(2)} ms`));
}

(async function compareRequests() {
    console.log('Running blocking requests...');
    await runRequests(http.request);
    
    console.log('\nRunning non-blocking requests...');
    await runRequests(http.get);
})();