'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useUser from '@/hooks/useUser';
import { Field } from '../genA/field';
import keycloak from '@/services/keycloak';
import IconEye from '@/components/icon/icon-eye';

const ComponentsAuthLoginForm = () => {
    const { login } = useUser();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const isDisabled = !email || !password || !!emailError || loading;

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

    const loginWithSSO = async () => {
        try {
            setLoading(true);
            await keycloak.init({ onLoad: 'check-sso' });
            await keycloak.login({ redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/users` : undefined });
        } catch (e) {
            setError('Не удалось запустить SSO авторизацию');
        } finally {
            setLoading(false);
        }
    };

    const router = useRouter();
    const submitForm = async (e: any) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Обязательное поле');
            return;
        }
        await loginAsync();
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email">Логин или Email</label>
                <div className="relative text-white-dark">
                    <Field id="Email" type="text" options={{type: "text"}} placeholder="Введите логин или email"  className="form-input ps-10 placeholder:text-white-dark"
                        value={email}
                        onChange={(value) => {
                            setEmail(value);
                            setEmailError(!value ? 'Обязательное поле' : null);
                        }}
                        autoComplete="username"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
                {emailError && <div className="text-danger mt-1" role="alert" aria-live="polite">{emailError}</div>}
            </div>
            <div>
                <label htmlFor="Password">Пароль</label>
                <div className="relative text-white-dark">
                    <Field id="Password" type="text" options={{type: showPassword ? 'text' : 'password'}} placeholder="Введите пароль"  className="form-input ps-10 pe-24 h-[46px] text-[15px] placeholder:text-white-dark focus:outline-none focus:ring-2 focus:ring-primary/60"
                        value={password}
                        onChange={(value) => setPassword(value)}
                        onKeyUp={(e:any) => setCapsLockOn(!!e.getModifierState && e.getModifierState('CapsLock'))}
                        autoComplete="current-password"
                    />
                    {/* <input id="Password" type="password" placeholder="Введите пароль" className="form-input ps-10 placeholder:text-white-dark" /> */}
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    <button type="button" className="absolute end-2 top-1/2 -translate-y-1/2 text-primary hover:text-indigo-300"
                        onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                        <IconEye />
                    </button>
                </div>
                {capsLockOn && <div className="text-warning mt-1 text-xs">Включён CapsLock</div>}
            </div>
            <div>
                <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Запомнить меня</span>
                </label>
            </div>
            {error && <div>
                <div className="text-danger mt-1" role="alert" aria-live="assertive">{error}</div>
            </div>}
            <button type="submit" disabled={isDisabled} className={`btn btn-gradient !mt-6 w-full h-12 rounded-full uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/60 ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {loading ? (
                    <span className="animate-[spin_1.2s_linear_infinite] border-2 border-r-warning border-l-primary border-t-danger border-b-success rounded-full w-4 h-4"></span>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12.0789 3V2.25V3ZM3.67981 11.3333H2.92981H3.67981ZM3.67981 13L3.15157 13.5324C3.44398 13.8225 3.91565 13.8225 4.20805 13.5324L3.67981 13ZM5.88787 11.8657C6.18191 11.574 6.18377 11.0991 5.89203 10.8051C5.60029 10.511 5.12542 10.5092 4.83138 10.8009L5.88787 11.8657ZM2.52824 10.8009C2.2342 10.5092 1.75933 10.511 1.46759 10.8051C1.17585 11.0991 1.17772 11.574 1.47176 11.8657L2.52824 10.8009ZM18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0001 7.42199 20.1103 6.96007 19.8934 6.60721L18.6156 7.39279ZM12.0789 2.25C7.03155 2.25 2.92981 6.3112 2.92981 11.3333H4.42981C4.42981 7.15072 7.84884 3.75 12.0789 3.75V2.25ZM2.92981 11.3333L2.92981 13H4.42981L4.42981 11.3333H2.92981ZM4.20805 13.5324L5.88787 11.8657L4.83138 10.8009L3.15157 12.4676L4.20805 13.5324ZM4.20805 12.4676L2.52824 10.8009L1.47176 11.8657L3.15157 13.5324L4.20805 12.4676ZM19.8934 6.60721C18.287 3.99427 15.3873 2.25 12.0789 2.25V3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279L19.8934 6.60721Z" fill="currentColor"></path>
                        <path opacity="0.5" d="M11.8825 21V21.75V21ZM20.3137 12.6667H21.0637H20.3137ZM20.3137 11L20.8409 10.4666C20.5487 10.1778 20.0786 10.1778 19.7864 10.4666L20.3137 11ZM18.1002 12.1333C17.8056 12.4244 17.8028 12.8993 18.094 13.1939C18.3852 13.4885 18.86 13.4913 19.1546 13.2001L18.1002 12.1333ZM21.4727 13.2001C21.7673 13.4913 22.2421 13.4885 22.5333 13.1939C22.8245 12.8993 22.8217 12.4244 22.5271 12.1332L21.4727 13.2001ZM5.31769 16.6061C5.10016 16.2536 4.63806 16.1442 4.28557 16.3618C3.93307 16.5793 3.82366 17.0414 4.0412 17.3939L5.31769 16.6061ZM11.8825 21.75C16.9448 21.75 21.0637 17.6915 21.0637 12.6667H19.5637C19.5637 16.8466 16.133 20.25 11.8825 20.25V21.75ZM21.0637 12.6667V11H19.5637V12.6667H21.0637ZM19.7864 10.4666L18.1002 12.1333L19.1546 13.2001L20.8409 11.5334L19.7864 10.4666ZM19.7864 11.5334L21.4727 13.2001L22.5271 12.1332L20.8409 10.4666L19.7864 11.5334ZM4.0412 17.3939C5.65381 20.007 8.56379 21.75 11.8825 21.75V20.25C9.09999 20.25 6.6656 18.7903 5.31769 16.6061L4.0412 17.3939Z" fill="currentColor"></path>
                    </svg>
                )}
                {loading ? 'Вход…' : 'Войти'}
            </button>
            <button type="button" onClick={loginWithSSO} className="btn btn-outline-primary w-full h-12 rounded-full mt-3 flex items-center justify-center gap-2 border-2 hover:border-primary/80 hover:text-primary shadow-sm hover:shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/60" disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.0789 3V2.25V3ZM3.67981 11.3333H2.92981H3.67981ZM3.67981 13L3.15157 13.5324C3.44398 13.8225 3.91565 13.8225 4.20805 13.5324L3.67981 13ZM5.88787 11.8657C6.18191 11.574 6.18377 11.0991 5.89203 10.8051C5.60029 10.511 5.12542 10.5092 4.83138 10.8009L5.88787 11.8657ZM2.52824 10.8009C2.2342 10.5092 1.75933 10.511 1.46759 10.8051C1.17585 11.0991 1.17772 11.574 1.47176 11.8657L2.52824 10.8009ZM18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0001 7.42199 20.1103 6.96007 19.8934 6.60721L18.6156 7.39279ZM12.0789 2.25C7.03155 2.25 2.92981 6.3112 2.92981 11.3333H4.42981C4.42981 7.15072 7.84884 3.75 12.0789 3.75V2.25ZM2.92981 11.3333L2.92981 13H4.42981L4.42981 11.3333H2.92981ZM4.20805 13.5324L5.88787 11.8657L4.83138 10.8009L3.15157 12.4676L4.20805 13.5324ZM4.20805 12.4676L2.52824 10.8009L1.47176 11.8657L3.15157 13.5324L4.20805 12.4676ZM19.8934 6.60721C18.287 3.99427 15.3873 2.25 12.0789 2.25V3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279L19.8934 6.60721Z" fill="currentColor"></path><path opacity="0.5" d="M11.8825 21V21.75V21ZM20.3137 12.6667H21.0637H20.3137ZM20.3137 11L20.8409 10.4666C20.5487 10.1778 20.0786 10.1778 19.7864 10.4666L20.3137 11ZM18.1002 12.1333C17.8056 12.4244 17.8028 12.8993 18.094 13.1939C18.3852 13.4885 18.86 13.4913 19.1546 13.2001L18.1002 12.1333ZM21.4727 13.2001C21.7673 13.4913 22.2421 13.4885 22.5333 13.1939C22.8245 12.8993 22.8217 12.4244 22.5271 12.1332L21.4727 13.2001ZM5.31769 16.6061C5.10016 16.2536 4.63806 16.1442 4.28557 16.3618C3.93307 16.5793 3.82366 17.0414 4.0412 17.3939L5.31769 16.6061ZM11.8825 21.75C16.9448 21.75 21.0637 17.6915 21.0637 12.6667H19.5637C19.5637 16.8466 16.133 20.25 11.8825 20.25V21.75ZM21.0637 12.6667V11H19.5637V12.6667H21.0637ZM19.7864 10.4666L18.1002 12.1333L19.1546 13.2001L20.8409 11.5334L19.7864 10.4666ZM19.7864 11.5334L21.4727 13.2001L22.5271 12.1332L20.8409 10.4666L19.7864 11.5334ZM4.0412 17.3939C5.65381 20.007 8.56379 21.75 11.8825 21.75V20.25C9.09999 20.25 6.6656 18.7903 5.31769 16.6061L4.0412 17.3939Z" fill="currentColor"></path></svg>
                Войти через корпоративный аккаунт
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
