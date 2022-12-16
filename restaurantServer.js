const http = require('http');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

process.stdin.setEncoding("utf8"); /* encoding */
const portNumber = process.argv[2];
console.log(`Web server started and running at http://localhost:${portNumber}`);
const app = express();

  const prompt = "Stop to shutdown the server: ";
  process.stdout.write(prompt);

  process.stdin.on("readable", function () {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
      let command = dataInput.trim();
      if (command === "stop") {
        process.stdout.write("Shutting down the server\n");
        process.exit(0);
      } else {
        process.stdout.write(`Invalid command: ${command}\n`);
      }
      process.stdout.write(prompt);
      process.stdin.resume();
    }
  });



//setting the view engines
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.get("/", (request, response) => {
    response.render("index");
 });



app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db =  process.env.MONGO_DB_NAME;
const mongoCollection = process.env.MONGO_COLLECTION;
const databaseAndCollection = {db: db, collection: mongoCollection};
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.atgbu6y.mongodb.net/?retryWrites=true&w=majority` ;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get("/order", (request, response) => {
  // store pizzas.json file in pizza variable
  const pizzas = require("./pizzas.json");

  response.render("order", {pizzas});
});
let objectToInsert = {};

app.post("/order", (request, response) => {

  const pizzas = request.body.pizza;

  const pizzaIds = pizzas.map(pizza => parseInt(pizza))

  const pizzaList = require("./pizzas.json");
  // filter out the pizza that matches the id of the pizza in pizzas
  const pizzaOrder = pizzaList.filter(pizza => pizzaIds.includes(pizza.id));
  let totalCost = 0;

  orderTable = "<table border='1'><tr><th>Pizza Name</th><th>Cost</th></tr></tr>";
  pizzaOrder.forEach(item => { 
    objectToInsert = {name: item.name, price: item.price};
    orderTable+= "<tr>";
    ItemName = item.name
    ItemCost = item.price;
    orderTable+= `<td> ${ItemName} </td> <td> ${ItemCost.toFixed(2)}</td> </tr>`
    totalCost += item.price;
    //add totalCost to objectToInsert
    objectToInsert.totalCost = totalCost;

	});
  orderTable+= `</tr> <th> Total Cost </th> <td> ${totalCost} </td> </table>`;


  response.render("yourOrder", {orderTable});
});
app.get("/yourOrder", (request, response) => {
  response.render("yourOrder");

});
app.get("/contact", (request, response) => {
  response.render("contact");

});
app.post("/contact", (request, response) => {
  response.render("contactConfirmation");

});
app.post("/yourOrder", async (request, response) => {
  let {userName, emailAddress} = request.body;
  
  objectToInsert.userName = userName;
  objectToInsert.emailAddress = emailAddress;

  try {
    await client.connect();
    const database = client.db(databaseAndCollection.db);
    const collection = database.collection(databaseAndCollection.collection);
    const result = await collection.insertOne(objectToInsert);
    console.log(`New listing created with the following id: ${result.insertedId}`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  response.render("orderConfirmation");

});


app.listen(portNumber);