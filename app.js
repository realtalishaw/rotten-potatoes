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
const Schema = mongoose.Schema



mongoose.connect('mongodb+srv://root:bPoboyXiVLO1KrrX@cluster0.yelfn.mongodb.net/mongoose?retryWrites=true&w=majority', {
    useUnifiedTopology: true
},(err, client) =>
    {
	if (err) return console.log(err)
	console.log('Connected to Database!')
    })

// App setup
const app = express()
app.use(cookieParser());
module.exports = app;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
	allowProtoPropertiesByDefault: true,
	allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');





// Middleware
app.use(methodOverride('_method'))

// Check Login Status
var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// LOGIN                                                                               
app.get('/login', (req, res) => {
  res.render('login');
});



app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name                                                               
  User.findOne({ username }, "username password")
    .then(user => {
      if (!user) {
        // User not found                                                              
        return res.status(401).send({ message: "Wrong Username or Password" });
      }
      // Check the password                                                            
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match                                                   
          return res.status(401).send({ message: "Wrong Username or password" });
        }
        // Create a token                                                              
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env
.SECRET, {
          expiresIn: "60 days"
        });
          // Set a cookie and redirect to root                                         
          console.log("user is: " + username);
        res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// REVIEWS
const Review = mongoose.model('Review', {
    title: String,
    description: String,
    category: String,
    author: { type: Schema.Types.ObjectID, ref: "User", required: true },
    upVotes: [{ type: Schema.Types.ObjectId, ref: "User"}],
    downVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    voteScore : {type: Number}
});

// TOPICS
const Topic = mongoose.model('Topic', {
    title: { type: String, required: true },
    description: String,
    category: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
});


// INDEX
app.get('/', (req, res) => {
    var currentUser = req.user;
    Review.find({}).lean().populate('author')
	.then(reviews => {
	    res.render('reviews-index', { reviews: reviews, currentUser });
   }).catch(err => {
      console.log(err);
   });
});


// Server Port
var server_port = process.env.PORT || 3000;
var server_host = process.env.localhost || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
})

// NEW
app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {title: "Start New Discussion"});
})

// CREATE
app.post("/reviews/new", (req, res) => { if (req.user) {

    var reviews = new Review(req.body);    reviews.author = req.user._id;
    reviews.upVotes = [];
    reviews.downVotes = [];
    reviews.voteScore = 0;
            reviews
            .save()
            .then(reviews => {
                return User.findById(req.user._id);
            })
		.then(user => {
		    console.log(user);
		    user.reviews.unshift(reviews);
                user.save();
                // REDIRECT TO THE NEW POST
                res.redirect(`/reviews/${reviews._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    } else {
        return res.status(401); // UNAUTHORIZED
    }
});

// SHOW
app.get('/reviews/:id', (req, res) => {
    var currentUser = req.user;
    // find review
    Review.findById(req.params.id).lean().populate('comments').populate('author')
	.then(review => {
	//fetch its comments
	Comment.find({ reviewId: req.params.id }).then(comments => {
	    // respond with the template with both values
	    res.render('reviews-show', { review: review, comments: comments, currentUser })
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
app.post("/reviews/comments", (req, res) => {
    if (req.user) { var comments = new Comment(req.body); comments.author = req.user._id;

        comments
            .save()
            .then(comments => {
                return User.findById(req.user._id);
            })
		    .then(user => {
			
                user.comments.push(comments);
			user.save();
			console.log(comments)
                // REDIRECT TO THE NEW POST
                res.redirect(`/reviews/${comments._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    } else {
        return res.status(401); // UNAUTHORIZED
    }
});




  // SIGN UP POST
  app.get('/sign-up', (req, res) => {
    res.render('sign-up');
})

// SIGN UP POST
app.post("/sign-up", (req, res) => {
  // Create User and JWT
  const user = new User(req.body);

  user
    .save()
    .then(user => {
	var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
	res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
	res.redirect("/");
    })
    .catch(err => {
      console.log(err.message + process.env.SECRET);
      return res.status(400).send({ err: err });
    });
});

// LOG OUT
app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    console.log("logged out");
  res.redirect('/');
});



// VOTING

app.put("/reviews/:id/vote-up", function(req, res) {
        var reviews = new Review(req.body);
    Review.findById(req.params.id).exec(function(err, review) {
	reviews.upVotes.push(req.user._id);
	reviews.voteScore = reviews.voteScore + 1;
	reviews.save();

	res.status(200);
    });
});

app.put("/reviews/:id/vote-down", function(req, res) {
        var reviews = new Review(req.body);
    Review.findById(req.params.id).exec(function(err, review) {
	reviews.downVotes.push(req.user._id);
	reviews.voteScore = reviews.voteScore - 1;
	reviews.save();

	res.status(200);
    });
});

// TOPICS                                                                                                                                                    
app.get('/topics/new', (req, res) => {
    res.render('topics-new', {title: "New Holbie Notes"});
})

app.post("/topics/new", (req, res) => { if (req.user) {
    
    var topics = new Topic(req.body);
    topics.author = req.user._id;
    topics.upVotes = [];
    topics.downVotes = [];
    topics.voteScore = 0;
            topics
            .save()
            .then(topics => {
                return User.findById(req.user._id);
            })
                .then(user => {
                
                user.save();
                // REDIRECT TO THE NEW POST                                                                                                                                                                 
                res.redirect(`/topics/${topics._id}`);
            })
            .catch(err => {
                console.log(err.message);
            });
    } else {
        return res.status(401); // UNAUTHORIZED                                                                                                                                                             
    }
});

app.get('/topics', (req, res) => {
    var currentUser = req.user;
    Topic.find({}).lean().populate('author')
        .then(topics => {
            res.render('topics', { topics: topics, currentUser });
   }).catch(err => {
      console.log(err);
   });
});

app.get("/topics/:id", function(req, res) {
    Topic.findById(req.params.id).lean()
	.then(topics => {
	    res.render('topics-show', { topics: topics })
	})

	.catch(err => {
	    console.log(err.message);
	});
});



// Members                                                                                                                                                    
app.get('/holbies', (req, res) => {
    var currentUser = req.user;
    User.find({}).lean().populate('author')
        .then(users => {
            res.render('holbies', { users: users, currentUser });
   }).catch(err => {
      console.log(err);
   });
});


// Categories
app.get('/:category', function(req, res) {
    Review.find({ category: req.params.category }).lean()
	.then(reviews => {
	    res.render("categories-index", { reviews });
	})
	.catch(err => {
	    console.log(err);
	});
});

// User Account
app.get('/account/:username', function(req, res)  {
    User.find({ username: req.params.username }).lean()
	.then(users => {
	    res.render("account", { users });
	}).catch(err => {
			    console.log(err);
		});
	});
