const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//checking for duplicates
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) {
		return res.status(400).send("Email already Registered!!");
	}

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(req.body.password, salt, async (err, hashedPwd) => {
			const user = new User({
				name: req.body.name,
				email: req.body.email,
				password: hashedPwd,
			});
			try {
				const savedUser = await user.save();
				res.send({ user: user._id, email: user.email });
			} catch (err) {
				res.status(401).send(err);
			}
		});
	});
});

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const fetchUser = await User.findOne({ email: req.body.email });
	if (!fetchUser) return res.status(400).send("Email or password is wrong!");

	const validPass = await bcrypt.compare(
		req.body.password,
		fetchUser.password
	);
	if (!validPass) return res.status(400).send("Invalid Password!");

	const token = jwt.sign({ _id: fetchUser._id }, process.env.TOKEN_SECRET);
	res.status(200).header("auth-token", token).send(token);
});

module.exports = router;
