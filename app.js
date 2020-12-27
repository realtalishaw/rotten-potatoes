// Require libraries
const express = require('express')
var exphbs = require('express-handlebars');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/rotten-potatoes', { useNewUrlParser: true });
const bodyParser = require('body-parser')

// App setup
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));

const Review = mongoose.model('Review', {
    title: String,
    description: String,
    movieTitle: String
});



// Middleware

// INDEX
app.get('/', (req, res) => {
  Review.find()
    .then(reviews => {
      res.render('reviews-index', { reviews: reviews });
    })
    .catch(err => {
      console.log(err);
    })
})


// Server Port
app.listen(3000, () => {
    console.log('App listening on port 3000!')
})

// NEW
app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {});
})

// CREATE
app.post('/reviews', (req, res) => {
  Review.create(req.body).then((review) => {
    console.log(review);
    res.redirect('/');
  }).catch((err) => {
    console.log(err.message);
  })
})

   



