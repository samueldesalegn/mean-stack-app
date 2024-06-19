const { faker } = require("@faker-js/faker");

async function create100Medications() {
	const email = faker.internet.email();
	const password = faker.internet.password();
	const user = await fetch("http://localhost:3000/users/signup", {
		method: "POST",
		body: JSON.stringify({
			fullname: faker.person.fullName(),
			email,
			password,
		}),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.catch(console.error);

	// sign in
	const { data: token } = await fetch("http://localhost:3000/users/signin", {
		method: "POST",
		body: JSON.stringify({ email, password }),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	}).then((res) => res.json());

	for (let i of Array(1000).fill(0)) {
		const medication = await fetch("http://localhost:3000/medications", {
			method: "POST",
			body: JSON.stringify({
				name: faker.commerce.productName(),
				generic_name: faker.commerce.productName(),
				medication_class: faker.commerce.productName(),
				availablility: faker.helpers.arrayElement([
					"Available",
					"Not Available",
				]),
				added_by: {
					user_id: user._id,
					fullname: user.fullname,
					email: user.email,
				},
				description: faker.commerce.productDescription(),
				// first_letter: name[0].toUpperCase(),
			}),
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.catch(console.error);

		console.log("Medication: ", JSON.stringify(medication), " created");
	}

	console.log("Done creating user and medications");
}

create100Medications();