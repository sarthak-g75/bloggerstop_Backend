const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://sarthak78:sarthak5@notebook.apkoif4.mongodb.net/test";
const connectToMongo = () => {
    mongoose
      .connect(mongoURI, {
        dbName: "BlogsDB",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to mongo");
      })
      .catch((err) => console.log(err.message));
};

module.exports = connectToMongo;
