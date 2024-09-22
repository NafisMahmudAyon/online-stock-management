// utils/jwt.js

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export const generateToken = (user) => {
	return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) return reject(err);
			resolve(decoded);
		});
	});
};
