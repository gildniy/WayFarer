import { chai, expect, httpMocks, res, sinonChai, spy } from "../common.test";
import { validateInteger }                              from "../../server/api/middlewares/validators";

chai.use(sinonChai);

describe('Enter integer parameter middleware', () => {
    // https://gist.github.com/liaodrake/c91e6108cb7df48ba506
    // https://www.slideshare.net/morrissinger/unit-testing-express-middleware
    // https://github.com/howardabrams/node-mocks-http/issues/159
    // https://medium.com/building-ibotta/testing-arrays-and-objects-with-chai-js-4b372310fe6d

    context('parameter is not integer', () => {
        it('should prevent user from access to the action', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${ process.env.API_BASE }/bookings`,
                params: { bookingId: 'dummy-non-integer' }
            });
            validateInteger(req, res, spy);
            expect(res).to.include({ statusCode: 400 });
            expect(spy).not.called;
        })
    });

    context('parameter is integer', () => {
        it('should allow user to the action', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${ process.env.API_BASE }/bookings`,
                params: { bookingId: 1 }
            });
            validateInteger(req, res, spy);
            expect(spy).called;
        })
    });
});
