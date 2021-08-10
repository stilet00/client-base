let express = require("express");
let multer = require("multer");
let path = require("path");
let MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://testApp:72107210@cluster0.vmv4s.mongodb.net/myProject?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });
let ObjectId = require("mongodb").ObjectID;
let bodyParser = require("body-parser");
let collectionTasks;
let collectionBalance;
let collectionClients;
let rootURL = "/";
let tasksURL = rootURL + "tasks/";
let balanceURL = rootURL + "balance/";
let clientsURL = rootURL + "clients/";
const PORT = process.env.PORT || 80;

let app = express();
app.use(express.static(__dirname + "/build"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extented: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
// task list api

app.get(tasksURL + "get", (req, res) => {
  collectionTasks.find().toArray((err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });
});
app.delete(tasksURL + ":id", (req, res) => {
  collectionTasks.deleteOne({ _id: ObjectId(req.params.id) }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});
app.post(tasksURL + "add", (req, res) => {
  if (req.body.taskName) {
    let task = { ...req.body };

    collectionTasks.insertOne(task, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        res.send(result.ops[0]._id);
      }
    });
  }
});
app.put(tasksURL + ":id", (req, res) => {
  collectionTasks.updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $set: {
        completed: req.body.completed,
        doneAt: req.body.doneAt,
      },
    },
    (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    }
  );
});

// balance api

app.get(balanceURL + "get", (req, res) => {
  collectionBalance.find().toArray((err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });
});
app.post(balanceURL + "add", (req, res) => {
  if (req.body) {
    let month = { ...req.body };

    collectionBalance.insertOne(month, (err, result) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        res.send(result.ops[0]._id);
      }
    });
  }
});
app.delete(balanceURL + ":id", (req, res) => {
  collectionBalance.deleteOne({ _id: ObjectId(req.params.id) }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});
app.put(balanceURL + ":id", (req, res) => {
  collectionBalance.updateOne(
    { _id: ObjectId(req.params.id) },
    {
      $set: { values: req.body.values },
    },
    (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    }
  );
});

//clients api

app.get(clientsURL + "get", (req, res) => {
  collectionClients.find().toArray((err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });
});
// app.post(clientsURL + "add", (req, res) => {
//   if (req.body) {
//     let client = { ...req.body };
//
//     collectionClients.insertOne(client, (err, result) => {
//       if (err) {
//         return res.sendStatus(500);
//       } else {
//         res.send(result.ops[0]._id);
//       }
//     });
//   }
// });

//routes

app.get(rootURL + "chart/", function (request, response, next) {
  response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "chart?", function (request, response, next) {
  response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "clients/true?", function (request, response, next) {
  response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "clients/?", function (request, response, next) {
  response.sendFile(__dirname + "/build/index.html");
});
app.get(rootURL + "tasks/?", function (request, response, next) {
  response.sendFile(__dirname + "/build/index.html");
});


//images


app.use(express.static(__dirname));
const upload = multer({ dest: 'uploads/' })
app.post(clientsURL + "add", upload.single("avatar"), function (req, res, next) {
  let filedata = req.file;
  console.log(filedata);
  // if(!filedata)
  //   res.send("Ошибка при загрузке файла");
  // else
  //   res.send("Файл загружен");
});

client.connect(function (err) {
  collectionTasks = client.db("taskListDB").collection("tasks");
  collectionBalance = client.db("taskListDB").collection("totalBalance");
  collectionClients = client.db("clientsDB").collection("clients");
  console.log("Connected successfully to server...");
  app.listen(PORT, () => {
    console.log("API started at port", PORT);
  });
});
