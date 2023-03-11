const { client, getAllUsers, createUser, updateUser, getUserById, createPost, updatePost, getAllPosts, getPostsByUser } = require('./index');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
            `);
            console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; 
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            );
        `);
        console.log("Finished building tables!");

        } catch (error) {
            console.error("Error building tables!");
        throw error; 
    }
}

async function createInitialUsers() {
    try {
    console.log("Starting to create users...");
    // const albert = 
    await createUser({ username: 'albert', password: 'bertie99', name: 'al', location: 'ks' });
    // console.log(albert);
    // const sandra = 
    await createUser({ username: 'sandra', password: '2sandy4me', name: 'san', location: 'tx'});
    // const glamgal = 
    await createUser({ username: 'glamgal', password: 'soglam', name: 'gla', location: 'ny'});
    


    console.log("Finished creating users!");
    } catch(error) {
    console.error("Error creating users!");
    throw error;
    }
}

async function rebuildDB() {
    try {
    client.connect();
    
    await dropTables();
    await createTables();
    await createInitialUsers();
    
    } catch (error) {
        throw error;
        // console.error(error);
    // } finally {
        // client.end();
    }
}
// rebuildDB();




async function testDB() {
    try {
        // client.connect();
        console.log("Starting to test database...");

        // const { rows } = await client.query(`SELECT * FROM users;`);
        // console.log(rows);

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("Finished database tests!");
        // console.log(users);
        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
    console.log("Result:", updateUserResult);
    } catch (error) {
        console.error("Error testing database!");
        throw error;
    // } finally {
        // client.end();
    }
}

// testDB();

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());