const db_pool = require('./index');
const sql_format = require('pg-format');

async function getAll() {
    const query = 'SELECT * FROM bookings'

    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
        
        // Format the time values before returning
        if (query_result.rows) {
            query_result.rows = query_result.rows.map(row => {
                if (row.booking_hour) {
                    row.booking_hour = row.booking_hour.substring(0, 5);
                }
                if (row.booking_date) {
                    row.booking_date =  row.booking_date.toISOString().substring(0, 10);
                }
                return row;
            });
        }
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


async function getAllForRestaurant(restaurant) {
    const query = sql_format('SELECT booking_date, booking_hour, booking_name, booking_guests, booking_email, booking_contact, booking_table, booking_state, booking_note FROM bookings WHERE booking_restaurant = %L', restaurant);

    
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


async function insertBooking(date, hour, name, restaurant, guests, email, contact, table, state, note, created_by){
    console.log(`Inserting booking with restaurant: ${restaurant}`);
    console.log(`Inserting booking with date: ${date}`);
    console.log(`Inserting booking with hour: ${hour}`);
    console.log(`Inserting booking with name: ${name}`);
    console.log(`Inserting booking with guests: ${guests}`);
    console.log(`Inserting booking with email: ${email}`);
    console.log(`Inserting booking with contact: ${contact}`);
    console.log(`Inserting booking with table: ${table}`);
    console.log(`Inserting booking with state: ${state}`);
    console.log(`Inserting booking with note: ${note}`);
    console.log(`Inserting booking with created_by: ${created_by}`);
    
    const query = sql_format(
        'INSERT INTO bookings (booking_date, booking_hour, booking_name, booking_restaurant, booking_guests, booking_email, booking_contact, booking_table, booking_state, booking_note,  created_by, updated_at, created_at) VALUES (%L,%L,%L,%L,%L,%L,%L,%L,%L,%L,%L,NOW(),NOW())',
        date, hour, name, restaurant, guests,email, contact, table, state, note, created_by
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




async function deleteByIDs(ids) {
    const query = sql_format(
        'DELETE FROM bookings WHERE id IN (%L)',
        ids
    )

    try{
        var client = await db_pool.connect();
        var query_result = await client.query(query);
    }catch(e) {
        console.log(`Error deleting bookings with ids: ${ids}. Error message: ${e}`);
        throw Error(`Error deleting bookings with ids: ${ids}. Error message: ${e}`);
    }finally {
        client.release();
    }
    
    return;   
   
}

async function updateBooking(id, date, hour, name, restaurant, guests, email, contact, table, state, note) {
    const query = sql_format(
        'UPDATE bookings SET booking_date = %L, booking_hour = %L, booking_name = %L, booking_restaurant = %L, booking_guests = %L, booking_email = %L, booking_contact = %L, booking_table = %L, booking_state = %L, booking_note = %L, updated_at = NOW() WHERE id = %L',
        date, hour, name, restaurant, guests, email, contact, table, state, note, id
    );

    try {
        var client = await db_pool.connect();
        await client.query(query);
    } catch(e) {
        console.log(`Error updating booking with id: ${id}. Error message: ${e}`);
        throw Error(`Error updating booking with id: ${id}. Error message: ${e}`);
    } finally {
        client.release();
    }
}

const Bookings = {
    getAll: getAll,
    getById: getById,
    getByDate: getByDate,
    getByRestaurant: getAllForRestaurant,
    insertBooking: insertBooking,
    deleteByIDs: deleteByIDs,
    updateBooking: updateBooking
};

module.exports = Bookings;