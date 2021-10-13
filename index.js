const express = require("express");
const crypto = require("crypto");
const pathUtils = require( "path" );
const { readData, writeData } = require("./fileStorage.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/benchmarks", function(req, res) {
  const fileName = "benchmarks.json";
  const benchmarkDb = readData(fileName);
  const data = req.body;

  if (!benchmarkDb.benchmarks) {
    benchmarkDb.benchmarks = [];
  }

  benchmarkDb.benchmarks.push(data);
  writeData(fileName, benchmarkDb);

  res.status(201).end();
})

app.get( "*", function( req, res ) {
  res.sendFile( pathUtils.resolve("public", "index.html" ) );
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})