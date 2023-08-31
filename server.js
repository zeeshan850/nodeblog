import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/user-routes";
// Create an Express application
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    "mongodb+srv://tabahidavil:foXsnLCYawv6tlSw@cluster0.mlg2ufw.mongodb.net/backend?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.urlencoded({ extended: true }));
const users = [
  { id: 1, name: "zee" },
  { id: 2, name: "awan" },
  { id: 3, name: "usman" },
  { id: 4, name: "younas" },
  { id: 5, name: "istifa" },
  { id: 6, name: "murtaza" },
];

// Middleware example
app.use((req, res, next) => {
  next(); // Call the next middleware/route handler
});
// app.use(cors());
// Route example

app.use(express.json());
app.use("/api", router);
app.get("/", (req, res) => {
  res.send({
    status: 200,
    msg: "succes",
    data: users,
  });
});

// Middleware

// Routes

// Starting the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
