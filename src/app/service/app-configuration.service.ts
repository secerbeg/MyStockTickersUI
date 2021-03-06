/**
 * Created by mike on 10/22/2016.
 */
import { Injectable } from "@angular/core";

@Injectable()
export class AppConfigurationService
{
    private ADMIN_USER_ID = 'efbfbd6f-efbf-bdef-bfbd-3cefbfbd11ef';
    //private baseURL = "https://localhost:8443";
    private baseURL = "http://localhost:8080";


    /**
     * Get the admin user id;
     * @returns {number}
     */
    public getAdminUserId(): string
    {
        return this.ADMIN_USER_ID;
    }

    /**
     * Get the base url which includes the transport, host, and port
     * @returns {any}
     */
    public getBaseURL(): string
    {
        return this.baseURL;
    }
}
