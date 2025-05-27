import express from "express";
import bodyParser from "body-parser";
import { v4 } from "uuid";

const app = express();
const port = 3000;
let postList = [];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {posts: postList});
});

app.post("/submit", (req, res) => {
    const newPost = {
        id: v4(),
        username: req.body["username"],
        message: req.body["message"],
        timestamp: new Date().toLocaleString()
    };
    postList.unshift(newPost);
    res.render("index.ejs", {posts: postList});
});

app.post("/delete", (req, res) => {
    const postId = req.body.id;
    postList = postList.filter(post => post.id !== postId);
    res.render("index.ejs", {posts: postList});
});

app.get("/edit", (req, res) => {
    const postId = req.query.id;
    const postToEdit = postList.find(post => post.id === postId);
    res.render("./partials/edit.ejs", {post: postToEdit});
});

app.post("/update", (req, res) => {
    const postId = req.body.id;
    const updatedPost = {
        id: postId,
        username: req.body["username"],
        message: req.body["message"],
        timestamp: postList.find(post => post.id === postId).timestamp
    };
    postList = postList.map(post => post.id === postId ? updatedPost : post);
    res.render("index.ejs", {posts: postList});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})