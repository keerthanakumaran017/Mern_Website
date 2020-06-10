const stripe=require('stripe')("sk_test_51GpvBJJpqUc4Nn3gnYMR1qOXAyK7gUidlP2qTL0Oqb0HNXtr0Pb1xL7TjeMKlkoEqskxBzFz2Tjz1nBABms12izg00lU2UoGdD");
const uuid=require("uuid/v4");


exports.makepayment=(req,res)=>{
    const {products,token}=req.body;
    let amount=0;
        products.map(p=>{
            amount=amount+p.price;
        });
const idempotencyKey=uuid();
return stripe.customers.create({
    email:token.email,
    source:token.id, 
})
.then(customer=>{
    stripe.charges.create({
        amount:amount*100,
        currency:'usd',
        customer:customer.id,
        receipt_email:token.email,
        description:"a test account",
        shipping:{
            name:token.card.name,
            address:{
                line1:token.card.address_line1,
                line2:token.card.address_line2,
                city:token.card.address_city,
                country:token.card.address_country,
                postal_code:token.card.address_zip
            }
        }
    },{idempotencyKey})
    .then(result=>{res.status(200).json(result);})
    .catch(err=>{console.log(err);})
})
.catch(err=>{console.log(err)})
    
}