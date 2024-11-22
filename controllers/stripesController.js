const stripe = require('stripe')(process.env.PRIVATE_STRIPE_ACCESS_TOKEN_TEST);
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async payment_sheet(req,res){
        // Use an existing Customer ID if this is a returning customer.
        const amount = req.body.amount
        //console.log("amount",amount)
        const customer = await stripe.customers.create();
        //console.log("customer",customer)
        const ephemeralKey = await stripe.ephemeralKeys.create(
          {customer: customer.id},
          {apiVersion: '2024-09-30.acacia'}
        );
        //console.log("ephemeralKey",ephemeralKey)


        const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'MXN',
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        }});
        //console.log("paymentIntent",paymentIntent)
        if(paymentIntent.statusCode!=400){
            console.log("aqui")
            const data = {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: process.env.PUBLISH_STRIPE_PUBLISH_KEY
            }
            //console.log("data",data)
            return res.status(201).json({
                success: true,
                message: 'paymentIntent Exitoso',
                data: data
            });
        }else{
            console.log("aca")
            return res.status(501).json({
                success: false,
                message: 'Credenciales erroneas paymentIntent',
                error: ""
            });
        }
    
    }
}