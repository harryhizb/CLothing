import status from 'http-status';

const userSignup = (req, res, next) => {
	const { password, email,  } = req.body;

	if ( !email || !password) {
		res.status(status.BAD_REQUEST);
		next(new Error('email and password Must be Defined in request body'));
	} else {
		next();
	}
};

const userSignin = (req, res, next) => {
	const { password, email } = req.body;
	if (!email || !password) {
		res.status(status.BAD_REQUEST);
		next(new Error('email and password Must be Defined in request body'));
	} else {
		next();
	}
};

export default { userSignup, userSignin };
