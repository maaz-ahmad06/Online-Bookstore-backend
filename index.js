const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for /customer routes
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
    let token = null;

    // Check session authorization
    if (req.session && req.session.authorization) {
        token = req.session.authorization['accessToken'];
    }

    // Also support Bearer token from headers for cURL/Postman convenience
    if (!token && req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }
    }

    if (token) {
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                // Ensure session has username if passed via token
                if (!req.session.authorization) {
                    req.session.authorization = {
                        accessToken: token,
                        username: user.username
                    };
                }
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated: Invalid or expired token" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in: Access token required" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
