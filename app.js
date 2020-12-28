// Require libraries
require('dotenv').config();
const express = require('express');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Comment = require('./models/comments');
const User = require('./models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Connect to Database
mongoose.connect('mongodb+srv://root:bPoboyXiVLO1KrrX@cluster0.yelfn.mongodb.net/mongoose?retryWrites=true&w=majority', {
    useUnifiedTopology: true
},(err, client) =>
    {
	if (err) return console.log(err)
	console.log('Connected to Database!')
    })

// App setup
const app = express()

module.exports = app;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
var server_port = process.env.PORT || 3000;
var server_host = process.env.localhost || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
})

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
    // find review
    Review.findById(req.params.id).then(review => {
	//fetch its comments
	Comment.find({ reviewId: req.params.id }).then(comments => {
	    // respond with the template with both values
	    res.render('reviews-show', { review: review, comments: comments })
	})
  }).catch((err) => {
    console.log(err.message);
  });
});
   



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

// COMMENTS
app.post('/reviews/comments', (req, res) => {
      Comment.create(req.body).then((comment) => {
        console.log(comment)
        res.redirect(`/reviews/${comment.reviewId}`);
      }).catch((err) => {
        console.log(err.message);
      });
    });




  // SIGN UP POST
  app.get('/sign-up', (req, res) => {
    res.render('sign-up');
})
  app.post("/sign-up", (req, res) => {
    // Create User
    const user = new User(req.body);

    user
      .save()
      .then(user => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      })
      .catch(err => {
        console.log(err.message);
        return res.status(400).send({ err: err });
      });
  });
