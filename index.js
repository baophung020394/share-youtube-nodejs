const express = require("express");
const path = require('path');
const PORT = 8000;
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://baophung:Bao123456@shareyoutube.tbcdk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true, useNewUrlParser: true,  useUnifiedTopology: true})

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());




app.post('/api/register', async (req, res) => {
  console.log('req', req.body)
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server up at ${PORT}`);
})