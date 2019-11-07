//get json file
fetch('enquete.json')
.then(response => response.json())
.then(json => getColumnFromData(json));


function getColumnFromData(data) {
    const list = data 
        .map(item => item["Wat is je favoriete film?"]);
    cleanText(list); 
}


function cleanText(list) {
        const cleanedList = list
        .filter(item => item !== "" && item !== "-" && item !== "geen" && item !== "heb ik niet")
        .map(item => item
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0)
                .toUpperCase() + word.substring(1))
                .join(" "));
        console.log(cleanedList);
    }

// function cleanList(data) {

// const movieList = data 
//     .map(movie => movie["Wat is je favoriete film?"])
//     .filter(movie => movie !== "" && movie !== "-" && movie !== "geen" && movie !== "heb ik niet")
//     // following clean up could easly be done with CSS. I added this code for practicing reasons.
//     .map(movie => movie
//         .toLowerCase()
//         .split(" ")
//         .map((s) => s.charAt(0)
//             .toUpperCase() + s.substring(1))
//             .join(" "));

//     console.log(movieList);
// }