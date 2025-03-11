const express = require("express");
const cors = require('cors');
const db = require('./src/models/index')
const app = express();
const port = 3000;
const cors_options = {
    origin: 'http://localhost:3000'
};

app.use(cors(cors_options));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/', (req, res) => {
    res.send('Hello world!');
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
