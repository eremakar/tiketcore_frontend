'use client';
import keycloak from "@/services/keycloak";

//import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// export const metadata: Metadata = {
//     title: 'Sales Admin',
// };

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/auth/cover-login');
        }
        else
          router.replace('/users');
      }, [router]);

    //   useEffect(() => {
    //     keycloak
    //       .init({ onLoad: "login-required" }) // Автоматический редирект на логин
    //       .then((auth: any) => {
    //         //setAuthenticated(auth);
    //         localStorage.setItem('token', keycloak.token);
    //         //console.log("Token:", keycloak.token);
    //       })
    //       .catch((error: any) => console.error("Keycloak init failed:", error));
    //   }, []);

    return <>
    Загрузка...
    </>
};

export default Home;
