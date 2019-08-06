import { Request, Response } from "express";
import BookingsService       from "../../services/bookings.service";
import * as jwt              from 'jsonwebtoken';

interface BookingBodySuccessResponse {
    code: number,
    response: {
        status: string,
        data: string | {
            booking_id: number,
            bus_license_number: number,
            trip_date: Date,
            first_name: string,
            last_name: string,
            user_email: string
        }
    }
}

interface BookingsBodySuccessResponse {
    code: number,
    response: {
        status: string,
        data: [{
            booking_id: number,
            bus_license_number: number,
            trip_date: Date,
            first_name: string,
            last_name: string,
            user_email: string
        }]
    }
}


interface BodyErrorResponse {
    code: number,
    response: {
        status: string,
        error: string
    }
}

class Controller {
    showBookings(req: Request | any, res: Response): any {
        const authHeaders = req.headers['authorization'] || req.headers['Authorization'];
        const token = authHeaders.split(' ')[1];
        const decoded = jwt.decode(token);
        const email = decoded.email;
        BookingsService.all(email)
                       .then((r: BookingsBodySuccessResponse) => res.status(r.code).send(r.response))
                       .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response));
    }

    bookTrip(req: Request, res: Response): any {
        const bookingObj = req.body;
        BookingsService.create(bookingObj)
                       .then((r: BookingBodySuccessResponse) => res.status(r.code).send(r.response))
                       .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response));
    }

    deleteBooking(req: Request, res: Response): any {
        const id = req.params.bookingId * 1;
        BookingsService.delete(id)
                       .then((r: BookingBodySuccessResponse) => res.status(r.code).send(r.response))
                       .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response));
    }
}

export default new Controller();
