const dogListUl = document.querySelector("#dog-list-ul")
const dogModal = document.querySelector(".modal")
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    dogModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == dogModal) {
      dogModal.style.display = "none";  
    }
}

let allDogs = async () => {
    let response = await fetch("http://localhost:3000/dogs")
    let dogs = await response.json()
    dogs.forEach((dog) => {
        //create dog function
        createDog(dog)
    })
}

allDogs()

// function postTweetQuery(){
//     fetch("https://api.twitter.com/1.1/search/tweets.json?q=weratedogs", {
//         "method": "POST",
//         "headers": {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         "body": {
//             "consumerKey": "P0dteBxCalUPFgj8CDaWL1vMY",
//             "accessTokenKey": "1192570030753488896-JISnCekhNa5ZAFtjh2ehJU9xbtdwaN",
//             "consumerSecret": "hURUMa0hOU2IOUCQGqZKiefvGObe2s6fOR58Tu3Re8kj1h5CJO",
//             "accessTokenSecret": "7Bw0OR01gFxrPMMGpj5spnwcPZhoMwdt5Iu8GvbqOfCnD"
//         }
//     })
//         .then(response => {
//             console.log(response);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }
// postTweetQuery();


function createDog(dog) {
    // create dog element
    let dogLi = document.createElement("li")

    //add event listener to dog li
    addEventListenerToDogLi(dog, dogLi)

    // create dog image
    let dogImg = document.createElement("img")
    dogImg.className = "dog-img"
    dogImg.src = dog.image_url

    // append
    dogLi.append(dogImg)
    // dogLi.append(dogRating)
    dogListUl.append(dogLi)
}


function addEventListenerToDogLi(dog, dogLi) {
    dogLi.addEventListener("click", () => {
        // get modal
        let modalContent = document.querySelector("#dog-modal")

        // clear previous content
        let child = modalContent.lastElementChild;
        while (child) {
            modalContent.removeChild(child);
            child = modalContent.lastElementChild;
        }
        // add dog img to modal
        let modalImg = document.createElement("img")
        modalImg.setAttribute("class", "modal-img")
        modalImg.src = dog.image_url

        // add rating to modal
        let modalRating = document.createElement('h3')
        modalRating.innerText = `Rating: ${dog.rating.value}/10`

        // add rate dog button to modal
        let addRating = document.createElement('h4')
        addRating.innerText = "Rate This Dog"

        //add event listener to addRating
        addEventListenerToAddRating(addRating, modalContent, modalRating, dog)

        // append content to modal 
        modalContent.append(modalImg)
        modalContent.append(modalRating)
        modalContent.append(addRating)

        dogModal.style.display = "block";
    })
}

function addEventListenerToAddRating(addRating, modalContent, modalRating, dog) {
    addRating.addEventListener("click", () => {
        let ratingInput = document.createElement("input")
        modalContent.append(ratingInput)

        let submitButton = document.createElement("button")
        submitButton.innerText = "Submit Rating"
        submitButton.addEventListener("click", () => {
            let newRating = ratingInput.value
            fetch(`http://localhost:3000/ratings/${dog.rating.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    value: newRating
                })
            })
            .then(r => r.json())
            .then(resObj => {
                dog.rating.value = resObj.value
                modalRating.innerText = `Rating: ${resObj.value}/10`
            })
        })
        modalContent.append(submitButton)
    })
}

