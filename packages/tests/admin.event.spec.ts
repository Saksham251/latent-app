import { describe, expect, it, test } from 'vitest';
import {axios} from "./axios";

const BACKEND_URL = "http://localhost:8080";


describe('events', () => {
  it("Cannot create an event with incorrect location",async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/event/create`,{
        name: "Live event latent fest",
        description: "Latent fest is a premere fest for members",
        startTime: "2022-10-10 10:00:00",
        locationId: "123",
        imageUrl: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    });
    expect(response).toBe(411);
  });
   it("Can create an event with correct location",async()=>{
    const locationResponse = await axios.post(`${BACKEND_URL}/api/v1/location/create`,{
        name:  "Delhi",
        description:"Delhi, the capital of the country",
        imageUrl:"https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/event/create`,{
        name: "Live event latent fest",
        description: "Latent fest is a premere fest for members",
        startTime: "2022-10-10 10:00:00",
        locationId: "123",
        imageUrl: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    });
    expect(response).toBe(200);
  });
})
