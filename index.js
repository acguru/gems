const app = require("./app");
const port = process.env.PORT || 3071;
const connectDB = require("./db/mongoose");
require("dotenv").config();

const url = process.env.MONGO_URI;
//const url = 'mongodb://localhost:27017/gems_test'

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

app.get("/", (req, res) => {
  res.send("Gems Stock API.");
});
