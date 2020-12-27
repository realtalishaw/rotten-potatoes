// Require libraries
const express = require('express')
var exphbs = require('express-handlebars');
var  mongoose = require('mongoose')
const methodOverride = require('method-override')

const bodyParser = require('body-parser')
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://root:taouNWTramSKtWa1@cluster0.yelfn.mongodb.net/mongoose?retryWrites=true&w=majority', {
    useUnifiedTopology: true
},{ useNewUrlParser: true }, (err, client) =>
    {
	if (err) return console.log(err)
	console.log('Connected to Database!')
    })

// App setup
const app = express()
module.exports = app;
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
	allowProtoPropertiesByDefault: true,
	allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');


const Review = mongoose.model('Review', {
    title: String,
    description: String,
    movieTitle: String
});



// Middleware
app.use(methodOverride('_method'))
// INDEX

app.get('/', (req, res) => {
    Review.find({}).lean()
	.then(reviews => {
	res.render('reviews-index', { reviews: reviews });
   }).catch(err => {
      console.log(err);
   })
})


// Server Port
const port = process.env.PORT || 3000;
app.listen(port);

// NEW
app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {title: "New Review"});
})

// CREATE
app.post('/reviews', (req, res) => {
  Review.create(req.body).then((review) => {
      console.log(review);
    res.redirect(`/reviews/${review._id}`);
  }).catch((err) => {
    console.log(err.message);
  })
})

// SHOW
app.get('/reviews/:id', (req, res) => {
  Review.findById(req.params.id).then((review) => {
    res.render('reviews-show', { review: review })
  }).catch((err) => {
    console.log(err.message);
  })
})
   



// EDIT
app.get('/reviews/:id/edit', (req, res) => {
    Review.findById(req.params.id, function(err, review) {
	res.render('reviews-edit', {review: review, title: "Edit Review"});
    })
})

// UPDATE
app.put('/reviews/:id', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body)
	.then(review => {
	    res.redirect(`/reviews/${review._id}`)
	})
	.catch(err => {
	    console.log(err.message)
	})
})

// DELETE
app.delete('/reviews/:id', function (req, res) {
    console.log("DELETE review")
    Review.findByIdAndRemove(req.params.id).then((review) => {
	res.redirect('/');
    }).catch((err) => {
	console.log(err.message);
    })
})
