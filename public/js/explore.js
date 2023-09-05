// const URL = 'https://picsum.photos/v2/list';
const URL = 'https://picsum.photos/v2/list?page=2&limit=16';

const btn = document.querySelector('.btn');
const container = document.querySelector('.container');

function getData() {
    return new Promise((resolve, reject) => {
        fetch(URL)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                let data1=data.map(d => {
                    return d.download_url;
                })
                resolve(data1);
            })
            .catch((err) => reject(err))
    })
}

function showImages(data) {
    data.forEach((d) => {
        let img = document.createElement('img');
        img.classList.add("images");
        img.src = d;
        console.log(d);
        container.appendChild(img);
    })
}

function solve() {
    getData(URL)
        .then((data) => {
            console.log(data);
            showImages(data);
        })
        .catch((err) => {
            console.log(err);            
        })
}

// solve();

btn.addEventListener('click', () => {
    console.log("btn clicked");
    solve();
})










// let URL = 'https://cat-fact.herokuapp.com/facts'
// const URL = 'http://shibe.online/api/shibes?count=5&urls=true&httpsUrls=true';
// // const factsList = document.querySelector('.factsList');
// const btn = document.querySelector('.btn');

// function getData(URL) {
//     return new Promise((resolve, reject) => {
//         fetch(URL)
//             .then((res) => {
//                 return res.json();
//             })
//             .then((data) => {
//                 resolve(data);
//             })
//             .catch((err) => reject(err));
//     })
// }

// function addDataToList(data) {
//     data.forEach((d) => {
//         let li = document.createElement('li');
//         li.innerText = d.text;
//         factsList.appendChild(li);
//     })
// }

// function solve() {
//     getData(URL)
//         .then((data) => {
//             console.log(data);
//             // addDataToList(data);
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }

// btn.addEventListener('click', () => {
//     solve();
// })






// // const url = 'https://movies-tv-shows-database.p.rapidapi.com/?movieid=tt1375666';
// const url = 'http://shibe.online/api/shibes?count=[5]&urls=[true]&httpsUrls=[true]';
// // const options = {
// // 	method: 'GET',
// // 	headers: {
// // 		Type: 'get-movie-details',
// // 		'X-RapidAPI-Key': 'bd3a127c37msh75bccb5fdc07c9cp1e4275jsnfbfaf2c55ed3',
// // 		'X-RapidAPI-Host': 'movies-tv-shows-database.p.rapidapi.com'
// // 	}
// // };


// async function getdata(url) {
//     try {
//         const res = await fetch(url);
//         console.log("mai chala");
//         console.log(res);
//         // const result = await res.text();
//         // console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
// }
