const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeContent = "Welcome to our blog page! Here you can share your thoughts and ideas about what you would do if you were reincarnated. Click on the 'Compose' button and start writing about the fascinating possibilities that come to your mind. Imagine getting a chance to relive your youth with all the knowledge and experience you have now. What would you do differently? How would you make the most of your second chance? Would you take risks you were too scared to take before? Or maybe focus on creating more meaningful relationships?  Share your vision with us and engage with like-minded individuals who are also pondering this philosophical question. Our blog is the perfect platform to express your creativity and imagination, and to learn from others who are on the same journey of self-discovery. So, join us and let's explore the boundless opportunities that life has to offer!";
const aboutContent = "Hi, my name is Thenamudhan and I'm glad you've landed on my about me page. I'm a masters student in Physics with a passion for programming. I specialize in JavaScript and have extensive experience with MongoDB, Node and EJS. Along with JavaScript, I also know Python and love experimenting with different programming languages. This website is a project I've built to showcase my skills and passion for programming. I hope you find it useful and informative. Thank you for visiting!";
const contactContent = "Are you looking for a dynamic and versatile individual who can bring fresh ideas and enthusiasm to your team? Then look no further! My name is Thenamudhan and I am a master's student in physics with extensive knowledge in JavaScript, Node, MongoDB, and EJS, as well as Python.This contact me page is a testament to my skills and showcases my ability to create professional and visually appealing web pages that engage users. I am constantly looking for ways to expand my skill set and learn new technologies to better serve my clients.Whether you are interested in hiring me or simply want to provide feedback on my work, I would love to hear from you. So please feel free to reach out through any of the channels provided on this page. I look forward to hearing from you soon!";
const composeContents = "Write your name that will display in the Home page and Content in Post form and also set a PASSWORD so That in Future IF you want to delete the Post you will need it ."

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoURI = "mongodb+srv://thenamudhan111:amudhan11@cluster0.mqxlivp.mongodb.net/blogDB"
mongoose.connect(mongoURI);

const postSchema = {
  title: String,
  body: String,
  password : String
};
const PORT = process.env.PORT || 3000;
const Post = mongoose.model("Post", postSchema);

app.get("/",function(req,res){
  Post.find({})
    .then(posts => {
      res.render("home", { 
        Posts: posts ,
        startingContent: homeContent,
      
      });
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});
const ObjectId = mongoose.Types.ObjectId;

const id = new ObjectId();

app.get("/about",function(req,res){
  res.render("about", {aboutcontents: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactcontents: contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose" , {composecontents : composeContents});
});

app.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.posttitle,
    body: req.body.posttext,
    password: req.body.postpassword
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});



app.get("/posts/:postId", function(req, res){
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;
 
  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.
 
  Post.findOne({_id:requestedPostId})
  .then(function (post) {
    res.render("post", {
            title: post.title,
            content: post.body,
            _id: post._id
          });
    })
    .catch(function(err){
      console.log(err);
    })
 
 
});

app.post("/delete/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  const postPassword = req.body.password;

  Post.findOne({_id: requestedPostId})
    .then(post => {
      if (post.password === postPassword) {
        Post.deleteOne({_id: requestedPostId})
          .then(() => {
            res.redirect("/");
          })
          .catch(err => {
            console.error(err);
            res.sendStatus(500);
          });
      } else {
        res.status(403).send("Invalid password");
      }
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});


app.listen(PORT, function() {
  console.log("Server started on port 3000");
});


