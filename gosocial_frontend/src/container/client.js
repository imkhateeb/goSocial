import { createClient } from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

const config = {
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: '2023-08-18',
    useCdn: false,
    token: process.env.REACT_APP_SANITY_TOKEN,
};

const client = createClient(config);

export default client;

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
