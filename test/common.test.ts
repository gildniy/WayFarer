// https://techbrij.com/node-rest-api-testing-mocha-sinon-chai

import Server from "../server";

export const request = require('supertest');
export const writeJSONFile = require("../server/api/helpers/helper").writeJSONFile;
export const defaultLoginUser = { email: "user2@site.com", password: "password" };
export const adminLoginUser = { email: "user1@site.com", password: "password" };
export const chai = require("chai");
export const sinon = require('sinon');
export const sinonChai = require('sinon-chai');
export const should = chai.should();
export const expect = chai.expect;
export const httpMocks = require('node-mocks-http');
export const spy = sinon.spy();
export const res = httpMocks.createResponse();
export const loginUserToken = loginObject => {
    return new Promise(resolve => {
        request(Server)
            .post(`${ process.env.API_BASE }/auth/signin`)
            .send(loginObject)
            .end((err, res) => {
                resolve(res.body.data ? res.body.data.token : '');
            });
    });
};
