const db_pool = require('./index');
const sql_format = require('pg-format');

async function getAll() {
    const query = 'SELECT * FROM bookings'

    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
    } catch(e){
        console.log(`Error queuerying for all bookings. Error message: ${e}`);
        throw Error(`Error queuerying for all bookings. Error message: ${e}`);
    } finally{
        client.release();
    }
    
    return query_result;
}

async function getById(id) {
    const query = sql_format('SELECT * FROM bookings WHERE id = %L', id);

    
    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
    } catch(e){
        console.log(`Error querying for user with id: ${id}. Error message: ${e}`);
        throw Error(`Error querying for user with id: ${id}`)
    } finally{
        client.release();
    }

    
    return query_result;
}


async function getByRestaurant(restaurant) {
    const query = sql_format('SELECT * FROM bookings WHERE booking_restaurant = %L', restaurant);

    
    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
        
    } catch(e){
        console.log(`Error querying for user with restaurant: ${restaurant}. Error message: ${e}`);
        throw Error(`Error querying for user with restaurant: ${restaurant}`)
    } finally{
        client.release();
    }

    return query_result.rows;
}



async function getByDate(restaurant) {
    const query = sql_format('SELECT * FROM bookings WHERE booking_restaurant = %L', restaurant);

    
    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
        
    } catch(e){
        console.log(`Error querying for user with restaurant: ${restaurant}. Error message: ${e}`);
        throw Error(`Error querying for user with restaurant: ${restaurant}`)
    } finally{
        client.release();
    }

    return query_result.rows;
}


async function insertUser(restaurant, password, role, email) {
    const query = sql_format(
        'INSERT INTO bookings (restaurant, password, role, email) VALUES (%L,%L,%L,%L)',
        restaurant, password, role, email
    )
    

    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
    }catch(e) {
        console.log(`Error inserting user with restaurant: ${restaurant}. Error message: ${e}`);
        throw Error(`Error inserting user with restaurant: ${restaurant}. Error message: ${e}`);
    }finally {
        client.release();
    }
    
    return;   
}

async function deleteByID(id) {
    const query = sql_format(
        'DELETE FROM bookings WHERE id = %L',
        id
    )
    

    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
    }catch(e) {
        console.log(`Error inserting user with restaurant: ${restaurant}. Error message: ${e}`);
        throw Error(`Error inserting user with restaurant: ${restaurant}. Error message: ${e}`);
    }finally {
        client.release();
    }
    
    return;   
   
}


const Bookings = {
    getAll: getAll,
    getById: getById,
    getByDate: getByDate,
    getByRestaurant: getByRestaurant,
    insertUser: insertUser,
    deleteByID: deleteByID
};

module.exports = Bookings;