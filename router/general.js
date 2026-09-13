const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * Task 7: Register a new user
 * Handles new user registration by validating username and password
 */
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user with same username already exists
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists!" });
    } else {
        users.push({ username: username, password: password });
        return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    }
});

/**
 * Task 1 & Task 10: Get the list of books available in the shop
 * Implemented using async/await with Promise
 */
public_users.get('/', async function (req, res) {
    try {
        const getBooksList = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject({ status: 404, message: "No books found" });
            }
        });
        return res.status(200).send(JSON.stringify({ books: getBooksList }, null, 4));
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Failed to fetch book list" });
    }
});

/**
 * Task 2 & Task 11: Get book details based on ISBN
 * Implemented using Promises
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookDetails = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookDetails
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(err.status || 404).json({ message: err.message }));
});

/**
 * Task 3 & Task 12: Get book details based on Author
 * Implemented using async/await with Promise
 */
public_users.get('/author/:author', async function (req, res) {
    try {
        const requestedAuthor = req.params.author.toLowerCase();
        const matchedBooks = await new Promise((resolve, reject) => {
            let result = [];
            const keys = Object.keys(books);

            keys.forEach((key) => {
                if (books[key].author.toLowerCase() === requestedAuthor) {
                    result.push({
                        isbn: key,
                        author: books[key].author,
                        title: books[key].title,
                        reviews: books[key].reviews
                    });
                }
            });

            if (result.length > 0) {
                resolve(result);
            } else {
                reject({ status: 404, message: `No books found by author '${req.params.author}'` });
            }
        });

        return res.status(200).json({ booksbyauthor: matchedBooks });
    } catch (error) {
        return res.status(error.status || 404).json({ message: error.message });
    }
});

/**
 * Task 4 & Task 13: Get all books based on Title
 * Implemented using async/await with Promise
 */
public_users.get('/title/:title', async function (req, res) {
    try {
        const requestedTitle = req.params.title.toLowerCase();
        const matchedBooks = await new Promise((resolve, reject) => {
            let result = [];
            const keys = Object.keys(books);

            keys.forEach((key) => {
                if (books[key].title.toLowerCase() === requestedTitle) {
                    result.push({
                        isbn: key,
                        author: books[key].author,
                        title: books[key].title,
                        reviews: books[key].reviews
                    });
                }
            });

            if (result.length > 0) {
                resolve(result);
            } else {
                reject({ status: 404, message: `No books found with title '${req.params.title}'` });
            }
        });

        return res.status(200).json({ booksbytitle: matchedBooks });
    } catch (error) {
        return res.status(error.status || 404).json({ message: error.message });
    }
});

/**
 * Task 5: Get book review based on ISBN
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

// =========================================================================
// Asynchronous HTTP Client Functions Using Axios (Tasks 10, 11, 12, 13)
// =========================================================================

/**
 * Task 10: Get all books using Async/Await with Axios
 * @param {string} baseURL - Server root URL
 * @returns {Promise<Object>} List of all books
 */
const getAllBooksAxios = async (baseURL = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseURL}/`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch books: ${error.message}`);
    }
};

/**
 * Task 11: Get book details by ISBN using Promise callbacks with Axios
 * @param {string|number} isbn - The ISBN of the book
 * @param {string} baseURL - Server root URL
 * @returns {Promise<Object>} Book details object
 */
const getBookByISBNAxios = (isbn, baseURL = 'http://localhost:5000') => {
    return axios.get(`${baseURL}/isbn/${isbn}`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(`Failed to fetch book with ISBN ${isbn}: ${error.message}`);
        });
};

/**
 * Task 12: Get book details by Author using Async/Await with Axios
 * @param {string} author - Author name to search for
 * @param {string} baseURL - Server root URL
 * @returns {Promise<Array>} List of books by the author
 */
const getBooksByAuthorAxios = async (author, baseURL = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseURL}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch books by author ${author}: ${error.message}`);
    }
};

/**
 * Task 13: Get book details by Title using Async/Await with Axios
 * @param {string} title - Book title to search for
 * @param {string} baseURL - Server root URL
 * @returns {Promise<Array>} List of books matching the title
 */
const getBooksByTitleAxios = async (title, baseURL = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseURL}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch books with title ${title}: ${error.message}`);
    }
};

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
