const express  = require('express');
const stripe = require('stripe')('your_stripe_secret_key_goes_here');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//HandleBars Middleware

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set the static folder
app.use(express.static(`${__dirname}/public`));

//Index Route
app.get('/', (req, res) =>	{
	res.render('index');
});



//charge route
app.post('/charge', (req, res) => {
	const amount = 2500;
	//console.log(req.body);
	//res.send('TEST');

	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken
	})
	.then(customer => stripe.charges.create({
		amount,
		description: 'Web Development EBook',
		currency: 'usd',
		customer: customer.id
	}))
	.then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port  ${port}`);
});

