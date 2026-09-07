import { test, expect } from '@playwright/test';
import {logger} from '@utils/logger';

//CRUD Operations for Restful Booker API
interface BookingDates{
    checkin: string;
    checkout: string;
}

interface BookingPayload {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

interface AuthTokenResponse {
    token: string;
}

interface CreatedBookingResponse {
    bookingid: number;
    booking: BookingPayload;
}

interface BookingFlowState {
    token?: string;
    bookingId?: number;
}

test.describe.serial('Restful Booker API CRUD Operations', () => {
    const baseUrl = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const bookingFlowState: BookingFlowState = {};
    const payload: BookingPayload = {
        firstname: 'Nishikant',
        lastname: 'Pradhan',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: '2026-01-01',
            checkout: '2026-01-10'
        },
        additionalneeds: 'Breakfast'
    };


    test(`TC#1 @P0 - Create Token`, async ({ request }) => {
        await test.step('Create Auth Token', async () => {
            const responseData = await request.post(`${baseUrl}/auth`, {
                data: {
                    username: 'admin',
                    password: 'password123'
                }
            });

            expect(responseData.status()).toBe(200);
            const data = await responseData.json() as AuthTokenResponse;
            expect(data.token).toBeTruthy();

            bookingFlowState.token = data.token;
            logger.info(`Auth token created for CRUD flow: ${bookingFlowState.token}`);
        });

    });
    test(`TC#2 @P0 - Create Booking`, async ({ request }) => {
        await test.step('Create Booking', async () => {
            const responseData = await request.post(`${baseUrl}/booking`, {
                headers,
                data: payload,
            });

            expect(responseData.status()).toBe(200);
            const data = await responseData.json() as CreatedBookingResponse;
            expect(data.bookingid).toBeTruthy();
            expect(data.booking.firstname).toBe(payload.firstname);
            expect(data.booking.lastname).toBe(payload.lastname);

            bookingFlowState.bookingId = data.bookingid;
            logger.info(`Booking created with ID: ${bookingFlowState.bookingId}`);
        });

    });
    test(`TC#3 @P0 -Update Booking`, async ({ request }) => {
        await test.step('Update Booking', async () => {
            const token = bookingFlowState.token;;
            const bookingId = bookingFlowState.bookingId;
            if (!token || !bookingId) {
                throw new Error('Token or Booking ID is missing');
            }

            const responeData = await request.put(`${baseUrl}/booking/${bookingId}`, {
                headers: {
                    ...headers,
                    'Cookie': `token=${token}`
                },
                data: payload,
            });

            expect(responeData.status()).toBe(200);
            const data = await responeData.json() as BookingPayload;
            expect(data.firstname).toBe(payload.firstname);
            expect(data.lastname).toBe(payload.lastname);

            logger.info(`Booking updated for ID: ${bookingId} : ${data.firstname} ${data.lastname}`);
        });

    });
});