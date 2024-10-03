require('dotenv').config();
const { Pool } = require('pg');
const connectionString = process.env.DB_URL;




const pool = new Pool({

  connectionString,
});

pool.connect((err, pool) => {
  if (err) {
    console.error("Pool error: ", err.message, err.stack);
    return;
  }
  console.error("Pool connected on: ", pool.user);
});
module.exports = pool;

const createTable = () => {
  pool
    .query(`

     
    CREATE TABLE roles (
        id SERIAL NOT NULL,
        role VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    );
    
   
    CREATE TABLE permissions (
        id SERIAL NOT NULL,
        permission VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    );
    
 
    CREATE TABLE role_permission (
        id SERIAL NOT NULL,
        role_id INT,
        permission_id INT,
        FOREIGN KEY (role_id) REFERENCES roles (id),
        FOREIGN KEY (permission_id) REFERENCES permissions (id),
        PRIMARY KEY (id)
    );
     
   
    CREATE TABLE specializations (
        id SERIAL NOT NULL,
        specialization VARCHAR(255),
        image VARCHAR(255),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id)
    );


    CREATE TABLE users (
        id SERIAL NOT NULL,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        phone_number VARCHAR(15),
        whatsapp_number VARCHAR(15),
        email VARCHAR(255),
        city VARCHAR(255),
        location VARCHAR(255),
        age INT,
        gender VARCHAR(255),
        image VARCHAR(255),
        specialization_id INT,
        years_experience INT,
        about VARCHAR(255),
        start_time TIME,
        end_time TIME,
        review_time TIME,
        day_off INT,
        role_id INT,
        rate INT,
        cost INT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (role_id) REFERENCES roles (id),
        FOREIGN KEY (specialization_id) REFERENCES specializations (id)
    );
    
  
  
    
   
    CREATE TABLE feedbacks (
        id SERIAL NOT NULL,
        user_id INT,
        doctor_id INT,
        feedback VARCHAR(255),
        rate INT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
    );
    
   
    CREATE TABLE statuses (
        id SERIAL NOT NULL,
        status VARCHAR(255),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id)
    );
    
    CREATE TABLE bookings (
        id SERIAL NOT NULL,
        doctor_id INT,
        patient_id INT,
        booking_time TIMESTAMP DEFAULT NOW(),
        status_id INT,
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (status_id) REFERENCES statuses (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id),
        FOREIGN KEY (patient_id) REFERENCES users (id)
    );
    
   
    CREATE TABLE advertisements (
        id SERIAL NOT NULL,
        doctor_id INT,
        url VARCHAR(255),
        image VARCHAR(255),
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
    );
    
   
    CREATE TABLE children (
        id SERIAL NOT NULL,
        name VARCHAR(255),
        parent_id INT,
        patient_id INT,
        doctor_id INT,
        image VARCHAR(255),
        pregnancy_date DATE,
        date_of_birth TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        is_deleted SMALLINT DEFAULT 0,
        PRIMARY KEY (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id),
        FOREIGN KEY (patient_id) REFERENCES users (id)
    );
    
      
    `
    )
    .then((result) => {
      console.log(result, result);
    })
    .catch((err) => {
      console.log(err);
    });
};


const insertData = () => {
  pool
    .query(`
    INSERT INTO roles(role) VALUES ('USER');
    INSERT INTO roles(role) VALUES ('DOCTOR');
    INSERT INTO roles(role) VALUES ('ADMIN');
    `
    )
    .then((result) => {
      console.log(result, result);
    })
    .catch((err) => {
      console.log(err);
    });
};

//   createTable();
//   insertData();