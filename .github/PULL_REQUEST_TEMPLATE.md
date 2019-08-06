#### What does this PR do?
Having the CRUD on Resources EndPoints in WayFarer RESTAPI
#### Description of Task to be completed?
Have the following endpoints working
`POST /api/v1/auth/signin/`
`POST /api/v1/auth/signup/`
`GET /api/v1/trips/`
`POST /api/v1/trips/`
`GET /api/v1/trips/:tripId/`
`PATCH /api/v1/trips/:tripId/cancel`
`POST /api/v1/bookings/`
`GET /api/v1/bookings/`
`DELETE /api/v1/bookings/:bookingId`
#### How should this be manually tested?
After cloning the repo, cd into it and run `npm start`
- Using Postman test `POST /api/v1/auth/signin/` by setting the body as `{"email": "user1@site.com"}` for an admin user and `{"email": "user2@site.com"}` for a regular user
- Using Postman test `POST /api/v1/auth/signup/` by setting the body as `{ "email": "user10@site.com", "password": "password", "first_name": "fuser10", "last_name": "luser10" }` for a regular user
- For the rest of the api they requires to set the Auth header which can be copied from the body of the signin or signup end points
- The Content type should be set to Application/json
- Using Postman test `GET /api/v1/trips/` by setting the Authorization Token obtained from the login
- Using Postman test `POST /api/v1/trips/` by setting the Authorization Token obtained from the login and the body as `{ "seating_capacity": 40, "bus_license_number": 111, "origin": "AAA", "destination": "BBB", "trip_date": "2019-07-18",  "fare": 1000 }` 
- Using Postman test `GET /api/v1/trips/:tripId/` by setting the Authorization Token obtained from the login and the tripId as `1`
- Using Postman test `PATCH /api/v1/trips/:tripId/cancel` by setting the Authorization Token obtained from the login and the tripId as `1`
- Using Postman test `POST /api/v1/bookings/` by setting the Authorization Token obtained from the login and the body as `{ "trip_id": 2, "user_id": 2 }` 
- Using Postman test `GET /api/v1/bookings/` by setting the Authorization Token obtained from the login
- Using Postman test `DELETE /api/v1/bookings/:bookingId` by setting the Authorization Token obtained from the login and the bookingId as `4`
#### What are the relevant Pivot Tracker stories?
#167279334

