import express from 'express';
import events from '../Controllers/event';

// auth middlewares for admin
import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';
// validations
import eventValidator from '../validations/event';

const eventRouter = express.Router();

eventRouter.post('/payment',events.addPayment);

eventRouter.post('/buyItem', events.buyItem);

eventRouter.post('/notification' , events.postNotifications);

eventRouter.get('/allClothes', events.getEvents);


eventRouter.get('/selectedCloth/:id' ,events.getSingleEvent);


// only admin can delete
eventRouter.delete(
	'/deleteByAdmin/:id',
	isAdminMiddleware.isManagerOwner,
	events.deleteEvent,
);

eventRouter.post(
	'/addClothByAdmin',
	isAdminMiddleware.isManagerOwner,
	eventValidator.addEvent,
	events.addEvent,
);


eventRouter.patch('/editByAdmin/:id', isAdminMiddleware.isManagerOwner, isLoggedInUser.isLoggedIn, events.editEvent);

export default eventRouter;
