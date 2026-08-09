require("dotenv").config({ path: "./config.env" });
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/post");
const likeRoutes = require("./routes/like");
const commentRoutes = require("./routes/comment");
const reportRoutes = require("./routes/report");
const adminRoutes = require("./routes/admin");
const forumRoutes = require("./routes/forum");
const notificationRoutes = require("./routes/notification");
const reviewRoutes = require("./routes/review");
const reviewReportRoutes = require("./routes/reviewReport");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

mongoose.pluralize(null);
app.use(express.json());
app.use(cors());

const busRoutes = require("./routes/bus");
const bookingRoutes = require("./routes/booking");
const customerRoutes = require("./routes/customer");
const routeRoutes = require("./routes/route");
const savedRouteRoutes = require("./routes/savedRoute");


app.post("/v1/api/stripe-payments", async (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempontencyKey = uuidv4();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "inr",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.use(busRoutes);
app.use(bookingRoutes);
app.use(customerRoutes);
app.use(routeRoutes);
app.use(savedRouteRoutes);
const bookingHireRoutes = require("./routes/bookinghire");
app.use(bookingHireRoutes);

const busServiceRoutes = require("./routes/busservice");
app.use(busServiceRoutes);
app.use(authRoutes);
app.use(postRoutes);
app.use(likeRoutes);
app.use(commentRoutes);
app.use(reportRoutes);
app.use(adminRoutes);
app.use(forumRoutes);
app.use(notificationRoutes);
app.use(reviewRoutes);
app.use(reviewReportRoutes);

const connect = () => {
  const db = mongoose.connection; // Get the mongoose connection object

  // Listen to events on the mongoose connection
  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  db.once('open', () => {
    console.log('MongoDB connection established.');
  });

  const dbUri =
    process.env.DATABASE_LOCAL ||
    (process.env.DATABASE
      ? process.env.DATABASE.replace(
          "VhU4ah3VjUeP2zMK",
          process.env.DATABASE_PASSWORD || ""
        )
      : "mongodb://127.0.0.1:27017/redbus");

  return mongoose.connect(dbUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

const port = process.env.PORT || 3020;
let host = process.env.HOST;

const start = async () => {
  await connect().then(()=>console.log("Database connected")).catch((err)=>console.log(err));
  app.listen(port, host, ()=>console.log("Server is running"));
};
start();
