import { beforeAll, describe, expect, it } from 'vitest';
import {axios} from "./axios";
import { getRandomNumber } from './utils/number';

const BACKEND_URL = "http://localhost:8080";


describe('events', () => {
  let token = "";
  let superAdminToken = "";
  beforeAll(async ()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/test/create-admin`,{
      number: getRandomNumber(10),
      name: "Samay",
    });
    const superAdminResponse = await axios.post(`${BACKEND_URL}/api/v1/test/create-super-admin`,{
      number: getRandomNumber(10),
      name: "Samay",
    });
    token = response.data.token;
    superAdminToken = superAdminResponse.data.token;
  });
  it("Cannot create an event with incorrect location",async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/admin/event`,{
        name: "Live event latent fest",
        description: "Latent fest is a premere fest for members",
        startTime: "2022-10-10 10:00:00",
        locationId: "123",
        banner: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        seats: []
    },{
      headers:{
        Authorization:`${token}`
      }
    });
    expect(response.status).toBe(500);
  });

  it("Can create an event with correct location",async()=>{
    const locationResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/location`,{
        name:  "Delhi",
        description:"Delhi, the capital of the country",
        imageUrl:"https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    },{
      headers:{
        Authorization:`${superAdminToken}`
      }
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/admin/event`,{
        name: "Live event latent fest",
        description: "Latent fest is a premere fest for members",
        startTime: "2022-10-10 10:00:00",
        locationId: locationResponse.data.id,
        banner: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        seats: []
    },{
      headers:{
        Authorization:`${token}`
      }
    });
    expect(response.status).toBe(200);
  });

  it("Cant create an event unauthenticated",async()=>{
    const locationResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/location`,{
      name:  "Delhi",
      description:"Delhi, the capital of the country",
      imageUrl:"https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/admin/event`,{
        name: "Live event latent fest",
        description: "Latent fest is a premere fest for members",
        startTime: "2022-10-10 10:00:00",
        locationId: locationResponse.data.id,
        banner: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    });
    expect(response.status).toBe(401);
  });
})
