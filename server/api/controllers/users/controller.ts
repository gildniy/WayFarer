import { Request, Response } from "express";
import UsersService          from "../../services/users.service";
import * as jwt              from 'jsonwebtoken';
import { Constants }         from "../../helpers/constants";

interface UserBodySuccessResponse {
    code: number,
    response: {
        status: string,
        data: {
            token: string
            first_name: string,
            last_name: string,
            email: string
        }
    }
}

interface BodyErrorResponse {
    code: number,
    response: {
        status: string,
        error: string
    }
}

const buildResult = (res, result): void => {

    const email = result.response.data.email;

    const users = require('../../data/users');
    const is_admin = users.filter(user => user.email === email)[0].is_admin;
    const user_id = users.filter(user => user.email === email)[0].id;

    const payload = { email, is_admin, user_id };

    const options = Constants.jwtOptions;

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret, options);

    result.response.data.token = !!result && !!result.response && !!result.response.data && token;
    res.status(result.code).send(result.response);
};

class Controller {

    signinUser(req: Request, res: Response): any {

        UsersService.login(req.body).then(async (result: UserBodySuccessResponse) => {
            buildResult(res, result);
        }).catch((error: BodyErrorResponse) => res.status(error.code).send(error.response));
    }

    signupUser(req: Request, res: Response): any {

        UsersService.create(req.body).then((result: UserBodySuccessResponse) => {
            buildResult(res, result);
        }).catch((error: BodyErrorResponse) => res.status(error.code).send(error.response));
    }
}

export default new Controller();
