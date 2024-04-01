const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Books by author not found" });
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const book = Object.values(books).find((book) => book.title === title);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = getReviewsByISBN(isbn);
  if (bookReviews) {
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ message: "Book reviews not found" });
  }
});

function getReviewsByISBN(isbn) {
  return {
    isbn: isbn,
    reviews: [
      { user: "User 1", rating: 4, comment: "Great book!" },
      { user: "User 2", rating: 5, comment: "Excellent read!" },
    ],
  };
}

module.exports.general = public_users;
