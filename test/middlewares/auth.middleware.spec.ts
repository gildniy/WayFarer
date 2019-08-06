// import { validateAuthToken } from "../../server/api/middlewares/validators";
// import { createMocks } from "../common.test";

describe('Authorization middleware', () => {

    // let req, res;

    // beforeEach('', done => {
    //     req = httpMocks.createRequest();
    //     res = httpMocks.createResponse();
    //     done();
    // });

    context('user not authenticated', () => {
        it('should throw 403 Unauthorized action error', () => {

        })
    });
    context('user is authenticated', () => {
        it('should allow user to the action', () => {

        })
    });
});
