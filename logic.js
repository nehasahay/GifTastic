let previousTopic,
    offset,
    favoriteGifs = [],
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

        // Assigns classes to the button
        topicButton.className = "topic btn btn-secondary m-2";

        // Adds text to the button
        topicButton.textContent = topic;

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
            container.className = "card bg-transparent border-0 m-1";

            // Adds the rating of the gif
            let rating = document.createElement("p");
            rating.className = "card-text";
            rating.textContent = "Rated: " + gif.rating;

            // Creates a favorite button
            let favoriteButton = document.createElement("button");
            favoriteButton.className = "favorite btn btn-lg btn-outline-secondary border-0 fas fa-heart";

            // Wraps around the rating and favorite button
            let cardBody = document.createElement("div");
            cardBody.className = "card-body text-center";
            cardBody.appendChild(rating);
            cardBody.appendChild(favoriteButton);

            // Creates the gif image
            let image = document.createElement("img");
            image.className = "gif img-fluid card-img-top";
            image.src = gif.images.fixed_height_still.url;

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


// Displays artist information via Bands in Town
function bandsInTown(artist) {
    let container = document.getElementById("bandsInTown");
    container.className = "text-center";
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

    // Removes the previous artist
    emptyContainer(container);

    // Gets basic information for the artist
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let artistName = document.createElement("h1");

        // Gets the Bands in Town page for the artist
        let artistURL = document.createElement("a");
        artistURL.className = "btn-light bg-transparent";
        artistURL.href = response.url;
        artistURL.text = response.name;
        artistURL.target = "_blank";
        artistName.appendChild(artistURL);

        // Gets the thumbnail image for the artist
        let artistImage = document.createElement("img");
        artistImage.className = "img-fluid";
        artistImage.src = response.thumb_url;

        // Displays the artist's name and thumbnail
        container.appendChild(artistName);
        container.appendChild(artistImage);

        // Changes the background image depending on the artist
        document.body.setAttribute("style", "background: fixed center / cover url(\"" + response.image_url + "\");");

        // Reassembles the queryURL in order to obtain event information
        let index = queryURL.indexOf("?");
        queryURL = queryURL.slice(0, index) + "/events" + queryURL.slice(index);
        bandsInTownEvents(container, queryURL);
    });
};


// Gets information for upcoming tour dates
function bandsInTownEvents(container, queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Gets results for at most three upcoming dates
        let numberOfEvents = Math.min(response.length, 3);
        let events = document.createElement("section");
        events.className = "my-4";
        let i = 0;

        // Displays a message if there were no upcoming dates
        if (!response.length) {
            let noEvents = document.createElement("h2");
            noEvents.textContent = "No upcoming events found!";
            events.appendChild(noEvents);
        };

        while (i < numberOfEvents) {
            let eventContainer = document.createElement("article");
            eventContainer.className = "row";

            // Finds the event's date
            let datetime = new Date(response[i].datetime);
            let date = document.createElement("div");
            date.className = "col-2 p-2 bg-secondary text-white text-right";

            // Gets the day of the event
            let day = document.createElement("p");
            day.className = "display-4 m-0";
            day.textContent = datetime.toLocaleDateString("en-US", {
                day: "numeric"
            });

            // Gets the month of the event
            let month = document.createElement("p");
            month.className = "h5";
            month.textContent = datetime.toLocaleDateString("en-US", {
                month: "short"
            });

            // Puts the date in the event's row
            date.appendChild(day);
            date.appendChild(month);
            eventContainer.appendChild(date);

            // Creates a wrapper for the venue information
            let venue = document.createElement("div");
            venue.className = "col-5 col-sm-6 col-md-7 col-lg-8 align-self-end text-left";

            // Gets the venue's name
            let venueName = document.createElement("h2");
            venueName.className = "mb-0";
            venueName.textContent = response[i].venue.name;

            // Gets the venue's location
            let venueLocation = document.createElement("p");
            venueLocation.className = "lead";
            let venueLocationString = response[i].venue.city + ", ";

            // Uses a region (e.g. CA for California) if applicable; otherwise, a country
            venueLocationString += (response[i].venue.region) ? response[i].venue.region : response[i].venue.country;
            venueLocation.textContent = venueLocationString;

            // Puts the venue in the event's row
            venue.appendChild(venueName);
            venue.appendChild(venueLocation);
            eventContainer.appendChild(venue);

            // Creates a wrapper for getting a ticket
            let ticket = document.createElement("div");
            ticket.className = "col-2 align-self-center";

            // Creates a button to buy tickets
            let ticketButton = document.createElement("a");
            ticketButton.className = "btn btn-lg btn-secondary";
            ticketButton.href = response[i].offers[0].url;
            ticketButton.text = "Buy Tickets";
            ticketButton.target = "_blank";

            // Puts the ticket button in the event's row
            ticket.appendChild(ticketButton);
            eventContainer.appendChild(ticket);

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
    // Prevents the submit action of the button (which would refresh the page)
    event.preventDefault();
    let search = document.getElementById("searchForTopic");
    let topic = search.value.trim();

    // Clears the search bar
    search.value = "";

    // Makes a new button for the new topic
    topics.push(topic);
    makeButtons();
});


// Starts and stops the gif
$(document).on("click", ".gif", function () {
    let url = this.src;
    let still = "_s";
    let gif = ".gif";
    let urlDisassembled = url.split(gif);

    // Adds the denotation for a still image at the end of the first part of the url
    // when it's missing, or removes it when it's there
    url = (url.indexOf(still) === -1) ? urlDisassembled[0] + still : urlDisassembled[0].slice(0, -still.length);

    // Reassembles the url
    url += gif + urlDisassembled[1];
    this.src = url;
});


// Runs Giphy and BandsInTown
$(document).on("click", ".topic", function () {
    let container = document.getElementById("display-gifs");
    container.className = "d-flex flex-wrap justify-content-center";
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


// Keeps track of favorite gifs
$(document).on("click", ".favorite", function () {
    // Goes up to the card body div, then to the preceding image, and gets its source
    let imageURL = this.parentElement.previousElementSibling.src;

    // Selects the first h1 in the document, goes to its first child (the hyperlink), and gets its text
    let topic = document.getElementsByTagName("h1")[0].childNodes[0].text;

    // Stores the image and topic together
    let gifObject = {
        "topic": topic,
        "image": imageURL
    };

    // Checks if the gif were already favorited
    let isItAlreadyAFavorite = favoriteGifs.filter(gif => {
        return gifObject.image === gif.image;
    });

    if (!isItAlreadyAFavorite.length) {
        // Stores the gif in an array for favorited gifs
        favoriteGifs.push(gifObject);

        // Updates the cookie for the favorite gifs
        document.cookie = "topic=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "favoriteGifsArray=" + JSON.stringify(favoriteGifs) + ";";
    };

    // Disables the button for visual feedback of the gif being favorited
    this.disabled = true;
});


// Displays all the favorite gifs on the page by topic
$("#view-favorites").on("click", function () {
    let bandsInTown = document.getElementById("bandsInTown");
    let displayGifs = document.getElementById("display-gifs");

    // Clear the styling for the container so that it doesn't interfere with the headers
    displayGifs.className = "";

    // Clears the previous topic to let topic buttons function properly
    previousTopic = "";

    // Empties the page
    emptyContainer(bandsInTown);
    emptyContainer(displayGifs);

    favoriteGifs.forEach(gif => {
        // [...] turns a node list into an array
        let headers = [...document.querySelectorAll("h2")].map(node => node.textContent);

        // Creates the gif image
        let image = document.createElement("img");
        image.className = "gif img-fluid m-1";
        image.src = gif.image;

        // Makes a header and container for the gif if it doesn't already exist
        if (headers.indexOf(gif.topic) === -1) {
            let newHeader = document.createElement("h2");
            newHeader.className = "navbar navbar-dark";
            newHeader.textContent = gif.topic;
            displayGifs.appendChild(newHeader);

            let gifContainerForHeader = document.createElement("section");
            gifContainerForHeader.className = "d-flex flex-wrap justify-content-center mb-3";
            gifContainerForHeader.id = gif.topic;
            newHeader.insertAdjacentElement("afterend", gifContainerForHeader);
        };

        // Appends the gif to the section for its topic
        document.getElementById(gif.topic).appendChild(image);
    });
});


// Updates the working array of favorite gifs with gifs stored in the cookie
function makeFavoriteGifs() {
    let cookieString = readCookie("favoriteGifsArray");
    let cookieArray = JSON.parse(cookieString);

    // Only executes if the cookie has values stored in it
    if (cookieArray) {
        cookieArray.forEach(gif => {
            favoriteGifs.push(gif);
        });
    };
};


// Returns the value of a cookie
function readCookie(name) {
    let nameOfCookie = name + "=";
    let cookieArray = document.cookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];

        // Strips whitespace from the cookie
        while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);

        if (cookie.indexOf(nameOfCookie) === 0) {
            return cookie.substring(nameOfCookie.length, cookie.length);
        };
    };

    return null;
};

makeFavoriteGifs();
makeButtons();