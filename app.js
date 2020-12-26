// Require libraries
const express = require('express')
var exphbs = require('express-handlebars');

// App setup
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware

// Routes
app.get('/', (req, res) => {
    res.render('home', { msg: 'Handlebars are Cool!' });
})

// Server Port
app.listen(3000, () => {
    console.log('App listening on port 3000!')
})
