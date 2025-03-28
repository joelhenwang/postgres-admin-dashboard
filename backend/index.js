const express = require("express");
const cors = require('cors');
const db = require('./src/models/index')
const bcrypt = require('bcryptjs')
const app = express();
const port = 3000;
const cors_options = {
    origin: 'http://localhost:5173'
};

app.use(cors(cors_options));
app.use(express.json());
app.use(express.urlencoded({extended: true}));




app.get('/', (req, res) => {
    res.send('Hello world!');
});

require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/booking.routes')(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
