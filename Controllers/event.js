
import status from 'http-status';
import stripePackage from 'stripe';
import EventSchema from '../Models/eventSchema';
import Buy from '../Models/buyschema';
import PaymentSchema from '../Models/paymentSchema';
import Notification from '../Models/notificationschema';


const applySortingAndPagination = async (query, sortBy, page, perPage) => {
	try {
	  const sortOptions = {};
	  if (sortBy === 'date') {
		sortOptions.date = 1; // Sort by date in ascending order
	  }
	  const totalEvents = await EventSchema.countDocuments(query);
	  const totalPages = Math.ceil(totalEvents / perPage);
  
	  const events = await EventSchema.find(query)
		.sort(sortOptions)
		.skip((page - 1) * perPage)
		.limit(perPage);
  
	  return {
		events,
		totalPages,
		currentPage: page,
	  };
	} catch (error) {
	  throw new Error('An error occurred while fetching events.');
	}
  };
  
  const getEventsWithSortingAndPagination = async (req, res) => {
	try {
	  const { category, sort, page, limit } = req.query;
  
	  const query = {};
	  if (category) {
		query.category = category;
	  }
  
	  const pageNumber = parseInt(page, 10) || 1;
      const perPage = parseInt(limit, 10) || 10;

  
	  const result = await applySortingAndPagination(query, sort, pageNumber, perPage);
  
	  res.status(status.OK).json(result);
	} catch (error) {
	  res.status(status.INTERNAL_SERVER_ERROR).json({
		Message: 'An error occurred while fetching events.',
		error,
	  });
	}
  };
  
 const getEvents = (req, res) => {
  EventSchema.find()
    .then(events => {
      if (events.length === 0) {
        // If no clothes are found, send a specific message
        res.status(status.OK).send({
          Message: 'No clothes found.',
        });
      } else {
        // If clothes are found, send the list of clothes
        res.status(status.OK).send(events);
      }
    })
    .catch(err => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        Message: 'Internal server error occurred while fetching clothes.',
        Error: err,
      });
    });
};

  const addEvent = (req, res) => {
	const { name, price, description } = req.body;
  
	const event = new EventSchema({
	  name,
	  price,
	  description,
	  addedBy: req.user_id, 
	});
  
	event
	  .save()
	  .then(savedEvent => {
		res.status(status.OK).send({
		  savedEvent,
		  Message: 'Clothe Added Successfully',
		  type: status.OK,
		});
	  })
	  .catch(err => {
		res.status(status.INTERNAL_SERVER_ERROR).send({
		  Message: status.INTERNAL_SERVER_ERROR,
		  err,
		});
	  });
  };
  

const deleteEvent = (req, res) => {
	const { id } = req.params;
	EventSchema.findByIdAndRemove(id, (err, result) => {
		if (result) {
			res.status(status.OK).send({
				Message: 'item Deleted Successfully.',
			});
		} else {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Delete.',
				err,
			});
		}
	});
};

const editEvent = (req, res) => {
	const { id } = req.params;
	const query = { $set: req.body };
	EventSchema.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
		if (err) {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Update.',
			});
		} else {
			res.status(status.OK).send({
				Message: 'Successfully Updated.',
				result,
			});
		}
	});
};

const getSingleEvent = (req, res) => {
	const { id } = req.params;
  
	const query = { _id: id };
  
	EventSchema.findOne(query)
	  .then(event => {
		if (!event) {
		  return res.status(status.NOT_FOUND).send({
			Message: 'Event not found',
		  });
		}
		return res.status(status.OK).send(event);
	  })
	  .catch(err => {
		console.error(err); // Log the error for debugging purposes
		return res.status(status.INTERNAL_SERVER_ERROR).send({
		  Message: 'Internal Server Error',
		});
	  });
  };



 
  // Controller to retrieve a specific buy entry by ID
 

  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
    
const addPayment = async (req, res) => {
	try {
	  const { amount, currency } = req.body;
  
	  // Create a payment intent
	  const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency,
		payment_method_types: ['card'],
	  });
  
	  // Create a new PaymentSchema instance and save it to your database
	  const payment = new PaymentSchema({
		paymentIntentId: paymentIntent.id,
		amount: paymentIntent.amount,
		currency: paymentIntent.currency,
		paymentStatus: paymentIntent.status,
	  });
  
	  await payment.save();
  
	  // Send a success response to the client
	  res.status(200).send({
		clientSecret: paymentIntent.client_secret,
		message: 'Payment deducted successfully',
	  });
	} catch (err) {
	  // Handle errors and send an error response to the client
	  console.error('Payment Error:', err);
	  res.status(500).send({
		message: 'Internal server error',
		error: err.message,
	  });
	}
  };


	  const buyItem = async (req, res) => {
		try {
		  const { itemId, quantity, price } = req.body; // Assuming you send these fields in the request body
	  
		  // Validate the request data
		  if (!itemId || !quantity || !price) {
			return res.status(400).json({ error: 'Please provide itemId, quantity, and price.' });
		  }
	  
		  // Create a new Buy document
		  const buy = new Buy({
			itemId,
			quantity,
			price,
		  });
	  
		  // Save the Buy document to the database
		  const savedBuy = await buy.save();
	  
		  // Respond with the saved Buy document
		  return res.status(201).json(savedBuy);
		} catch (error) {
		  console.error('Error buying item:', error);
		  return res.status(500).json({ error: 'Internal Server Error' });
		}
	  };

	  const postNotifications = async (req, res) => {
		try {
		  const { notificationName, notification } = req.body;
	  
		  // Assuming that your notificationSchema model includes the fields 'notificationName' and 'notification'
		  const snowDrops = new Notification({
			notificationName,
			notification,
		  });
	  
		  const savedNotification = await snowDrops.save();
	  
		  res.status(200).json(savedNotification);
		} catch (error) {
		  console.error('Error saving events:', error);
		  res.status(500).json({
			message: 'Error saving events',
			error: error.message, // Include the error message for debugging purposes
		  });
		}
	  };
	  
	  

		export default {
            postNotifications,
			addPayment,
			buyItem,
			getEvents,
			addEvent,
			deleteEvent,
			editEvent,
			getSingleEvent,
			getEventsWithSortingAndPagination,
		  };