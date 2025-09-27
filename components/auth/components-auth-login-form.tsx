'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useUser from '@/hooks/useUser';
import { Field } from '../genA/field';

const ComponentsAuthLoginForm = () => {
    const { login } = useUser();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loginAsync = async () => {
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.token) {
                router.replace('/users');
            } else if (result.wrongLoginOrPassword) {
               setError("Неверный логин или пароль");
            } else {
                setError("Ошибка попробуйте еще раз");
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const router = useRouter();
    const submitForm = async (e: any) => {
        e.preventDefault();
        await loginAsync();
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <Field id="Email" type="text" options={{type: "text"}} placeholder="Введите Email"  className="form-input ps-10 placeholder:text-white-dark"
                        value={email} onChange={(value) => setEmail(value)} />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Password">Пароль</label>
                <div className="relative text-white-dark">
                    <Field id="Password" type="text" options={{type: "password"}} placeholder="Введите пароль"  className="form-input ps-10 placeholder:text-white-dark"
                        value={password} onChange={(value) => setPassword(value)} />
                    {/* <input id="Password" type="password" placeholder="Введите пароль" className="form-input ps-10 placeholder:text-white-dark" /> */}
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label className="flex cursor-pointer items-center">

                </label>
            </div>
            {error && <div>
                <div className="text-danger mt-1">{error}</div>
            </div>}
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                {loading && <span className="animate-[spin_3s_linear_infinite] border-2 border-r-warning border-l-primary border-t-danger border-b-success rounded-full w-2 h-2 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>}
                Войти
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
