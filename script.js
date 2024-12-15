document.addEventListener('DOMContentLoaded', ()=>{

    //i need my url to be the data base in repo
    const baseurl = "https://dynasty-29.github.io/Wk3-Code-Challenge/data.json";
    //lets begin with fetching our data from he data base
    fetch(baseurl)
    //parse json
    .then(response => response.json())
    //now used parse json to output our data
    .then(data => {
        //will be storing all this data in out element with id films so we get it
        const filmsList = document.getElementById('films');
        //now we go over each film and store it in list
        data.forEach(film => {
        // since we don't have a list html element we create it
        const filmItem = document.createElement('li');
        //this list element needs its metadat so we add it
        filmItem.classList.add('film', 'item');
        filmItem.innerText = film.title;
        //finally for it to be usable we attach it to its parent html element
        filmsList.appendChild(filmItem);

        //will be adding all the film into this list when prompted by mouse click
        //so we add an event listener that listen to this functionality
        filmItem.addEventListener('click', () => displayFilmDetails(film));
        });
    });


    //Making it possible to diplay films
    ///for this functionality to actually work we now implement the function particulars here
    //this function will help in diplaying films details once we are able to fetch them as we did above
    function displayFilmDetails(film) {
        //what will be looking for is the element with film details, so we get it
        const filmDetails = document.getElementById('film-details');

        //we need to keep count of capacity that we have and tickets we have sold so far
        //we have capacity details in our data base and also the ticket we have sold for each film
        const availableTickets = film.capacity - film.tickets_sold;

        //we have to keep updating the films details with every ticket sold
        filmDetails.innerHTML = `
          <h2>${film.title}</h2>
          <img src="${film.poster}" alt="${film.title} poster">
          <p>${film.description}</p>
          <p>Runtime: ${film.runtime} minutes</p>
          <p>Showtime: ${film.showtime}</p>
          <p>Available Tickets: ${availableTickets}</p>
          <button id="buy-ticket" ${availableTickets === 0 ? 'disabled' : ''}>Buy Ticket</button>
        `;

        //to make it complete we need to make it possible for the user to actually buy
        //so we add event listener to buy ticket button will create after this, but will be activating ith here
        //to do this we need to get the element that has id of buy-ticket      
        const buyButton = document.getElementById('buy-ticket');
        buyButton.addEventListener('click', () => buyTicket(film));
    }
     
    //Making it possible for user to buy these tickets
    //so the function for buy ticket being activated above we put its functionality here
    function buyTicket(film) {

        //now for getting our calculations
        const availableTickets = film.capacity - film.tickets_sold;
        //we want to implement the PATCH method but we have to check that avalable tickets are 
        // more than 0 so that we can update to the new value with the help of PATCH
        if (availableTickets > 0) {
          film.tickets_sold += 1;

          //as usual we fetch wit our film url          
          fetch(`baseurl/${film.id}`, {
            //verb w eusing is now PATCH, and since it need id we have added it the url as show in previous line
            method: 'PATCH',
            //contnue with all requirements a header and the body
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: film.tickets_sold })
          })
          //first the parse the json 
          .then(response => response.json())
          //second part woll give us the updated data
          .then(updatedFilm => {

            //will use two functions the later i will add its functionality below for better code readability
            //the first renders the updated details of the film details, its functionality we started with
            //helps diplays film details
            displayFilmDetails(updatedFilm); 
            //this one now updates the film list
            updateFilmInList(updatedFilm); 
          });
        }//but if they tickets are out we need to notify our dear user
        else 
        {
            alert('Apologies! No more tickets available!');
        }
    }
//awesome so far working properly

//this function we called it above it helps update the film list once patch requested is rendered
    function updateFilmInList(film) {
        //this list will be of all elements with attribute films li
        //this is from the list we created above
        const filmItems = document.querySelectorAll('#films li');

        //the for each to iterate over every item in the list
        //it updates them to show sold-out 
        filmItems.forEach(item => {
            if (item.getAttribute('data-id') === String(film.id)) {
                if (film.capacity - film.tickets_sold === 0) {
                    item.classList.add('sold-out');
                    item.innerText = `${film.title} (Sold Out)`;
                }
            }
        });
    }
      
    // we want to have a dlete button so we create it
    function createDeleteButton(film) {
        //its a button element so we create it
        const deleteButton = document.createElement('button');
        //its metadata should show delete
        deleteButton.innerText = 'Delete';
        //should be actived on click so we add event listener
        deleteButton.addEventListener('click', () => deleteFilm(film));
        return deleteButton;
    }
      
      //with button working now we actualy send a request to data base to actually delete it
      //meaning the verb will use in our fetch will be delete
      //DELETE requires id so have to have it in the url
    function deleteFilm(film) {
        fetch(`baseurl/${film.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            const filmItem = document.querySelector(`li[data-id="${film.id}"]`);
            filmItem.remove();
        });
    }
})