const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists!" });
    } else {
        users.push({ username: username, password: password });
        return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    }
});

// ==========================================
// Task 2 & Task 10: Get the book list available in the shop
// Implemented using Promise / Async-Await
// ==========================================
public_users.get('/', async (req, res) => {
    try {
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject({ status: 404, message: "No books found" });
                }
            });
        };

        const booksList = await getBooks();
        return res.status(200).send(JSON.stringify({ books: booksList }, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error: error });
    }
});

// ==========================================
// Task 3 & Task 11: Get book details based on ISBN
// Implemented using Promise / Async-Await
// ==========================================
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
                }
            });
        };

        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Error fetching book by ISBN" });
    }
});

// ==========================================
// Task 4 & Task 12: Get book details based on author
// Implemented using Promise / Async-Await
// ==========================================
public_users.get('/author/:author', async (req, res) => {
    try {
        const requestedAuthor = req.params.author.toLowerCase();
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                let matchedBooks = [];
                const keys = Object.keys(books);

                keys.forEach((key) => {
                    if (books[key].author.toLowerCase() === author) {
                        matchedBooks.push({
                            isbn: key,
                            title: books[key].title,
                            reviews: books[key].reviews
                        });
                    }
                });

                if (matchedBooks.length > 0) {
                    resolve(matchedBooks);
                } else {
                    reject({ status: 404, message: `No books found by author '${req.params.author}'` });
                }
            });
        };

        const booksByAuthor = await getBooksByAuthor(requestedAuthor);
        return res.status(200).json({ booksbyauthor: booksByAuthor });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Error fetching books by author" });
    }
});

// ==========================================
// Task 5 & Task 13: Get all books based on title
// Implemented using Promise / Async-Await
// ==========================================
public_users.get('/title/:title', async (req, res) => {
    try {
        const requestedTitle = req.params.title.toLowerCase();
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                let matchedBooks = [];
                const keys = Object.keys(books);

                keys.forEach((key) => {
                    if (books[key].title.toLowerCase() === title) {
                        matchedBooks.push({
                            isbn: key,
                            author: books[key].author,
                            reviews: books[key].reviews
                        });
                    }
                });

                if (matchedBooks.length > 0) {
                    resolve(matchedBooks);
                } else {
                    reject({ status: 404, message: `No books found with title '${req.params.title}'` });
                }
            });
        };

        const booksByTitle = await getBooksByTitle(requestedTitle);
        return res.status(200).json({ booksbytitle: booksByTitle });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Error fetching books by title" });
    }
});

// ==========================================
// Task 6: Get book review based on ISBN
// ==========================================
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

// =========================================================================
// Asynchronous helper functions using Axios and Promises / Async-Await
// (Tasks 10, 11, 12, 13 in the project specification)
// =========================================================================

// Task 10: Get all books using async/await with Axios
const getAllBooksAsync = async (baseURL = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseURL}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 11: Search by ISBN using Promises with Axios
const getBookByISBNPromise = (isbn, baseURL = 'http://localhost:5000') => {
    return axios.get(`${baseURL}/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
};

// Task 12: Search by Author using async/await with Axios
const getBooksByAuthorAsync = async (author, baseURL = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseURL}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 13: Search by Title using async/await with Axios
const getBooksByTitleAsync = async (title, baseURL = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseURL}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
