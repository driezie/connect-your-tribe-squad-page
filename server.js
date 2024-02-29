import express from "express";
import fetchJson from "./helpers/fetch-json.js";
import bodyParser from 'body-parser'; // Importing bodyParser using ES module syntax

const apiUrl = "https://fdnd.directus.app/items";
const app = express();

// Using bodyParser middleware to parse urlencoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Stel ejs in als template engine
app.set("view engine", "ejs");
// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources
app.use(express.static("public"));

const messages = [];

// Maak een GET route voor de index
app.get("/", function (request, response) {
  var selectedSquad = null;

  // Haal alle personen uit de FDND API op
  fetchJson(apiUrl + "/person/").then((data) => {
    // Check of er een filter query in de URL staat, en of deze niet "all" is
    if (request.query.filter && request.query.filter != "all") {
      // Filter de data op de meegegeven query
      data.data = data.data.filter(
        (person) => person.squad_id == request.query.filter
      );
    };

    // Check of er een search query in de URL staat, en of deze niet leeg is
    if (request.query.search && request.query.search != "") {
      // Filter de data op de meegegeven query
      data.data = data.data.filter(
        (person) => person.name.toLowerCase().includes(request.query.search.toLowerCase()) || person.surname.toLowerCase().includes(request.query.search.toLowerCase())
      );
    };

    // Geef mee aan de pagina welke squad geselecteerd is voor filteren
    switch (request.query.filter) {
      case "":
        selectedSquad = null;
        break;
      case "all":
        selectedSquad = null;
        break;
      case "3":
        selectedSquad = "D";
        break;
      case "4":
        selectedSquad = "E";
        break;
      case "5":
        selectedSquad = "F";
        break;
    }

    console.log(data);
    // Render index.ejs uit de views map en geef uit FDND API opgehaalde data mee
    response.render("index", { persons: data.data, filters: {
      selectedSquad: selectedSquad,
      search: request.query.search
    } });
  });
});

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {

    try {
      // PARSE
      apiData.data.custom = JSON.parse(apiData.data.custom)
    } catch (error) {
      apiResponse.data.custom = {}
    }

    // Render person.ejs uit de views map en geef uit FDND API opgehaalde data mee
    response.render('person', {
      person: apiData.data,
      messages: messages})
  })
})


app.post('/person/:id', function (request, response) {
  console.log("RECEIVED POST REQUEST");
  console.log(request.body, request.params.id);

  // Haal de persoon op uit de WHOIS API
  fetchJson(apiUrl + '/person/' + request.params.id)
  .then((apiResponse) => {
    console.log(apiResponse);

    try {
      // PARSE
      apiResponse.data.custom = JSON.parse(apiResponse.data.custom);
    } catch (error) {
      apiResponse.data.custom = {};
    }

    console.log("This is my response:", request.body);

    // Checkt of er een bericht is ingevuld
    if (request.body.bericht && request.body.bericht.trim() !== '') {
      // Checkt of de custom data al een messages array heeft
      if (!apiResponse.data.custom.messages) {
        apiResponse.data.custom.messages = []; // Als die niet bestaat maakt hij een nieuwe array aan
      }
      apiResponse.data.custom.messages.push(request.body.bericht);
    }

    // Updates de custom data van de persoon in de WHOIS API
    fetch(apiUrl + '/person/' + request.params.id, {
      method: 'PATCH',
      body: JSON.stringify({
        custom: apiResponse.data.custom
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    .then((patchResponse) => {
      // Stuurt de gebruiker terug naar de detailpagina van de persoon
      response.redirect(303, '/person/' + request.params.id);
    })
    .catch((error) => {
      // Als er een fout optreedt, log deze dan in de console en geef een foutmelding aan de gebruiker
      console.error("Error updating person data:", error);
      response.status(500).send("Error updating person data");
    });
  })
  .catch((error) => {
    // Als er een fout optreedt, log deze dan in de console en geef een foutmelding aan de gebruiker
    console.error("Error fetching person data:", error);
    response.status(500).send("Error fetching person data");
  });
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8080);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
