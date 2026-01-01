import { describe, expect, it, test } from 'vitest';
import {axios} from "./axios";

const BACKEND_URL = "http://localhost:8080";

const NAME_1 = "SAKSHAM";
const PHONE_NUMBER_1 = "Saksham@1103";

describe("Admin Signin endpoints",()=>{
    it("Signin does not work for the admin does not exist in db",async ()=>{
        const response1 = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`,{
            number:PHONE_NUMBER_1+"123"
        });
        expect(response1.status).toBe(411);
    });
});