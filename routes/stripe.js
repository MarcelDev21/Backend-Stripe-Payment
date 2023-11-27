const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET);

const router = express.Router();

const checkoutSuccessPage = fs.readFileSync(
    path.join(__dirname, 'checkout-success.html')
  );
  
  router.get("/checkout-success", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send(checkoutSuccessPage);
  });

  const checkoutCancel = fs.readFileSync(
    path.join(__dirname, 'cancel.html')
  );
  
  router.get("/cancel", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send(checkoutCancel);
  });



router.post('/create-checkout-session', async(req,res)=>{
  const session = await stripe.checkout.sessions.create({
    line_items:[
      {
         price: "pr_1234",
         quantity: 1,
      }
    ],
    mode: 'payment',
    success_url:  "https://backend-stripe-payment-production.up.railway.app/stripe/checkout-success",
    cancel_url: "https://backend-stripe-payment-production.up.railway.app/stripe/cancel",
  })
  res.send({ url: session.url });
})




module.exports = router;