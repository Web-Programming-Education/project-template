const express = require('express');
const crypto = require('crypto');
const pathUtils = require( "path" );

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Your code goes here

app.get( "*", function( req, res ) {
  res.sendFile( pathUtils.resolve('public', "index.html" ) );
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})