import client from "../container/client";
import { userQuery } from "./data";

const fetchUser = async () => {
        try {
                const authToken = localStorage.getItem('userID') !== undefined ? localStorage.getItem('userID') : localStorage.clear();
                const query = userQuery(authToken && authToken);

                const user = await client.fetch(query);
                // console.log("Fetched user:", user[0]); // Log the user object for inspection
                return user[0];
        } catch (error) {
                console.error("Error fetching user:", error);
                return null;
        }
};

export default fetchUser;
