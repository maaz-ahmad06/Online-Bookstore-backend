const axios = require('axios');

async function testAll() {
    const baseURL = 'http://localhost:5000';
    console.log("=== Testing Online Bookstore Backend Endpoints ===\n");

    // Task 2: Get all books
    try {
        const res2 = await axios.get(`${baseURL}/`);
        console.log("--- Task 2 (GET all books) ---");
        console.log(JSON.stringify(res2.data, null, 2));
    } catch (e) { console.error("Task 2 error:", e.message); }

    // Task 3: Get book by ISBN
    try {
        const res3 = await axios.get(`${baseURL}/isbn/1`);
        console.log("\n--- Task 3 (GET book by ISBN 1) ---");
        console.log(JSON.stringify(res3.data, null, 2));
    } catch (e) { console.error("Task 3 error:", e.message); }

    // Task 4: Get books by Author
    try {
        const res4 = await axios.get(`${baseURL}/author/Jane Austen`);
        console.log("\n--- Task 4 (GET books by Author 'Jane Austen') ---");
        console.log(JSON.stringify(res4.data, null, 2));
    } catch (e) { console.error("Task 4 error:", e.message); }

    // Task 5: Get books by Title
    try {
        const res5 = await axios.get(`${baseURL}/title/Pride and Prejudice`);
        console.log("\n--- Task 5 (GET books by Title 'Pride and Prejudice') ---");
        console.log(JSON.stringify(res5.data, null, 2));
    } catch (e) { console.error("Task 5 error:", e.message); }

    // Task 6: Get book review
    try {
        const res6 = await axios.get(`${baseURL}/review/1`);
        console.log("\n--- Task 6 (GET book review for ISBN 1) ---");
        console.log(JSON.stringify(res6.data, null, 2));
    } catch (e) { console.error("Task 6 error:", e.message); }

    // Task 7: Register user
    try {
        const res7 = await axios.post(`${baseURL}/register`, {
            username: "learner_user",
            password: "password123"
        });
        console.log("\n--- Task 7 (Register new user) ---");
        console.log(JSON.stringify(res7.data, null, 2));
    } catch (e) { console.error("Task 7 error:", e.response ? e.response.data : e.message); }

    // Task 8: Login user
    let token = "";
    try {
        const res8 = await axios.post(`${baseURL}/customer/login`, {
            username: "learner_user",
            password: "password123"
        });
        token = res8.data.token;
        console.log("\n--- Task 8 (Login user) ---");
        console.log(JSON.stringify(res8.data, null, 2));
    } catch (e) { console.error("Task 8 error:", e.response ? e.response.data : e.message); }

    // Task 9: Add review
    try {
        const res9 = await axios.put(`${baseURL}/customer/auth/review/1?review=This is a fantastic classic novel!`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("\n--- Task 9 (Add/Modify Review) ---");
        console.log(JSON.stringify(res9.data, null, 2));
    } catch (e) { console.error("Task 9 error:", e.response ? e.response.data : e.message); }

    // Task 10: Delete review
    try {
        const res10 = await axios.delete(`${baseURL}/customer/auth/review/1`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("\n--- Task 10 (Delete Review) ---");
        console.log(JSON.stringify(res10.data, null, 2));
    } catch (e) { console.error("Task 10 error:", e.response ? e.response.data : e.message); }
}

testAll();
