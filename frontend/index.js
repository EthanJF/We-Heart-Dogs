const dogListDiv = document.querySelector("#dog-list")
const dogModal = document.querySelector(".modal")
const span = document.getElementsByClassName("close")[0];

span.onclick = function () {
    dogModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == dogModal) {
        dogModal.style.display = "none";
    }
}

let clearDogs = () => {
    let child = dogListDiv.lastElementChild;
    while (child) {
        dogListDiv.removeChild(child);
        child = dogListDiv.lastElementChild;
    }
}

let allDogs = async () => {
    clearDogs()
    let response = await fetch("http://localhost:3000/dogs")
    let dogs = await response.json()
    dogs.forEach((dog) => {
        //create dog function
        createDog(dog)
    })
}

allDogs()


let createDog = dog => {
    // create dog image
    let dogImg = document.createElement("img")
    dogImg.className = "dog-img"
    dogImg.src = dog.image_url

    addEventListenerToDogImg(dog, dogImg)

    // append
    dogListDiv.append(dogImg)

}

let addEventListenerToDogImg = (dog, dogImg) => {
    dogImg.addEventListener("click", () => {
        showDog(dog)
    })
}

let showDog = (dog) => {
    // get modal
    let modalContent = document.querySelector("#dog-modal")
    let dogLikes = dog.likes.length

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

    // add like button
    let likeButton = document.createElement("button")
    likeButton.setAttribute("id",'like-button') 
    likeButton.setAttribute("class",'like-button')
    likeButton.innerText = "Like Me!"
    likeButton.addEventListener("click", () => {
        newLike(dog)
        dogLikes += 1
        modalLikes.innerText = `Likes: ${dogLikes}`
    })
    let modalLikes = document.createElement("h3")
    modalLikes.setAttribute("class", "modal-likes")
    modalLikes.innerText = `Likes:${dogLikes}`

    // add rating to modal
    let currentRating = (typeof dog.rating.value === "number") ? dog.rating.value : 10
    let modalRating = document.createElement('h3')
    modalRating.setAttribute("class", "modal-rating")
    modalRating.innerText = `Rating: ${currentRating}/10`

    // add rate dog link to modal

    let ratingInput = document.createElement("input")
    ratingInput.type = "number"
    ratingInput.setAttribute("class", "rating-input")
    
    let ratingSubmitButton = document.createElement("button")
    ratingSubmitButton.innerText = "Rate This Dog"
    
    
    //add event listener to addRating
    addEventListenerToAddRating(ratingInput, ratingSubmitButton, modalRating, dog)

        // create comments display
        let commentsUl = document.createElement('ul')
        commentsUl.setAttribute("id", "comments-ul")
        let commentsHeader = document.createElement('h3')
        commentsHeader.innerText = "Comments"
        comments = dog.comments
        comments.forEach(comment => {
            // create li
            let commentLi = document.createElement('li')
            commentLi.innerText = `${comment.author} said: ${comment.content}`
            
            // append
            commentsUl.appendChild(commentLi)
        })
        
        
        // append content to modal 
        let lineBreak1 = document.createElement("br")
        let lineBreak2 = document.createElement("br")
        let lineBreak3 = document.createElement("br")
        let lineBreak4 = document.createElement("br")


        modalContent.append(modalImg, modalLikes, likeButton, lineBreak4, modalRating, ratingInput, lineBreak1, ratingSubmitButton, lineBreak2, lineBreak3)
        newComment(dog, modalContent)
        modalContent.append(commentsUl)

    dogModal.style.display = "block";
}

let newComment = (dog, modalContent) => {
    // load comment form
    // load author input
    let commentForm = document.createElement("form")
    commentForm.setAttribute("class", "comment-form")
    let authorInput = document.createElement("input")
    authorInput.placeholder = "Your Name"
    
    // load content input
    let contentInput = document.createElement("TEXTAREA")
    contentInput.placeholder = "Your Comment"
    // load comment submit button
    let commentSubmitButton = document.createElement("button")
    commentSubmitButton.innerText = "Leave a Comment"
    commentSubmitButton.addEventListener("click", (event) => {
        event.preventDefault()
        if (typeof authorInput !== "string"){
            alert("Please enter your name!");
            return false;
        } else if (typeof contentInput !== "string"){
            alert("Please enter a comment!");
            return false;
        } else {
            console.log(authorInput.length)
            console.log(contentInput.length)
            createNewComment(dog, modalContent, authorInput, contentInput)
        }
    })
    let lineBreak1 = document.createElement("br")
    let lineBreak2 = document.createElement("br")
    let lineBreak3 = document.createElement("br")
    let lineBreak4 = document.createElement("br")

    commentForm.append(authorInput, lineBreak1, contentInput, lineBreak2, commentSubmitButton)
  
    modalContent.append(commentForm)
}

        
let addEventListenerToAddRating = (ratingInput, submitButton, modalRating, dog) => {
        submitButton.addEventListener("click", (event) => {
            event.preventDefault()
            if (ratingInput.value.length < 1){
                alert("Please enter a  rating!");
                return false;
            } 
            else {
                let currentRating = (typeof dog.rating.value === "number") ? dog.rating.value : 10
                let newRating = (parseInt(currentRating) + parseInt(ratingInput.value))/2
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
                    modalRating.innerText = `${resObj.value}/10`
                })
            }
        })
}

let createNewComment = async (dog, modalContent, authorInput, contentInput) => {
    let commentAuthor = authorInput.value
    let commentContent = contentInput.value

    let response = await fetch(`http://localhost:3000/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            author: commentAuthor,
            content: commentContent,
            dog_id: dog.id
        })
    })
    let createdComment = await response.json()
    showDog(dog)
    let newCommentLi = document.createElement("li")
    newCommentLi.innerText = `${createdComment.author} said: ${createdComment.content}`
    let commentsUl = document.querySelector("#comments-ul")
    commentsUl.append(newCommentLi)
}   

let homeButton = document.querySelector("#logo")
homeButton.addEventListener("click",() => {allDogs()})


    let topDogs = async () => {
        let response = await fetch("http://localhost:3000/dogs")
        let dogs = await response.json()
        let sortedDogs = dogs.sort((a, b) => (a.rating.value < b.rating.value) ? 1 : -1)

        clearDogs()

        sortedDogs.forEach((dog) => {
        //     //create dog function
        createDog(dog)
        console.log(dog)
        })
    }

    let topDogsButton = document.querySelector("#top-dogs")
    topDogsButton.addEventListener("click",() => {topDogs()})


    let mostCommentedDogs = async () => {
        let response = await fetch("http://localhost:3000/dogs")
        let dogs = await response.json()
        let sortedDogs = dogs.sort((a, b) => (a.comments.length < b.comments.length) ? 1 : -1)

        clearDogs()

        sortedDogs.forEach((dog) => {
           //create dog function
        createDog(dog)
        console.log(dog)
        })
    }

    let mostCommentedDogsButton = document.querySelector("#commented-dogs")
    mostCommentedDogsButton.addEventListener("click",() => {mostCommentedDogs()})

    let newLike = async (dog) => {
        let response = await fetch('http://localhost:3000/likes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                dog_id: dog.id
            })
        })
        let postedLike = await response.json()
    }  
    
    let mostPopularDogs = async () => {
        let response = await fetch("http://localhost:3000/dogs")
        let dogs = await response.json()
        let sortedDogs = dogs.sort((a, b) => (a.likes.length < b.likes.length) ? 1 : -1)

        clearDogs()

        sortedDogs.forEach((dog) => {
           //create dog function
        createDog(dog)
        })
    }

   let mostPopularDogsButton = document.querySelector("#popular-dogs")
   mostPopularDogsButton.addEventListener("click", () => {mostPopularDogs()})

