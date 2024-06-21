async function fetchAPI(apiUrls) {
    try {
        const promises = apiUrls.map(url => fetch(url).then(response => response.json()));
        const results = await Promise.all(promises);
        return [].concat(...results);
    } catch (error) {
        console.error(`Ошибка при получении данных: ${error}`);
        return [];
    }
}

// рандомные api
const apiUrls = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://dog.ceo/api/breeds/image/random'
];

fetcAPI(apiUrls).then(data => {
    console.log(data); 
}).catch(error => {
    console.error(error);
});
