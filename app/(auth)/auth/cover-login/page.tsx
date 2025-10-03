import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import LanguageDropdown from '@/components/language-dropdown';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import RouteChips from '@/components/auth/route-chips';
import ScatterChips from '@/components/auth/scatter-chips';
// import AnimeImage from '@/components/auth/anime-image';

export const metadata: Metadata = {
    title: 'Вход — Продажа ж/д билетов',
};

const CoverLogin = () => {
    const popularRoutes: string[] = [
        'Нурлы Жол → Сары Оба',
        'Сары Оба → Еркеншилик',
        'Еркеншилик → Астана Нурлыжол',
        'Нурлы Жол → Еркеншилик',
        'Сары Оба → Астана Нурлыжол',
        'Еркеншилик → Сары Оба',
        'Нурлы Жол → Караганда',
        'Караганда → Балхаш',
        'Караганда → Астана Нурлыжол',
        'Балхаш → Караганда',
        'Астана Нурлыжол → Алматы-1',
        'Алматы-1 → Астана Нурлыжол',
        'Алматы-2 → Талдыкорган',
        'Талдыкорган → Алматы-2',
        'Алматы-1 → Тараз',
        'Алматы → Шымкент',
        'Шымкент → Алматы-2',
        'Шымкент → Тараз',
        'Тараз → Шымкент',
        'Шымкент → Кызылорда',
        'Кызылорда → Шымкент',
        'Кызылорда → Тараз',
        'Тараз → Кызылорда',
        'Атырау → Актау',
        'Актау → Атырау',
        'Уральск → Атырау',
        'Актобе → Уральск',
        'Уральск → Актобе',
        'Петропавловск → Кокшетау',
        'Кокшетау → Петропавловск',
        'Кокшетау → Астана Нурлыжол',
        'Павлодар → Семей',
        'Семей → Павлодар',
        'Усть-Каменогорск → Семей',
        'Усть-Каменогорск → Риддер',
        'Риддер → Усть-Каменогорск',
        'Костанай → Астана Нурлыжол',
        'Актобе → Костанай',
        'Костанай → Рудный',
        'Рудный → Костанай',
        'Актобе → Атырау',
        'Экибастуз → Павлодар',
        'Павлодар → Экибастуз',
        'Экибастуз → Астана Нурлыжол',
        'Жезказган → Сатпаев',
        'Сатпаев → Жезказган',
        'Кентау → Шымкент',
        'Туркестан → Шымкент',
        'Шымкент → Туркестан',
        'Талдыкорган → Сарыозек',
        'Сарыозек → Алматы-2',
        'Талдыкорган → Текели',
        'Жанаозен → Актау',
        'Актау → Жанаозен',
        'Сарыагаш → Шымкент',
        'Шымкент → Сарыагаш',
        'Алматы → Конаев',
        'Конаев → Алматы',
        'Алматы → Иссык',
        // extra 30 routes
        'Астана Нурлыжол → Кокшетау',
        'Астана Нурлыжол → Костанай',
        'Астана Нурлыжол → Петропавловск',
        'Астана Нурлыжол → Павлодар',
        'Астана Нурлыжол → Семей',
        'Астана Нурлыжол → Усть-Каменогорск',
        'Астана Нурлыжол → Караганда',
        'Астана Нурлыжол → Жезказган',
        'Алматы-1 → Кызылорда',
        'Алматы-1 → Шымкент',
        'Алматы-2 → Конаев',
        'Караганда → Темиртау',
        'Темиртау → Караганда',
        'Павлодар → Астана Нурлыжол',
        'Семей → Астана Нурлыжол',
        'Усть-Каменогорск → Астана Нурлыжол',
        'Костанай → Петропавловск',
        'Петропавловск → Астана Нурлыжол',
        'Кокшетау → Караганда',
        'Актобе → Астана Нурлыжол',
        'Атырау → Уральск',
        'Атырау → Актобе',
        'Аксу → Павлодар',
        'Экибастуз → Караганда',
        'Тараз → Алматы-1',
        'Туркестан → Алматы-1',
        'Шымкент → Астана Нурлыжол',
        'Кызылорда → Астана Нурлыжол',
        'Алматы-2 → Кокшетау',
        'Алматы-1 → Караганда',
        // extra 30 more
        'Алматы-2 → Атырау',
        'Атырау → Алматы-2',
        'Алматы-2 → Актау',
        'Актау → Алматы-2',
        'Алматы-1 → Костанай',
        'Костанай → Алматы-1',
        'Астана Нурлыжол → Уральск',
        'Уральск → Астана Нурлыжол',
        'Павлодар → Караганда',
        'Караганда → Павлодар',
        'Семей → Усть-Каменогорск',
        'Актобе → Кызылорда',
        'Кызылорда → Актобе',
        'Туркестан → Астана Нурлыжол',
        'Астана Нурлыжол → Туркестан',
        'Кокшетау → Костанай',
        'Костанай → Кокшетау',
        'Петропавловск → Караганда',
        'Караганда → Петропавловск',
        'Талдыкорган → Алматы-1',
        'Алматы-1 → Талдыкорган',
        'Кентау → Туркестан',
        'Туркестан → Кентау',
        'Экибастуз → Кокшетау',
        'Кокшетау → Экибастуз',
        'Рудный → Астана Нурлыжол',
        'Астана Нурлыжол → Рудный',
        'Жезказган → Караганда',
        'Караганда → Жезказган',
        'Павлодар → Кокшетау',
        'Кокшетау → Павлодар',
        'Аксу → Экибастуз',
        'Экибастуз → Аксу',
        'Атырау → Кызылорда',
        'Кызылорда → Атырау',
        // extra 50 more
        'Алматы-2 → Усть-Каменогорск',
        'Усть-Каменогорск → Алматы-2',
        'Алматы-1 → Петропавловск',
        'Петропавловск → Алматы-1',
        'Алматы-2 → Павлодар',
        'Павлодар → Алматы-2',
        'Алматы-2 → Экибастуз',
        'Экибастуз → Алматы-2',
        'Алматы-1 → Кокшетау',
        'Кокшетау → Алматы-1',
        'Алматы-2 → Кызылорда',
        'Кызылорда → Алматы-2',
        'Алматы-1 → Аксу',
        'Аксу → Алматы-1',
        'Астана Нурлыжол → Аксу',
        'Аксу → Астана Нурлыжол',
        'Астана Нурлыжол → Темиртау',
        'Темиртау → Астана Нурлыжол',
        'Астана Нурлыжол → Балхаш',
        'Балхаш → Астана Нурлыжол',
        'Караганда → Темиртау',
        'Темиртау → Экибастуз',
        'Экибастуз → Темиртау',
        'Караганда → Аксу',
        'Аксу → Караганда',
        'Караганда → Рудный',
        'Рудный → Караганда',
        'Актобе → Туркестан',
        'Туркестан → Актобе',
        'Актобе → Караганда',
        'Караганда → Актобе',
        'Уральск → Кызылорда',
        'Кызылорда → Уральск',
        'Уральск → Павлодар',
        'Павлодар → Уральск',
        'Атырау → Караганда',
        'Караганда → Атырау',
        'Атырау → Кокшетау',
        'Кокшетау → Атырау',
        'Актау → Караганда',
        'Караганда → Актау',
        'Актау → Кызылорда',
        'Кызылорда → Актау',
        'Актау → Уральск',
        'Уральск → Актау',
        'Жанаозен → Караганда',
        'Караганда → Жанаозен',
        'Кентау → Астана Нурлыжол',
        'Астана Нурлыжол → Кентау',
        'Шымкент → Караганда',
        'Караганда → Шымкент',
        'Шымкент → Костанай',
        'Костанай → Шымкент',
    ];
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-[#0B356E] bg-blend-multiply bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#0a1426] dark:bg-blend-multiply sm:px-16">
                {/* Global background routes over the blue area (not over logo, photo, or right panel) */}
                <ScatterChips
                    routes={popularRoutes}
                    avoidSelectors={["#wagon-visual", "#cover-login-right", "a[href='/' ]"]}
                    className="z-0"
                    margin={2}
                    maxAttempts={8000}
                />
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(8,52,102,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg] relative">
                            <Link href="/" className="ms-24 block w-48 lg:w-72">
                                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-sm font-extrabold uppercase tracking-wide text-2xl lg:text-3xl">
                                    passticket
                                </span>
                                <span className="mt-1 block text-sm lg:text-base text-white/90 tracking-wide">
                                    Система продажи жд билетов
                                </span>
                            </Link>
                            <div className="mt-16 hidden w-full max-w-[640px] lg:block relative ms-28" id="wagon-visual">
                                <div className="relative w-full aspect-[16/9] rounded-xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] overflow-hidden">
                                    <Image src="/wagon.jpg" alt="Train Wagon" fill priority sizes="(min-width: 1024px) 640px, 100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="cover-login-right" className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link href="/" className="block lg:hidden">
                                <span className="inline-block ltr:-ml-1 rtl:-mr-1 font-extrabold uppercase tracking-wide text-white text-base">passticket</span>
                            </Link>
                            <LanguageDropdown className="ms-auto w-max" />
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-xl">Поезда, места, расписание, дороги, станции, тариф и управление</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">администрирование</p>
                            </div>
                            <ComponentsAuthLoginForm />

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>

                            </div>
                            <div className="mb-10 md:mb-[60px]">

                            </div>
                            <div className="text-center dark:text-white">
                                Забыли пароль? &nbsp;
                                <Link href="/auth/cover-register" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    Востановить
                                </Link>
                            </div>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}. АО «Пассажирские перевозки». Все права защищены.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLogin;
