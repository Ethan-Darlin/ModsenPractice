async function fetchDataFromServers(urls) {
    try {
        const fetchPromises = urls.map(url => fetch(url));
        const responses = await Promise.all(fetchPromises);
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
