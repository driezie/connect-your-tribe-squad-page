// Importeer het npm pakket express uit de node_modules map
import express from "express";
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from "./helpers/fetch-json.js";

// Stel het basis endpoint in
const apiUrl = "https://fdnd.directus.app/items";

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/person/?filter={"squad_id"}:5');

// Maak een nieuwe express app aan
const app = express();

// Stel ejs in als template engine
app.set("view engine", "ejs");
// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources
app.use(express.static("public"));

// Maak een GET route voor de index
app.get("/", function (request, response) {
  var selectedSquad = null;

  // Haal alle personen uit de FDND API op
  fetchJson(apiUrl + "/person/").then((data) => {
    // Check of er een query in de URL staat (filter)
    if (request.query.filter && request.query.filter != "all") {
      // Filter de data op de meegegeven query
      data.data = data.data.filter(
        (person) => person.squad_id == request.query.filter
      );
    };

    if (request.query.search && request.query.search != "") {
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
    response.render("index", { persons: data.data, currentSquad: selectedSquad });
  });
});

// Maak een POST route voor de index
app.post("/", function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, "/");
});

// Maak een GET route voor person met een request parameter id
app.get("/person/:id", function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de FDND API op
  fetchJson(apiUrl + "/person/" + request.params.id).then((data) => {
    //fdnd.directus.app/items/person/46
    // Render index.ejs uit de views map en geef uit FDND API opgehaalde data mee
    https: response.render("person", data);
    console.log(data);
  });
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8080);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
