// The predetermined topics displayed on the initial load
let topics = ["Adele", "Florence and the Machine", "Bloc Party", "Foo Fighters", "Death Cab for Cutie", "Mumford and Sons", "Childish Gambino"];


// Creates buttons for each topic
function makeButtons() {
    let container = document.getElementById("buttons");

    // Removes the previous buttons if they exist
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    };

    topics.forEach(topic => {
        let topicButton = document.createElement("button");

        // Adds text to the button
        topicButton.appendChild(document.createTextNode(topic));

        // Assigns attributes to the button
        topicButton.setAttribute("class", "topic btn btn-secondary m-2");
        topicButton.setAttribute("data-topic", topic);

        // Displays the button to the screen
        container.appendChild(topicButton);
    });
};


// Grabs gifs from Giphy
function giphy(topic) {
    let queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        response.data.forEach(gif => {
            let container = document.createElement("article");
            container.setAttribute("class", "m-3");

            // Adds the rating of the gif
            let rating = document.createElement("p");
            rating.appendChild(document.createTextNode("Rated: " + gif.rating));
            rating.setAttribute("class", "text-center");

            // Creates the gif image and sets its attributes
            let image = document.createElement("img");
            image.setAttribute("src", gif.images.fixed_height_still.url);
            image.setAttribute("class", "gif img-fluid");
            image.setAttribute("data-state", "still");

            // Wraps the container around the gif and its rating
            container.appendChild(image);
            container.appendChild(rating);

            // Displays the gif to the screen
            let display = document.getElementById("display-gifs");
            display.insertBefore(container, display.firstChild);
        });
    });
};


// Adds a button as directed by the user
$("#add-topic").on("click", function(event) {
    event.preventDefault();
    let topic = document.getElementById("searchForTopic").value.trim();
    topics.push(topic);
    makeButtons();
});


// Starts and stops the gif
$(document).on("click", ".gif", function() {
    let url = this.getAttribute("src");
    let state = this.getAttribute("data-state");
    let gif = ".gif";
    let urlDisassembled = url.split(gif);

    if (state === "still") {
        // Removes the denotation for a still image at the end of the first part of the url
        url = urlDisassembled[0].slice(0, -2);
        this.setAttribute("data-state", "active");
    } else {
        // Adds the denotation for a still image at the end of the first part of the url
        url = urlDisassembled[0] + "_s";
        this.setAttribute("data-state", "still");
    };

    // Reassembles the url
    url +=  gif + urlDisassembled[1];
    this.setAttribute("src", url);
});


// Runs Giphy
$(document).on("click", ".topic", function () {
    let container = document.getElementById("display-gifs");

    // Removes the previous gifs if they exist
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    };

    let topic = this.getAttribute("data-topic");
    giphy(topic);
});


makeButtons();