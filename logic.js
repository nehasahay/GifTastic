let previousTopic,
    offset,
    // The predetermined topics displayed on the initial load
    topics = ["Adele", "Florence and the Machine", "Bloc Party", "Foo Fighters", "Death Cab for Cutie", "Mumford and Sons", "Childish Gambino"];


// Creates buttons for each topic
function makeButtons() {
    let container = document.getElementById("buttons");
    let fragment = document.createDocumentFragment();

    // Removes the previous buttons if they exist
    emptyContainer(container);

    topics.forEach(topic => {
        let topicButton = document.createElement("button");

        // Adds text to the button
        topicButton.appendChild(document.createTextNode(topic));

        // Assigns classes to the button
        topicButton.className = "topic btn btn-secondary m-2";

        // Sends the button into the queue
        fragment.appendChild(topicButton);
    });

    // Displays all of the buttons at once to the screen
    container.appendChild(fragment);
};


// Grabs gifs from Giphy
function giphy(topic, offset) {
    let display = document.getElementById("display-gifs");
    let fragment = document.createDocumentFragment();
    let queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topic + "&api_key=dc6zaTOxFJmzC&limit=10&offset=" + offset;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        response.data.forEach(gif => {
            let container = document.createElement("article");
            container.className = "card border-0 m-1";

            // Adds the rating of the gif
            let rating = document.createElement("p");
            rating.className = "card-text";
            rating.appendChild(document.createTextNode("Rated: " + gif.rating));

            // Creates a favorite button and sets its attributes
            let favoriteButton = document.createElement("button");
            favoriteButton.className = "favorite btn btn-lg btn-outline-secondary border-0 fas fa-heart";
            favoriteButton.setAttribute("data-gifID", gif.id);
            favoriteButton.setAttribute("data-src", gif.images.fixed_height_still.url);

            // Wraps around the rating and favorite button
            let cardBody = document.createElement("div");
            cardBody.className = "card-body text-center";
            cardBody.appendChild(rating);
            cardBody.appendChild(favoriteButton);

            // Creates the gif image
            let image = document.createElement("img");
            image.src = gif.images.fixed_height_still.url;
            image.className = "gif img-fluid card-img-top";

            // Wraps the container around the gif image, the rating, and the favorite button
            container.appendChild(image);
            container.appendChild(cardBody);

            // Sends the gif into the queue
            fragment.insertBefore(container, fragment.firstChild);
        });

        // Displays all of the gifs at once to the screen
        display.insertBefore(fragment, display.firstChild);
    });
};


// Displays tour dates via Bands in Town
function bandsInTown(artist) {
    let container = document.getElementById("bandsInTown");
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

    // Removes the previous artist
    emptyContainer(container);

    // Gets basic information for the artist
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let artistName = document.createElement("h1");
        artistName.appendChild(document.createTextNode(response.name));

        // Gets the Bands in Town page for the artist
        let artistURL = document.createElement("a");
        artistURL.href = response.url;
        artistURL.text = "See All Tour Dates";

        // Gets the thumbnail image for the artist
        let artistImage = document.createElement("img");
        artistImage.className = "img-fluid";
        artistImage.src = response.thumb_url;

        // Displays the artist's name, thumbnail, and Bands in Town link
        container.appendChild(artistName);
        container.appendChild(artistImage);
        container.appendChild(artistURL);

        // Changes the background image depending on the artist
        document.body.setAttribute("style", "background: fixed center / cover url(\"" + response.image_url + "\");");
    });

    // Reassembles the queryURL in order to obtain event information 
    let index = queryURL.indexOf("?");
    queryURL = queryURL.slice(0, index) + "/events" + queryURL.slice(index);

    // Gets information for upcoming tour dates
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Displays at most three upcoming dates
        let numberOfEvents = Math.min(response.length, 3);
        let i = 0;
        let events = document.createElement("section");

        // Displays a message if there were no upcoming dates
        if (!response.length) {
            let noEvents = document.createElement("h2");
            noEvents.appendChild(document.createTextNode("No upcoming events found!"));
            events.appendChild(noEvents);
        };

        while (i < numberOfEvents) {
            let eventContainer = document.createElement("article");
            eventContainer.className = "row";

            // Finds the event's date
            let datetime = new Date(response[i].datetime);
            let date = document.createElement("div");
            date.className = "col-1 text-center";

            // Gets the day of the event
            let day = document.createElement("p");
            day.className = "display-4 mb-0";
            day.appendChild(document.createTextNode(datetime.toLocaleDateString("en-US", {
                day: "numeric"
            })));

            // Gets the month of the event
            let month = document.createElement("p");
            month.className = "h5";
            month.appendChild(document.createTextNode(datetime.toLocaleDateString("en-US", {
                month: "short"
            })));

            // Puts the date in the event's row
            date.appendChild(day);
            date.appendChild(month);
            eventContainer.appendChild(date);

            // Creates a wrapper for the venue information
            let venue = document.createElement("div");
            venue.className = "col-10 align-self-end mt-4";

            // Gets the venue's name
            let venueName = document.createElement("h2");
            venueName.className = "mb-0";
            venueName.appendChild(document.createTextNode(response[i].venue.name));

            // Gets the venue's location
            let venueLocation = document.createElement("p");
            venueLocation.className = "lead";
            venueLocation.appendChild(document.createTextNode(response[i].venue.city + ", " + response[i].venue.country));

            // Puts the venue in the event's row
            venue.appendChild(venueName);
            venue.appendChild(venueLocation);
            eventContainer.appendChild(venue);

            // Adds the event to the queue
            events.appendChild(eventContainer);

            // Moves onto the next event
            i++;
        };

        // Displays all the events to the screen
        container.appendChild(events);
    });
};


// Empty helper function
function emptyContainer(container) {
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    };
};


// Adds a button as directed by the user
$("#add-topic").on("click", function (event) {
    event.preventDefault();
    let topic = document.getElementById("searchForTopic").value.trim();
    topics.push(topic);
    makeButtons();
});


// Starts and stops the gif
$(document).on("click", ".gif", function () {
    let url = this.src;
    let still = "_s";
    let gif = ".gif";
    let urlDisassembled = url.split(gif);

    if (url.indexOf(still) === -1) {
        // Adds the denotation for a still image at the end of the first part of the url
        url = urlDisassembled[0] + still;
    } else {
        // Removes the denotation for a still image at the end of the first part of the url
        url = urlDisassembled[0].slice(0, -still.length);
    };

    // Reassembles the url
    url += gif + urlDisassembled[1];
    this.src = url;
});


// Runs Giphy and BandsInTown
$(document).on("click", ".topic", function () {
    let container = document.getElementById("display-gifs");
    let topic = this.textContent;

    // Resets the gifs and artist shown if a new topic were selected
    if (topic !== previousTopic) {
        offset = 0;
        previousTopic = topic;

        // Removes the previous gifs if they exist
        emptyContainer(container);

        // Gets artist and tour information
        bandsInTown(topic);
    } else {
        // Adjusts the gifs shown if the same topic were chosen again
        offset += 10;
    };

    // Displays gifs related to the topic
    giphy(topic, offset);
});


makeButtons();