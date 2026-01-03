import { describe, expect, it, test } from 'vitest';
import {axios} from "./axios";
import { getRandomNumber } from './utils/number';

const BACKEND_URL = "http://localhost:8080";

const NAME_1 = "SAKSHAM";
const PHONE_NUMBER_1 = getRandomNumber(10);

describe("Admin Signin endpoints",()=>{
    it("Signin does not work for admin does not exist in db",async ()=>{
        const response1 = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`,{
            number:PHONE_NUMBER_1
        });
        expect(response1.status).toBe(411);
    });
    it('Signin works for admin', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/test/create-admin`, {
            number: PHONE_NUMBER_1,
            name: "Samay",
        })

        const responseSignin = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`,{
            number: PHONE_NUMBER_1
        });
        expect(response.status).toBe(200);
        expect(response.data.token).not.toBeNull();
        expect(responseSignin.status).toBe(200);
        expect(responseSignin.data.token).not.toBeNull();
    });
});