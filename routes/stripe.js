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


/*router.post("/create-checkout-session", async (req, res) => {
  console.log("es tu la pour")
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(req.body.cartItem),
    },
  });

 
  const line_items = req.body.cartItem.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          imageUrl: item.image,
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
   
    
    phone_number_collection: {
      enabled: false,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: "https://backend-stripe-payment-production.up.railway.app/stripe/checkout-success",
    cancel_url:  "https://backend-stripe-payment-production.up.railway.app/stripe/cancel",
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
});*/

router.post('/create-checkout-session', async(req,res)=>{
  const session = await stripe.checkout.sessions.create({
    line_items:[
      {
         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
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