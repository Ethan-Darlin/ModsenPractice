async function fetchData(apiUrls) {
    try {
        const promises = apiUrls.map(url => fetch(url)
          .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
        );
        const results = await Promise.all(promises);
        const dataArrays = results.map(result => Object.values(result));
        return [].concat(...dataArrays);
    } catch (error) {
        console.error(`Ошибка при получении данных: ${error.message}`);
        return [];
    }
}

const apiUrls = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://dog.ceo/api/breeds/image/random'
];

fetchData(apiUrls).then(data => {
    console.log(data);
}).catch(error => {
    console.error(error);
});
