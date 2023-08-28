import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

const accessUser = (tokenResponse) => {
    const accessToken = tokenResponse.access_token;
    // Make API request to UserInfo Endpoint
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Process user profile data
            console.log("User Profile Data:", data);
        })
        .catch(error => {
            console.error("Error fetching user profile:", error);
        });
}

export default function Googleauth() {
    const login = useGoogleLogin({
        onSuccess: tokenResponse => accessUser(tokenResponse),
    });
    return (
        <button 
        type='button'
        className='bg-white flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none shadow-md hover:shadow-xl'
        onClick={() => login()}>
            <FcGoogle className='mr-4' /> Signin with google
        </button>
    )
}