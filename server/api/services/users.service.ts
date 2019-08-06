import Promise                                         from 'bluebird';
import L                                               from '../../common/logger';
import { hashPassword, verifyPassword, writeJSONFile } from "../helpers/helper";
import { Constants }                                   from "../helpers/constants";

// const bcrypt = require('bcrypt');
const filename = '../data/users.json';
let users: User[] = require(filename);

interface User {
    id: number,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    is_admin: boolean,
}

interface UserLoginObj {
    email: string,
    password: string,
}

interface UserRegisterObj {
    email: string,
    password: string,
    first_name: string,
    last_name: string
}

class UsersService {

    create(registerObj: UserRegisterObj): Promise<any> {
        L.info(`create user with email: ${ registerObj.email }`);

        // const newId = getNewId(users);
        const user$: User = {
            ...{ id: 0 },
            ...registerObj,
            ...{ is_admin: false }
        };

        const hashedPassword = hashPassword(registerObj.password);
        const user = { ...user$, password: hashedPassword };
        const usersEmails = users.map(u => u.email);

        if (!usersEmails.includes(user.email)) {

            users.push(user);
            users.forEach((el, i) => el.id = i + 1);

            if (users.includes(user)) {
                writeJSONFile(filename, users);

                return Promise.resolve({
                    code: Constants.response.created, // 201
                    response: {
                        status: 'success',
                        data: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email
                        }
                    }
                });

            }

            return Promise.reject({
                code: Constants.response.serverError, // 500
                response: {
                    status: 'error',
                    error: 'Internal server error!'
                }
            })
        }

        return Promise.reject({
            code: Constants.response.exists, // 409
            response: {
                status: 'error',
                error: 'User with this email already exists!'
            }
        })
    }

    login({ email, password }: UserLoginObj): Promise<any> {
        L.info(`login user with email: ${ email }`);

        const userExists = users.filter(u => {
            const passwordMatch = verifyPassword(password, u.password);
            return u.email == email && passwordMatch
        })[0];

        if (userExists) {

            L.info(`Yeah the user exists!`);

            return Promise.resolve({
                code: Constants.response.found, // 302
                response: {
                    status: 'success',
                    data: {
                        first_name: userExists.first_name,
                        last_name: userExists.last_name,
                        email: userExists.email
                    }
                }
            })
        }

        L.info(`No, the user doesn't exist!`);

        return Promise.reject({
            code: Constants.response.notFound, // 404
            response: {
                status: 'error',
                error: 'User not found'
            }
        })
    }
}

export default new UsersService();
