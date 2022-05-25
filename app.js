const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/wikiDB", { useNewUrlParser: true });

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema);

// Request that target all articles
app.route("/articles")

    .get(function (req, res) {

        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                console.log(err);
            }
        });
    })

    .post(function (req, res) {

        const title = req.body.title;
        const content = req.body.content;

        const article = new Article({
            title: title,
            content: content
        });

        article.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {

        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Succesfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });


//Request that tartget a specific article

app.route("/articles/:articleTitle")

    .get(function(req, res){ 
            Article.findOne({ title: req.params.articleTitle}, function(err, foundArticle){
            if (foundArticle) {
                res.send(foundArticle);
            }else{
                res.send("No articles matching that title found!");
            }
        });
    })

    .put(function(req, res){
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title:req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if (!err) {
                    res.send("Successfully updated article.");
                }else{
                    res.send(err);
                }
            }
        );
    })

    .patch(function(req, res){
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if (!err) {
                    res.send("Successfully updated article.");
                }else{
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req, res){
        Article.findOneAndDelete(
            {title: req.params.articleTitle},
            function (err) {
                if (!err) {
                    res.send("Successfully deleted article.");
                } else {
                    res.send(err);
                }
            }
        );
    });

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
});