import IconCaretDown from '@/components/icon/icon-caret-down';
import Link from 'next/link';
import { getTranslation } from '@/i18n';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const HorizontalMenu = () => {
    const { t, i18n } = getTranslation();
    const { logout } = useUser();
    const router = useRouter();

    return <>
        <ul className="horizontal-menu hidden border-t border-white/20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient px-6 py-2 font-semibold text-white rtl:space-x-reverse backdrop-blur-sm dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 lg:space-x-1.5 xl:space-x-8">
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <Link href="/">Главная</Link>
                    </div>
                </button>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <Link href="/trainWagonsPlans">Состав вагонов</Link>
                    </div>
                </button>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <Link href="/trainSchedules">Расписание поездов</Link>
                    </div>
                </button>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <span className="px-1">Маршруты</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    <li>
                        <Link href="/routes">Маршруты</Link>
                    </li>
                    <li>
                        <Link href="/routeStations">Станции маршрута</Link>
                    </li>
                </ul>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <span className="px-1">Тарификатор</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    <li>
                        <Link href="/tarifications/baseFares">Базовые тарифы</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/tariffs">Тарифы</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/seasons">Сезоны</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/seatTariffHistories">История тарифов мест</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/seatTariffs">Тарифы мест</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/seatTariffItems">Элементы тарифов мест</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/trainCategories">Категории поезда</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/wagonClasses">Классы вагона</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/tariffSeatTypeItems">Элементы тарифа типа места</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/tariffTrainCategoryItems">Элементы тарифа категории поезда</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/tariffWagonItems">Элементы тарифа вагона</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/tariffWagonTypeItems">Элементы тарифа типа вагона</Link>
                    </li>
                </ul>
            </li>


            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <span className="px-1">Бронирование билетов</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    <li>
                        <Link href="/seatReservations">Бронирование мест</Link>
                    </li>
                    <li>
                        <Link href="/seatCountReservations">Бронирование количества мест</Link>
                    </li>
                    <li>
                        <Link href="/seatSegments">Сегменты мест</Link>
                    </li>
                    <li>
                        <Link href="/seatCountSegments">Количество сегментов мест</Link>
                    </li>
                </ul>
            </li>
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <Link href="/tickets">Билеты</Link>
                    </div>
                </button>
            </li>
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <span className="px-1">Справочники</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    <li>
                        <Link href="/depots">Вокзалы</Link>
                    </li>
                    <li>
                        <Link href="/railwaies">Железные дороги</Link>
                    </li>
                    <li>
                        <Link href="/railwayStations">Станции жд</Link>
                    </li>
                    <li>
                        <Link href="/seatTypes">Типы мест</Link>
                    </li>
                    
                    <li>
                        <Link href="/stations">Станции</Link>
                    </li>
                    <li>
                        <Link href="/trains">Поезда</Link>
                    </li>
                    <li>
                        <Link href="/trainWagons">Вагоны состава поезда</Link>
                    </li>
                    <li>
                        <Link href="/wagons">Вагоны</Link>
                    </li>
                    <li>
                        <Link href="/seats">Места в вагоне</Link>
                    </li>
                </ul>
            </li>
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <span className="px-1">Администрирование</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    <li>
                        <Link href="/users">Пользователи</Link>
                    </li>
                </ul>
            </li>
            <li className="menu nav-item relative">
                <button type="button" className="nav-link" onClick={() => {
                    logout();
                    router.replace('/auth/cover-login');
                }}>
                    <div className="flex items-center">
                        <span className="px-1">Выход</span>
                    </div>
                </button>
            </li>
        </ul>
    </>
}
export default HorizontalMenu;
