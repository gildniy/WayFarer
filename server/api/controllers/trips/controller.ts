// [GET - 1] / [PATCH]
import { Request, Response } from "express";
import TripsService          from "../../services/trips.service";

interface TripBodySuccessResponse {
    code: number,
    response: string | {
        status: string,
        data: {
            trip_id: number
            seating_capacity: number,
            origin: string,
            destination: string,
            trip_date: Date,
            fare: number
        }
    }
}

interface TripsBodySuccessResponse {
    code: number,
    response: {
        status: string,
        data: [{
            trip_id: number
            seating_capacity: number,
            origin: string,
            destination: string,
            trip_date: Date,
            fare: number
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
    showTrips(req: Request, res: Response): any {
        TripsService.all()
                    .then((r: TripsBodySuccessResponse) => res.status(r.code).send(r.response))
                    .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response));
    }

    showTrip(req: Request, res: Response): any {
        const tripId = req.params.tripId * 1;
        TripsService.byId(tripId)
                    .then((r: TripBodySuccessResponse) => res.status(r.code).send(r.response))
                    .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response)
                    );
    }

    createTrip(req: Request, res: Response): any {
        const tripObj = req.body;
        TripsService.create(tripObj)
                    .then((r: TripBodySuccessResponse) => res.status(r.code).send(r.response))
                    .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response));
    }

    cancelTrip(req: Request, res: Response): any {
        const id = req.params.tripId * 1;
        TripsService.edit(id)
                    .then((r: TripBodySuccessResponse) => res.status(r.code).send(r.response))
                    .catch((e: BodyErrorResponse) => res.status(e.code).send(e.response));
    }
}

export default new Controller();
