import { createClient } from "@sanity/client";

const config = {
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: '2021-10-21',
    useCdn: false,
    token: process.env.REACT_APP_SANITY_PROJECT_ID,
};

const client = createClient(config);

export default client;
