async function fetchDataFromServers(urls) {
    try {
        const fetchPromis = urls.map(url => fetch(url));
        const responses = await Promise.all(fetchPromis);
        const data = await Promise.all(responses.map(response => response.json()));
        return data;
    } catch (error) {
        console.error(`Ошибка при загрузке данных: ${error}`);
        return [];
    }
}

const serverUrls = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://dog.ceo/api/breeds/image/random'
];

fetchDataFromServers(serverUrls).then(data => {
    console.log(data); 
}).catch(error => {
    console.error(error);
});
