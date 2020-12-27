// Require libraries
const express = require('express')
var exphbs = require('express-handlebars');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/rotten-potatoes', { useNewUrlParser: true });

// App setup
const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const Review = mongoose.model('Review', {
    title: String,
    movieTitle: String,
});

// Middleware

// Routes
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

// Mock Array of Projects
//let reviews = [
  //  { title: "Great Review", movieTitle: "Batman II" },
    //{ title: "Awesome Movie", movieTitle: "Titanic" },
   // { title: "Two Thumbs Way, Way, Up!", movieTitle: "Hercules" },
   // { title: "5 out of 5 highlt recommend", movieTitle: "Little Shop of Horrors"}
//]

