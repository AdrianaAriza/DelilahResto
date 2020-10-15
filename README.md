# DelilahResto Project

## Description

This is the final project for the Acamica web-full-stack development course.
This API is the representation for a restaurant, where you can see all the allowed dishes (products), check orders, and users.

-This API expose three main endpoints: 

    - http://localhost:3000/users
    - http://localhost:3000/products
    - http://localhost:3000/orders

You can access to each of this endpoints by logging in and getting an access token.
Through http://localhost:3000/users/login endpoint. Depending or your profile (admin/user) you can access to different endpoints and execute different request. All the endpoints allow CRUD (create, read, update and delete).

Please check this postman collection to understand better how the API works and its access points.
    - https://www.getpostman.com/collections/13b38b478db5428c7795   

## Requirement 
Before starting, you should have installed:

    - mysql
    - nodejs
    
## How to use the Project locally 🔧

1. Clone the repository: 

   `git clone https://github.com/AdrianaAriza/DelilahResto.git`

2. Go to project folder:

   `cd DelilahResto`

3. Install the dependencies:

   `npm install`

4. Set database:

   `mysql -u <user> -p < delilah_resto.sql`

   Replace the "user" for your mysql user, run the command and enter your mysql password, if you do not have password just delete the -p option from the above command.

5. Run the server executing:

     `npm start`
  
6. Ready to use:

   Open the postman collection and start exploring the API making requests.
ts as a normal user and as an admin user.

- http://localhost:8000/api/"pokemon-name"
- http://localhost:8000/create-family/"family-id"

## Deployment 📦
- [expressjs](https://expressjs.com/) - server 
- [nodejs v12.18.3](https://nodejs.org/en/) - backend
- [mysql](https://www.mysql.com/) - DataBase
- [Heroku](www.heroku.com) - Deploy

## Others 📦
- [Postman](https://www.getpostman.com/collections/13b38b478db5428c7795)

## Author ✒️

- [Adriana Ariza](https://www.linkedin.com/in/laab/)
