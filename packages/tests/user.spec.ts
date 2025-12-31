import { describe, expect, it, test } from 'vitest';
import {axios} from "./axios";

const BACKEND_URL = "http://localhost:8080";

const NAME_1 = "SAKSHAM";
const NAME_2 = "SAKSHI"

const PHONE_NUMBER_1 = "Saksham@1103";
const PHONE_NUMBER_2 = "Sakshi@1103";

describe("Signup endpoints", () => {
    it('Double signup does not work', async () => {
        const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            number:PHONE_NUMBER_1
        });
        const response2 = await axios.post(`${BACKEND_URL}/api/v1/user/signup/verify`,{
            number: PHONE_NUMBER_1,
            username:NAME_1,
            otp:"000001"
        });

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response1.data.id).toBeDefined();
    })

});


describe("Signin endpoints",()=>{
    it("Signin works as expected",async ()=>{
        const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            number:PHONE_NUMBER_1
        });
        const response2 = await axios.post(`${BACKEND_URL}/api/v1/user/signin/verify`,{
            number: PHONE_NUMBER_1,
            username:NAME_1,
            otp:"000001"
        });
        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response1.data.id).not.toBeNull();
        expect(response2.data.token).not.toBeNull();
    });
    it("Signin does not work for the user does not exist in db",async ()=>{
        const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            number:PHONE_NUMBER_1+"123"
        });
        expect(response1.status).toBe(411);
    });
});