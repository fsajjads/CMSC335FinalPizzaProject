const axios = require("axios");
const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");

require("dotenv").config({
  path: path.resolve(__dirname, "credentialsDontPost/.env"),
});

const apiKey = process.env.RAPIDAPI_KEY;
const fs = require("fs");

// get all pizzas

const options = {
  method: "GET",
  url: "https://pizza-and-desserts.p.rapidapi.com/pizzas",
  headers: {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "pizza-and-desserts.p.rapidapi.com",
  },
};

axios
  .request(options)
  .then(function (response) {
    let v = response.data;
    console.log(v);
    const data = JSON.stringify(v);

    // write JSON string to a file
    fs.writeFile("pizzas.json", data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
  })
  .catch(function (error) {
    console.error(error);
  });

// get all desserts
const options2 = {
  method: "GET",
  url: "https://pizza-and-desserts.p.rapidapi.com/desserts",
  headers: {
    "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "pizza-and-desserts.p.rapidapi.com",
  },
};

axios
  .request(options2)
  .then(function (response) {
    let v = response.data;
    console.log(v);
    const data = JSON.stringify(v);

    // write JSON string to a file
    fs.writeFile("desserts.json", data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
  })
  .catch(function (error) {
    console.error(error);
  });
