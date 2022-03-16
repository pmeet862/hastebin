const express = require("express");
const mongoose = require("mongoose");
const Document = require("./models/document");
const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://scrapper:Coder%40040@13.126.232.194/scrapper")
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
  const code = `Welcome to hastebin !
  
Use the comand in the top right corner
to create a new file to share with others.`;
  res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (error) {
    res.render("new", { value });
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("code-display", { code: document.value, id });
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("new", { value: document.value });
  } catch (error) {
    res.redirect(`/${id}`);
  }
});

app.listen(PORT, () => {
  console.log(`server is started on http://localhost:${PORT}`);
});
