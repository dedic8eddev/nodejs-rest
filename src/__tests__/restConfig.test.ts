import * as express from "express";
import { logger } from "../logger";

import { RestConfigClass } from "../index";
import { ValidatedMethod } from "./mocks/ValidatedMethod";
import { Meteor } from "./mocks/Meteor";

const app = express();

const MeteorInstance = new Meteor();
let RestConfig = new RestConfigClass(app, logger);
RestConfig.setMeteor(MeteorInstance);

const method = new ValidatedMethod({
    testData: 1
});

// clean up rest config before each test
beforeEach(() => {
    RestConfig = new RestConfigClass(app, logger);
    RestConfig.setMeteor(MeteorInstance);
});

test("should build router correctly", () => {
    const router = RestConfig.buildRouter("v1", "/v1");

    expect(router).toEqual(RestConfig.getRouter("v1"));
});


test("add validated method and invoke it", () => {
    RestConfig.buildRouter("v1", "/v1");

    RestConfig.addValidatedMethod(method, {
        path: "test",
        httpMethod: "get",
        routerId: "v1"
    });
});

// function middleware(req, res) {
//     return new Promise((resolve, reject) => {
//         console.log(req.params);

//         resolve({
//             mySuperContext: 1
//         });
//     });
// }

// RestConfig.addMiddleware("test", middleware);
// RestConfig.config({
//     routerId: "v1",
//     route: "/notes/:_id",
//     method: "get",
//     middleware: "test"
// });

// RestConfig.addSchema("NotesGetRequestSchema", NotesGetRequestSchema);
// RestConfig.addSchema("NotesResponseSchema", NotesResponseSchema);

// RestConfig.config({
//     method: "get",
//     routerId: "v1",
//     route: "/notes/:_id",
//     schema: "NotesGetRequestSchema",
//     field: "request"
// });

// RestConfig.config({
//     method: "get",
//     routerId: "v1",
//     route: "/notes/:_id",
//     schema: "NotesResponseSchema",
//     field: "response"
// });

// RestConfig.config({
//     method: "get",
//     routerId: "v1",
//     route: "/notes",
//     schema: "NotesResponseSchema",
//     field: "response"
// });

// RestConfig.addValidatedMethod("v1", "get", "/notes", getNotesMethod, {});

// RestConfig.addValidatedMethod("v1", "get", "/notes/:_id", getNoteMethod, {
//     bodySrc: "params"
// });
