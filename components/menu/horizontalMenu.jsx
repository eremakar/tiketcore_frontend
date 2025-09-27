import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconMenuApps from '@/components/icon/menu/icon-menu-apps';
import IconMenuComponents from '@/components/icon/menu/icon-menu-components';
import IconMenuElements from '@/components/icon/menu/icon-menu-elements';
import IconMenuDatatables from '@/components/icon/menu/icon-menu-datatables';
import IconMenuForms from '@/components/icon/menu/icon-menu-forms';
import IconMenuPages from '@/components/icon/menu/icon-menu-pages';
import IconMenuMore from '@/components/icon/menu/icon-menu-more';
import Link from 'next/link';
import { getTranslation } from '@/i18n';
import IconX from '../icon/icon-x';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const HorizontalMenu = () => {
    const { t, i18n } = getTranslation();
    const { logout } = useUser();
    const router = useRouter();

    return <>
        <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuDashboard className="shrink-0" />
                        <Link href="/">Главная</Link>
                    </div>
                </button>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuDashboard className="shrink-0" />
                        <Link href="/trainWagonsPlans">Состав вагонов</Link>
                    </div>
                </button>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuDashboard className="shrink-0" />
                        <Link href="/trainSchedules">Расписание поездов</Link>
                    </div>
                </button>
            </li>

            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuApps className="shrink-0" />
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
                        <IconMenuApps className="shrink-0" />
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
                        <Link href="/tarifications/seasons">Сезоны</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/seatTariffHistories">История тарифов мест</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/seatTariffs">Тарифы мест</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/trainCategories">Категории поезда</Link>
                    </li>
                    <li>
                        <Link href="/tarifications/wagonClasses">Классы вагона</Link>
                    </li>
                </ul>
            </li>


            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuApps className="shrink-0" />
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
                        <IconMenuDashboard className="shrink-0" />
                        <Link href="/tickets">Билеты</Link>
                    </div>
                </button>
            </li>
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuApps className="shrink-0" />
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
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <Link href="/connections">Соединение 2х станций</Link>
                            </div>
                        </button>
                    </li>
                    <li>
                        <Link href="/stations">Станции</Link>
                    </li>
                    <li>
                        <Link href="/trains">Поезда</Link>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <Link href="/trainWagons">Вагоны состава поезда</Link>
                            </div>
                        </button>
                    </li>
                    <li>
                        <Link href="/wagons">Вагоны</Link>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <Link href="/seats">Места в вагоне</Link>
                            </div>
                        </button>
                    </li>
                </ul>
            </li>
            <li className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <IconMenuApps className="shrink-0" />
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
                        <IconX className="shrink-0" />
                        <span className="px-1">Выход</span>
                    </div>
                </button>
            </li>
        </ul>
    </>
}
export default HorizontalMenu;
