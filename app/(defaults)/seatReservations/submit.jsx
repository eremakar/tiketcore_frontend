import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";
import { useState, useEffect, useRef } from "react";
import { mapTrainScheduleName, mapSeatSegmentName } from "@/functions/mappings";

export default function SeatReservationSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const [searchMode, setSearchMode] = useState(true);
    const [availableTrains, setAvailableTrains] = useState([]);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [selectedWagon, setSelectedWagon] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [availableWagons, setAvailableWagons] = useState([]);
    const [availableSegments, setAvailableSegments] = useState([]);
    const [selectedSegments, setSelectedSegments] = useState([]);
    const [segmentsError, setSegmentsError] = useState('');
    const [selectedFromStation, setSelectedFromStation] = useState(null);
    const [selectedToStation, setSelectedToStation] = useState(null);
    const [selectedWagonType, setSelectedWagonType] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [stations, setStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(false);
    const [fromStationName, setFromStationName] = useState('');
    const [toStationName, setToStationName] = useState('');
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const dateInputRef = useRef(null);

    // Популярные станции (как на railways.kz) - ищем по названию в загруженных станциях
    const getPopularStations = () => {
        const popularNames = ["АСТАНА", "АЛМАТЫ", "КАРАГАНДЫ", "АКТОБЕ", "ЖЕЗКАЗГАН"];
        return stations.filter(station => 
            popularNames.some(name => 
                station.name?.toUpperCase().includes(name) || 
                name.includes(station.name?.toUpperCase())
            )
        );
    };

    // Поиск станций для автокомплита
    const searchStations = (query, setSuggestions, setShowSuggestions) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = stations.filter(station => 
            station.name?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10); // Ограничиваем до 10 результатов

        setSuggestions(filtered);
        setShowSuggestions(true);
    };

    // Выбор станции из автокомплита
    const selectStationFromSuggestions = (station, isFrom) => {
        if (isFrom) {
            setValue('fromId', station.id);
            setFromStationName(station.name);
            setShowFromSuggestions(false);
            setFromSuggestions([]);
        } else {
            setValue('toId', station.id);
            setToStationName(station.name);
            setShowToSuggestions(false);
            setToSuggestions([]);
        }
    };

    // Типы вагонов
    const wagonTypes = [
        { id: 1, name: "Общий" },
        { id: 2, name: "Сидячий" },
        { id: 3, name: "Купе" },
        { id: 4, name: "Мягкий" },
        { id: 5, name: "Люкс" },
        { id: 6, name: "Плацкарт" }
    ];

    // Время суток
    const timeFilters = [
        { id: 1, name: "Утро", start: "06:00", end: "12:00" },
        { id: 2, name: "День", start: "12:00", end: "18:00" },
        { id: 3, name: "Вечер", start: "18:00", end: "00:00" },
        { id: 4, name: "Ночь", start: "00:00", end: "06:00" }
    ];

    // Ресурсы
    const stationsResource = useResource('stations');
    const routeStationsResource = useResource('routeStations');
    const trainsResource = useResource('trains');
    const trainSchedulesResource = useResource('trainSchedules');
    const trainWagonsResource = useResource('trainWagons');
    const seatsResource = useResource('seats');
    const seatTypesResource = useResource('seatTypes');
    const seatSegmentsResource = useResource('seatSegments');

    const resolver = yupResolver(yup.object().shape({
        departureDate: yup.string().required("Дата отправления обязательна*"),
    }));

    const methods = useForm({
        resolver: resolver,
    });

    const {
        watch,
        setValue,
        trigger,
        formState: {errors},
        handleSubmit,
        reset
    } = methods;

    const departureDate = watch('departureDate');
    const trainId = watch('trainId');
    const wagonId = watch('wagonId');
    const seatId = watch('seatId');
    const trainScheduleId = watch('trainScheduleId');

    // Поиск доступных расписаний поездов
    const searchTrainSchedules = async () => {
        if (!departureDate) {
            alert('Пожалуйста, заполните дату отправления');
            return;
        }

        try {
            // Построение фильтра для поиска
            const departure = new Date(departureDate);
            const nextDay = new Date(departureDate);
            nextDay.setDate(nextDay.getDate() + 1);

            let filter = {
                date: {
                    operator: 'between',
                    operand1: departure.toISOString(),
                    operand2: nextDay.toISOString()
                }
            };

            // Добавляем фильтр по типу вагона если выбран
            if (selectedWagonType) {
                filter.wagonType = {
                    operator: 'equals',
                    operand1: selectedWagonType
                };
            }

            // Добавляем фильтр по времени если выбрано
            if (selectedTime) {
                const timeFilter = timeFilters.find(t => t.id === selectedTime);
                if (timeFilter) {
                    filter.departureTime = {
                        operator: 'between',
                        operand1: timeFilter.start,
                        operand2: timeFilter.end
                    };
                }
            }

            // Поиск расписания поездов
            const scheduleResult = await trainSchedulesResource.search({
                paging: { skip: 0, take: 50 },
                filter: filter
            });

            setAvailableTrains(scheduleResult?.result || []);
            setSearchMode(false);
        } catch (e) {
            console.error('Ошибка поиска поездов:', e);
            alert('Ошибка при поиске поездов');
        }
    };

    // Загрузка доступных мест в вагоне
    const loadSeatsForWagon = async (trainWagon) => {
        try {
            const seatsResult = await seatsResource.search({
                paging: { skip: 0, take: 100 },
                filter: {
                    wagonId: {
                        operator: 'equals',
                        operand1: trainWagon.wagonId
                    }
                }
            });

            setAvailableSeats(seatsResult?.result || []);
        } catch (e) {
            console.error('Ошибка загрузки мест:', e);
        }
    };

    // Выбор расписания поезда
    const selectTrainSchedule = async (schedule) => {
        setSelectedTrain(schedule);
        setValue('trainScheduleId', schedule.id);
        setValue('trainId', schedule.trainId);

        // Загрузка вагонов поезда
        try {
            const wagonsResult = await trainWagonsResource.search({
                paging: { skip: 0, take: 50 },
                filter: {
                    trainScheduleId: {
                        operator: 'equals',
                        operand1: schedule.id
                    }
                }
            });

            setAvailableWagons(wagonsResult?.result || []);
            setSelectedWagon(null);
            setAvailableSeats([]);
            setAvailableSegments([]);
            setSelectedSegments([]);
        } catch (e) {
            console.error('Ошибка загрузки вагонов:', e);
        }
    };

    // Выбор вагона
    const selectWagon = async (wagon) => {
        setSelectedWagon(wagon);
        setValue('wagonId', wagon.id);
        
        // Загружаем места в вагоне
        await loadSeatsForWagon(wagon);
        
        // Сбрасываем выбранное место и сегменты
        setSelectedSeat(null);
        setAvailableSegments([]);
        setSelectedSegments([]);
        setSegmentsError('');
        setSelectedFromStation(null);
        setSelectedToStation(null);
    };

    // Загрузка сегментов мест
    const loadSeatSegments = async (seatId) => {
        try {
            const segmentsResult = await seatSegmentsResource.search({
                paging: { skip: 0, take: 200 },
                filter: {
                    seatId: {
                        operator: 'equals',
                        operand1: seatId
                    }
                }
            });

            // Сортируем сегменты по ID
            const sortedSegments = (segmentsResult?.result || []).sort((a, b) => a.id - b.id);
            setAvailableSegments(sortedSegments);
        } catch (e) {
            console.error('Ошибка загрузки сегментов:', e);
        }
    };

    // Выбор места
    const selectSeat = async (seat) => {
        setSelectedSeat(seat);
        setValue('seatId', seat.id);
        setValue('price', seat.price || 0);
        setValue('total', seat.price || 0);
        
        // Загружаем сегменты для выбранного места
        await loadSeatSegments(seat.id);
        
        // Сбрасываем выбранные сегменты и станции
        setSelectedSegments([]);
        setSegmentsError('');
        setSelectedFromStation(null);
        setSelectedToStation(null);
    };

    // Выбор сегментов на основе выбранных станций
    const selectSegmentsByStations = (fromStationId, toStationId) => {
        if (!fromStationId || !toStationId) {
            return;
        }

        // Находим индексы начальной и конечной станции (from.stationId, а не fromId)
        const fromIndex = availableSegments.findIndex(seg => seg.from?.stationId === fromStationId);
        const toIndex = availableSegments.findIndex(seg => seg.to?.stationId === toStationId);

        if (fromIndex === -1 || toIndex === -1) {
            setSegmentsError('Не удалось найти сегменты для выбранных станций');
            setSelectedSegments([]);
            return;
        }

        if (fromIndex > toIndex) {
            setSegmentsError('Начальная станция должна быть раньше конечной');
            setSelectedSegments([]);
            return;
        }

        // Выбираем все сегменты между from и to (включительно)
        const segmentsToSelect = availableSegments.slice(fromIndex, toIndex + 1);

        // Проверяем, что все сегменты доступны (не забронированы и нет билета)
        const hasOccupied = segmentsToSelect.some(seg => seg.seatReservationId || seg.ticketId);
        
        if (hasOccupied) {
            setSegmentsError('Между выбранными станциями есть занятые сегменты. Выберите другой диапазон.');
            setSelectedSegments([]);
            return;
        }

        setSelectedSegments(segmentsToSelect);
        setSegmentsError('');
    };

    // Получение уникальных станций из сегментов
    const getUniqueStations = () => {
        const stationsMap = new Map();
        
        availableSegments.forEach(seg => {
            // from это RouteStation, station находится внутри
            if (seg.from?.stationId && seg.from?.station) {
                stationsMap.set(seg.from.stationId, seg.from.station);
            }
            if (seg.to?.stationId && seg.to?.station) {
                stationsMap.set(seg.to.stationId, seg.to.station);
            }
        });

        return Array.from(stationsMap.values());
    };

    // Проверка что сегменты образуют непрерывную линию
    const validateSegmentsLine = (segments) => {
        if (segments.length === 0) {
            return { valid: true, error: '' };
        }

        if (segments.length === 1) {
            return { valid: true, error: '' };
        }

        // Получаем индексы выбранных сегментов в массиве availableSegments
        const selectedIndices = segments.map(seg => 
            availableSegments.findIndex(s => s.id === seg.id)
        ).filter(idx => idx !== -1).sort((a, b) => a - b);

        // Проверяем что индексы идут последовательно
        let isSequential = true;
        for (let i = 0; i < selectedIndices.length - 1; i++) {
            if (selectedIndices[i + 1] !== selectedIndices[i] + 1) {
                isSequential = false;
                break;
            }
        }

        if (!isSequential) {
            // Формируем более понятное сообщение об ошибке
            const segmentInfo = segments.map(seg => mapSeatSegmentName(seg)).join(', ');
            
            return {
                valid: false,
                error: `Выбранные сегменты не образуют непрерывную линию. Между сегментами есть пропуски. Выбрано: ${segmentInfo}`
            };
        }

        return { valid: true, error: '' };
    };

    // Выбор сегментов (линия мест)
    const selectSegment = (segment) => {
        // Проверяем, что сегмент не забронирован и нет билета
        if (segment.seatReservationId || segment.ticketId) {
            return;
        }

        let newSegments;
        // Если сегмент уже выбран, убираем его
        if (selectedSegments.some(s => s.id === segment.id)) {
            newSegments = selectedSegments.filter(s => s.id !== segment.id);
        } else {
            // Добавляем сегмент к выбранным
            newSegments = [...selectedSegments, segment];
        }

        // Проверяем валидность линии
        const validation = validateSegmentsLine(newSegments);
        setSegmentsError(validation.error);
        setSelectedSegments(newSegments);
    };

    // Финальное бронирование
    const finalBooking = yupResolver(yup.object().shape({
        trainId: yup.string().required("Поле обязательное*"),
        wagonId: yup.string().required("Поле обязательное*"),
        seatId: yup.string().required("Поле обязательное*"),
        trainScheduleId: yup.string().required("Поле обязательное*"),
    }));

    // Сброс при закрытии
    useEffect(() => {
        if (!show) {
            setSearchMode(true);
            setAvailableTrains([]);
            setSelectedTrain(null);
            setSelectedWagon(null);
            setSelectedSeat(null);
            setAvailableSeats([]);
            setAvailableWagons([]);
            setAvailableSegments([]);
            setSelectedSegments([]);
            setSegmentsError('');
            setSelectedFromStation(null);
            setSelectedToStation(null);
            setFromStationName('');
            setToStationName('');
            setShowFromSuggestions(false);
            setShowToSuggestions(false);
            setFromSuggestions([]);
            setToSuggestions([]);
            reset();
        }
    }, [show, reset]);

    // Загрузка станций
    useEffect(() => {
        const loadStations = async () => {
            setLoadingStations(true);
            try {
                const stationsResult = await stationsResource.search({ paging: { skip: 0, take: 100 } });
                setStations(stationsResult?.result || []);
            } catch (e) {
                console.error('Ошибка загрузки станций:', e);
                // В случае ошибки используем только популярные станции
                setStations([]);
            } finally {
                setLoadingStations(false);
            }
        };
        if (show) {
            loadStations();
        }
    }, [show]);

    // Генерация номера брони и установка даты по умолчанию
    useEffect(() => {
        if (resourceMode === 'create') {
            const bookingNumber = `BK${Date.now()}`;
            setValue('number', bookingNumber);
            setValue('date', new Date().toISOString());
            
            // Устанавливаем сегодняшнюю дату по умолчанию
            const today = new Date().toISOString().split('T')[0];
            setValue('departureDate', today);
        }
    }, [resourceMode, setValue]);

    return (
        <ResourceSubmit 
            resource={resource} 
            show={show} 
            setShow={setShow} 
            resourceName={resourceName} 
            resourceMode={resourceMode} 
            resourceData={resourceData} 
            onResourceSubmitted={onResourceSubmitted} 
            onSubmit={async handler => { 
                // Устанавливаем fromId, toId и departure из выбранных сегментов
                if (selectedSegments.length > 0) {
                    const sortedSegments = [...selectedSegments].sort((a, b) => a.id - b.id);
                    const firstSegment = sortedSegments[0];
                    const lastSegment = sortedSegments[sortedSegments.length - 1];
                    
                    setValue('fromId', firstSegment.from?.id || firstSegment.fromId);
                    setValue('toId', lastSegment.to?.id || lastSegment.toId);
                    setValue('departure', firstSegment.departure || new Date().toISOString());
                }
                
                handleSubmit(handler)(); 
            }}
            size="7xl"
            submitDisabled={!!segmentsError}
        >
            <HookForm methods={methods} data={resourceData}>
                <div className="space-y-6">
                {searchMode ? (
                    // Форма поиска билетов в стиле railways.kz
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="space-y-6">

                            {/* Дата отправления */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Дата отправления</label>
                                <div className="relative">
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                        value={departureDate || ''}
                                        onChange={(e) => setValue('departureDate', e.target.value)}
                                        onClick={(e) => {
                                            if (e.target.showPicker) {
                                                e.target.showPicker();
                                            }
                                        }}
                                        onFocus={(e) => {
                                            if (e.target.showPicker) {
                                                e.target.showPicker();
                                            }
                                        }}
                                    />
                                    <div className="absolute right-3 top-3 flex flex-col gap-1">
                                        <button 
                                            type="button" 
                                            className="text-gray-400 hover:text-gray-600 text-xs"
                                            onClick={() => {
                                                const currentDate = departureDate ? new Date(departureDate) : new Date();
                                                currentDate.setDate(currentDate.getDate() + 1);
                                                setValue('departureDate', currentDate.toISOString().split('T')[0]);
                                            }}
                                        >
                                            ▲
                                        </button>
                                        <button 
                                            type="button" 
                                            className="text-gray-400 hover:text-gray-600 text-xs"
                                            onClick={() => {
                                                const currentDate = departureDate ? new Date(departureDate) : new Date();
                                                currentDate.setDate(currentDate.getDate() - 1);
                                                setValue('departureDate', currentDate.toISOString().split('T')[0]);
                                            }}
                                        >
                                            ▼
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const today = new Date().toISOString().split('T')[0];
                                            setValue('departureDate', today);
                                        }}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                                    >
                                        Сегодня
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const tomorrow = new Date();
                                            tomorrow.setDate(tomorrow.getDate() + 1);
                                            setValue('departureDate', tomorrow.toISOString().split('T')[0]);
                                        }}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                                    >
                                        Завтра
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextWeek = new Date();
                                            nextWeek.setDate(nextWeek.getDate() + 7);
                                            setValue('departureDate', nextWeek.toISOString().split('T')[0]);
                                        }}
                                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                                    >
                                        Через неделю
                                    </button>
                                </div>
                                {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate.message}</p>}
                            </div>

                            {/* Тип вагона */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Тип вагона</label>
                                <div className="flex flex-wrap gap-2">
                                    {wagonTypes.map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedWagonType(type.id)}
                                            className={`px-4 py-2 border rounded-lg ${
                                                selectedWagonType === type.id 
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                    : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Время */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Время</label>
                                <div className="flex flex-wrap gap-2">
                                    {timeFilters.map(time => (
                                        <button
                                            key={time.id}
                                            type="button"
                                            onClick={() => setSelectedTime(time.id)}
                                            className={`px-4 py-2 border rounded-lg ${
                                                selectedTime === time.id 
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                    : 'border-gray-300 hover:border-blue-300'
                                            }`}
                                        >
                                            {time.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Кнопка поиска */}
                            <button
                                type="button"
                                onClick={searchTrainSchedules}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors"
                            >
                                Найти
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Сообщение если поезда не найдены */}
                {!searchMode && availableTrains.length === 0 && (
                    <div className="bg-white p-6 rounded-lg border">
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-4">🚂</div>
                            <p>По вашему запросу поездов не найдено</p>
                            <p className="text-sm mt-2">Попробуйте изменить параметры поиска</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchMode(true);
                                    setAvailableTrains([]);
                                    setSelectedTrain(null);
                                    setSelectedWagon(null);
                                    setSelectedSeat(null);
                                    setAvailableWagons([]);
                                    setAvailableSeats([]);
                                    setAvailableSegments([]);
                                    setSelectedSegments([]);
                                    setSegmentsError('');
                                    setSelectedFromStation(null);
                                    setSelectedToStation(null);
                                }}
                                className="btn btn-outline-primary mt-4"
                            >
                                Назад к поиску
                            </button>
                        </div>
                    </div>
                )}

                {/* Выбор расписания поезда */}
                {!searchMode && availableTrains.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Выберите расписание поезда</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchMode(true);
                                    setAvailableTrains([]);
                                    setSelectedTrain(null);
                                    setSelectedWagon(null);
                                    setSelectedSeat(null);
                                    setAvailableWagons([]);
                                    setAvailableSeats([]);
                                    setAvailableSegments([]);
                                    setSelectedSegments([]);
                                    setSegmentsError('');
                                    setSelectedFromStation(null);
                                    setSelectedToStation(null);
                                }}
                                className="btn btn-outline-primary btn-sm"
                            >
                                Назад к поиску
                            </button>
                        </div>
                        <Fields cols={1}>
                            <FormField 
                                type="select" 
                                name="trainScheduleId" 
                                label="Выберите расписание поезда"
                                mode="portal" 
                                value={watch('trainScheduleId')} 
                                error={errors.trainScheduleId?.message} 
                                trigger={trigger} 
                                onChange={async (value) => {
                                    const schedule = availableTrains.find(s => s.id === value);
                                    if (schedule) {
                                        selectTrainSchedule(schedule);
                                    }
                                }} 
                                isValidated={true} 
                                options={[
                                    { id: '', name: 'Не указано' },
                                    ...availableTrains.map(schedule => ({
                                        id: schedule.id,
                                        name: mapTrainScheduleName(schedule)
                                    }))
                                ]}
                            />
                        </Fields>
                    </div>
                )}

                {/* Выбор вагона */}
                {selectedTrain && availableWagons.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Выберите вагон - {selectedTrain.train?.name}</h3>
                        <Fields cols={1}>
                            <FormField 
                                type="select" 
                                name="wagonId" 
                                mode="portal"
                                label="Выберите вагон" 
                                value={wagonId} 
                                error={errors.wagonId?.message} 
                                trigger={trigger} 
                                onChange={async (value) => {
                                    const wagon = availableWagons.find(w => w.id === value);
                                    if (wagon) {
                                        selectWagon(wagon);
                                    }
                                }} 
                                isValidated={true}
                                options={[
                                    { id: '', name: 'Не указано' },
                                    ...availableWagons.map(wagon => ({
                                        id: wagon.id,
                                        name: `${wagon.number || 'Вагон'}`
                                    }))
                                ]}
                            />
                        </Fields>
                    </div>
                )}

                {/* Выбор места */}
                {selectedWagon && availableSeats.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Выберите место - Вагон {selectedWagon.number}</h3>
                        <Fields cols={1}>
                            <FormField 
                                type="select" 
                                name="seatId" 
                                mode="portal"
                                label="Выберите место" 
                                value={seatId} 
                                error={errors.seatId?.message} 
                                trigger={trigger} 
                                onChange={async (value) => {
                                    const seat = availableSeats.find(s => s.id === value);
                                    if (seat) {
                                        await selectSeat(seat);
                                    }
                                }} 
                                isValidated={true}
                                options={[
                                    { id: '', name: 'Не указано' },
                                    ...availableSeats.map(seat => ({
                                        id: seat.id,
                                        name: `Место ${seat.number || seat.id}${seat.type?.name ? ` - ${seat.type.name}` : ''}`
                                    }))
                                ]}
                            />
                        </Fields>
                    </div>
                )}

                {/* Выбор сегментов */}
                {selectedSeat && (
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Выберите сегменты - Место {selectedSeat.number}</h3>

                        {availableSegments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-4">🪑</div>
                                <p>В данном вагоне нет доступных сегментов мест</p>
                            </div>
                         ) : (
                            <>
                                {/* Выбор станций откуда-куда */}
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="text-base font-semibold mb-3">Быстрый выбор по станциям</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Откуда</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={selectedFromStation || ''}
                                                onChange={(e) => {
                                                    const stationId = e.target.value ? parseInt(e.target.value) : null;
                                                    setSelectedFromStation(stationId);
                                                    if (stationId && selectedToStation) {
                                                        selectSegmentsByStations(stationId, selectedToStation);
                                                    }
                                                }}
                                            >
                                                <option value="">Выберите станцию</option>
                                                {getUniqueStations().map(station => (
                                                    <option key={station.id} value={station.id}>
                                                        {station.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Куда</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={selectedToStation || ''}
                                                onChange={(e) => {
                                                    const stationId = e.target.value ? parseInt(e.target.value) : null;
                                                    setSelectedToStation(stationId);
                                                    if (selectedFromStation && stationId) {
                                                        selectSegmentsByStations(selectedFromStation, stationId);
                                                    }
                                                }}
                                            >
                                                <option value="">Выберите станцию</option>
                                                {getUniqueStations().map(station => (
                                                    <option key={station.id} value={station.id}>
                                                        {station.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {selectedFromStation && selectedToStation && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFromStation(null);
                                                setSelectedToStation(null);
                                                setSelectedSegments([]);
                                                setSegmentsError('');
                                            }}
                                            className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline"
                                        >
                                            Очистить выбор станций
                                        </button>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold mb-2">Или выберите сегменты вручную</h4>
                                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                                            <span>Доступно</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                                            <span>Забронировано</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                                            <span>Есть билет</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                            <span>Выбрано</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="overflow-x-auto mb-6">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 bg-gray-100 px-2 py-2 text-center text-xs">Выбор</th>
                                                {availableSegments.map((segment) => (
                                                    <th key={segment.id} className="border border-gray-300 bg-gray-100 px-2 py-2 text-center min-w-[100px]">
                                                        <div className="text-xs leading-tight">
                                                            <div className="font-semibold">{segment.from?.station?.name || 'От'}</div>
                                                            <div className="text-gray-500 my-1">↓</div>
                                                            <div className="font-semibold">{segment.to?.station?.name || 'До'}</div>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 bg-gray-50 px-2 py-2 text-center font-medium text-sm">
                                                    Место {selectedSeat.number}
                                                </td>
                                                {(() => {
                                                    // Определяем ключ группировки для подряд идущих сегментов
                                                    const getGroupKey = (seg) => {
                                                        if (selectedSegments.some(s => s.id === seg.id)) return 'selected';
                                                        if (seg.ticketId) return `ticket:${seg.ticketId}`;
                                                        if (seg.seatReservationId) return `reserved:${seg.seatReservationId}`;
                                                        return 'available';
                                                    };

                                                    // Сборка групп подряд идущих сегментов с одинаковым ключом
                                                    // Но НЕ объединяем доступные сегменты
                                                    const groups = [];
                                                    let current = null;
                                                    for (let i = 0; i < availableSegments.length; i++) {
                                                        const seg = availableSegments[i];
                                                        const key = getGroupKey(seg);
                                                        
                                                        // Доступные сегменты не объединяем
                                                        if (key === 'available') {
                                                            if (current) {
                                                                groups.push(current);
                                                                current = null;
                                                            }
                                                            groups.push({ key, items: [seg] });
                                                        } else {
                                                            if (!current) {
                                                                current = { key, items: [seg] };
                                                            } else if (current.key === key) {
                                                                current.items.push(seg);
                                                            } else {
                                                                groups.push(current);
                                                                current = { key, items: [seg] };
                                                            }
                                                        }
                                                    }
                                                    if (current) groups.push(current);

                                                    const keyToClass = (key) => {
                                                        if (key === 'selected') return 'bg-blue-500 text-white';
                                                        if (key.startsWith('ticket:')) return 'bg-green-500 text-white cursor-not-allowed';
                                                        if (key.startsWith('reserved:')) return 'bg-yellow-400 text-yellow-900 cursor-not-allowed';
                                                        return 'bg-white hover:bg-blue-50 cursor-pointer';
                                                    };

                                                    const isDisabledKey = (key) => key.startsWith('ticket:') || key.startsWith('reserved:');

                                                    const handleGroupClick = (group) => {
                                                        if (isDisabledKey(group.key)) return;
                                                        // Переключаем все сегменты в группе
                                                        group.items.forEach(seg => {
                                                            if (!seg.ticketId && !seg.seatReservationId) {
                                                                selectSegment(seg);
                                                            }
                                                        });
                                                    };

                                                    return groups.map((group, idx) => {
                                                        const totalPrice = group.items.reduce((sum, seg) => sum + (seg.price || 0), 0);
                                                        let displayText = '';
                                                        
                                                        if (group.key === 'selected') {
                                                            displayText = totalPrice > 0 ? `${totalPrice} ₸ (${group.items.length})` : `✓ (${group.items.length})`;
                                                        } else if (group.key.startsWith('ticket:')) {
                                                            displayText = `Билет ${totalPrice > 0 ? totalPrice + ' ₸' : ''} (${group.items.length})`;
                                                        } else if (group.key.startsWith('reserved:')) {
                                                            displayText = `Резерв ${totalPrice > 0 ? totalPrice + ' ₸' : ''} (${group.items.length})`;
                                                        } else {
                                                            displayText = totalPrice > 0 ? (group.items.length > 1 ? `${totalPrice} ₸` : `${totalPrice} ₸`) : 'Доступно';
                                                        }

                                                        return (
                                                            <td 
                                                                key={`grp-${idx}`}
                                                                colSpan={group.items.length}
                                                                className={`border border-gray-300 px-2 py-4 text-center ${keyToClass(group.key)} transition-colors`}
                                                                onClick={() => handleGroupClick(group)}
                                                                title={`${mapSeatSegmentName(group.items[0])}${group.items.length > 1 ? ` - ${mapSeatSegmentName(group.items[group.items.length - 1])}` : ''}`}
                                                            >
                                                                <div className="text-sm font-semibold">
                                                                    {displayText}
                                                                </div>
                                                            </td>
                                                        );
                                                    });
                                                })()}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {selectedSegments.length > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                        <h5 className="font-semibold text-green-800 mb-2">
                                            Выбрано сегментов: {selectedSegments.length}
                                        </h5>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {selectedSegments.map(segment => (
                                                <div key={segment.id} className="text-green-700">
                                                    • {mapSeatSegmentName(segment)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {segmentsError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-start">
                                            <div className="text-red-600 mr-3 text-xl">⚠️</div>
                                            <div>
                                                <h5 className="font-semibold text-red-800 mb-1">Ошибка выбора сегментов</h5>
                                                <p className="text-red-700 text-sm">{segmentsError}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedSegments.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <h4 className="text-lg font-semibold text-blue-800 mb-4">📋 Подтверждение бронирования</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Поезд:</span>
                                                <p className="font-medium">{selectedTrain?.train?.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Вагон:</span>
                                                <p className="font-medium">{selectedWagon?.number}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Место:</span>
                                                <p className="font-medium">{selectedSeat?.number}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Сегменты:</span>
                                                <p className="font-medium">{selectedSegments.length} сегментов</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Дата отправления:</span>
                                                <p className="font-medium">
                                                    {departureDate ? new Date(departureDate).toLocaleDateString('ru-RU') : '-'}
                                                    {selectedTrain?.departureTime && ` в ${new Date(selectedTrain.departureTime).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
                </div>
            </HookForm>
        </ResourceSubmit>
    );
}
