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
  const data = req.body;
  // console.log("data", data);
  const value = req.body.value;
  try {
    // const document = await Document.create({ data });
    const document = await new Document({ ...data }).save();
    // console.log("doc", document);
    if (document.password) {
      res.redirect(`/${document.id}/${document.password}`);
    } else {
      res.redirect(`/${document.id}`);
    }
  } catch (error) {
    res.render("new", { value });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const code = "Please enter password in URL";
    const document = await Document.findById(id);
    if (document.password) {
      res.render("code-display", { code });
    } else {
      res.render("code-display", { code: document.value, id });
    }
  } catch (error) {
    res.redirect("/");
  }
});
//commit test
app.get("/:id/:password", async (req, res) => {
  const id = req.params.id;
  const pass = req.params.password;
  try {
    const document = await Document.findById(id);
    if (document.password == pass) {
      res.render("code-display", { code: document.value, id });
    } else {
      const code = "Enter Valid password";
      res.render("code-display", { code });
    }
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/a/update/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const document = await Document.findById(id);

    res.render("update", { value: document.value });
  } catch (error) {
    res.redirect(`/${id}`);
  }
});

app.put("/:id/savechanges", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("req", req.params, req.body);
    const value = req.body.newData;

    const document = await Document.findByIdAndUpdate(id, { value });
    console.log(document);
    res.send(document);
  } catch (error) {
    console.log(error);
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
