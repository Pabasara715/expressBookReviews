const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  return res.status(200).json({ message: "User logged Successfully" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;
  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  if (bookIndex !== -1) {
    const existingReviewIndex = books[bookIndex].reviews.findIndex(
      (review) => review.username === username
    );
    if (existingReviewIndex !== -1) {
      books[bookIndex].reviews[existingReviewIndex] = { username, review };
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      books[bookIndex].reviews.push({ username, review });
      return res.status(201).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
