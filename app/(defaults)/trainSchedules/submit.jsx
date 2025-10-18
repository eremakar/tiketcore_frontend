import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import { adjustDateToTimezone, formatDate } from "@/components/genA/functions/datetime";
import { WorkflowTaskStates } from "@/models/workflowTaskStates";
import MultiWorkflowTaskMonitor from "@/components/genA/MultiWorkflowTaskMonitor";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import RouteStations from "@/app/(defaults)/routeStations/page";
import TrainWagonsPlanWagons from "@/app/(defaults)/trainWagonsPlanWagons/page";

export default function TrainScheduleSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const [selectedTrainId, setSelectedTrainId] = useState(null);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [workflowTaskIds, setWorkflowTaskIds] = useState([]);
    const [occupiedDates, setOccupiedDates] = useState([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    
    // Wizard state
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTrainWagonsPlan, setSelectedTrainWagonsPlan] = useState(null);
    const [selectedSeatTariff, setSelectedSeatTariff] = useState(null);
    
    // Новые поля для периодичности
    const [periodicityId, setPeriodicityId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [periodicities, setPeriodicities] = useState([]);
    
    // Списки для выбора
    const [trainWagonsPlans, setTrainWagonsPlans] = useState([]);
    const [seatTariffs, setSeatTariffs] = useState([]);
    
    // Query для RouteStations
    const [routeStationsQuery, setRouteStationsQuery] = useState({
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: { order: { operator: 'asc' } }
    });
    
    // Query для TrainWagonsPlanWagons
    const [trainWagonsPlanWagonsQuery, setTrainWagonsPlanWagonsQuery] = useState({
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: { id: { operator: 'asc' } }
    });

    // Инициализация выбранного поезда из resourceData
    useEffect(() => {
        if (resourceData?.trainId && !selectedTrainId) {
            setSelectedTrainId(resourceData.trainId);
            // Загружаем информацию о поезде
            const loadTrainInfo = async () => {
                try {
                    const train = await trainsResource.get(resourceData.trainId);
                    if (train) {
                        setSelectedTrain(train);
                    }
                } catch (error) {
                    console.error('Ошибка загрузки информации о поезде:', error);
                }
            };
            loadTrainInfo();
        }
    }, [resourceData, selectedTrainId]);

    const trainsResource = useResource('trains');
    const trainSchedulesResource = useResource('trainSchedules');
    const workflowTasksResource = useResource('workflowTasks');
    const periodicitiesResource = useResource('periodicities');
    const trainWagonsPlansResource = useResource('trainWagonsPlans');
    const seatTariffsResource = useResource('seatTariffs');

    // Загружаем справочники
    useEffect(() => {
        const loadReferences = async () => {
            try {
                const [periodicitiesRes, trainWagonsPlansRes] = await Promise.all([
                    periodicitiesResource.search({ paging: { skip: 0, take: 100 } }),
                    trainWagonsPlansResource.search({ paging: { skip: 0, take: 100 } })
                ]);
                setPeriodicities(periodicitiesRes?.result || []);
                setTrainWagonsPlans(trainWagonsPlansRes?.result || []);
            } catch (error) {
                console.error('Ошибка загрузки справочников:', error);
                setPeriodicities([]);
                setTrainWagonsPlans([]);
            }
        };
        loadReferences();
    }, []);

    // Автоматический выбор схемы поезда по имени
    useEffect(() => {
        if (selectedTrain?.name && trainWagonsPlans.length > 0 && !selectedTrainWagonsPlan) {
            const matchingPlan = trainWagonsPlans.find(plan => 
                plan.name && plan.name.toLowerCase().includes(selectedTrain.name.toLowerCase())
            );
            if (matchingPlan) {
                setSelectedTrainWagonsPlan(matchingPlan);
            }
        }
    }, [selectedTrain, trainWagonsPlans, selectedTrainWagonsPlan]);

    // Обновляем query для RouteStations при выборе поезда
    useEffect(() => {
        if (selectedTrain?.routeId) {
            setRouteStationsQuery({
                paging: { skip: 0, take: 100 },
                filter: {
                    routeId: {
                        operand1: selectedTrain.routeId,
                        operator: 'equals'
                    }
                },
                sort: { order: { operator: 'asc' } }
            });
        } else {
            setRouteStationsQuery({
                paging: { skip: 0, take: 100 },
                filter: {},
                sort: { order: { operator: 'asc' } }
            });
        }
    }, [selectedTrain]);

    // Обновляем query для TrainWagonsPlanWagons при выборе схемы
    useEffect(() => {
        if (selectedTrainWagonsPlan?.id) {
            setTrainWagonsPlanWagonsQuery({
                paging: { skip: 0, take: 100 },
                filter: {
                    planId: {
                        operand1: selectedTrainWagonsPlan.id,
                        operator: 'equals'
                    }
                },
                sort: { id: { operator: 'asc' } }
            });
        } else {
            setTrainWagonsPlanWagonsQuery({
                paging: { skip: 0, take: 100 },
                filter: {},
                sort: { id: { operator: 'asc' } }
            });
        }
    }, [selectedTrainWagonsPlan]);

    // Загружаем тарифы (все доступные)
    useEffect(() => {
        const loadSeatTariffs = async () => {
            try {
                const response = await seatTariffsResource.search({
                    paging: { skip: 0, take: 1000 }
                });
                setSeatTariffs(response?.result || []);
                console.log('Loaded seat tariffs:', response?.result?.length || 0);
            } catch (error) {
                console.error('Ошибка загрузки тарифов:', error);
                setSeatTariffs([]);
            }
        };
        loadSeatTariffs();
    }, []);

    // Загружаем существующие расписания при выборе поезда
    useEffect(() => {
        if (!selectedTrainId) {
            setOccupiedDates([]);
            return;
        }

        const loadExistingSchedules = async () => {
            setIsLoadingSchedules(true);
            try {
                // Получаем диапазон дат
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Используем конечную дату из формы или 12 месяцев по умолчанию
                let loadEndDate = new Date(today);
                if (endDate) {
                    loadEndDate = new Date(endDate);
                } else {
                    loadEndDate.setMonth(loadEndDate.getMonth() + 12);
                }
                
                // Загружаем существующие расписания для выбранного поезда
                const response = await trainSchedulesResource.search({
                    paging: { skip: 0, take: 10000 },
                    filter: {
                        trainId: {
                            operand1: selectedTrainId,
                            operator: 'equals'
                        },
                        date: {
                            operand1: adjustDateToTimezone(today),
                            operand2: adjustDateToTimezone(loadEndDate),
                            operator: 'between'
                        }
                    }
                });

                const schedules = response?.result || [];

                // Извлекаем даты отправления
                const dates = schedules.map(schedule => {
                    const date = new Date(schedule.date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                });

                console.log(`Загружено расписаний для поезда ${selectedTrainId}:`, schedules.length, 'занятые даты:', dates);
                setOccupiedDates(dates);
            } catch (error) {
                console.error('Ошибка загрузки расписаний:', error);
                setOccupiedDates([]);
            } finally {
                setIsLoadingSchedules(false);
            }
        };

        loadExistingSchedules();
    }, [selectedTrainId, endDate]);

    // Автоматический выбор дат по периодичности
    useEffect(() => {
        if (!startDate || !endDate || !periodicityId) {
            return;
        }

        const periodicity = periodicities.find(p => p.id === periodicityId);
        if (!periodicity) {
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            return;
        }

        const dates = [];
        const currentDate = new Date(start);
        const periodicityCode = periodicity.code || '';
        
        let dayCounter = 0;

        while (currentDate <= end) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            let shouldInclude = false;
            const dayOfWeek = currentDate.getDay(); // 0 = Вс, 1 = Пн, ..., 6 = Сб
            const dayOfMonth = currentDate.getDate();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            switch (periodicityCode) {
                case 'daily': // ежедневно
                    shouldInclude = true;
                    break;
                
                case 'everyOtherDay': // через день
                    shouldInclude = dayCounter % 2 === 0;
                    break;
                
                case 'oncePerWeek': // 1 раз в неделю
                    shouldInclude = dayCounter % 7 === 0;
                    break;
                
                case 'twicePerWeek': // 2 раза в неделю - Пн и Пт
                    shouldInclude = dayOfWeek === 1 || dayOfWeek === 5;
                    break;
                
                case 'thricePerWeek': // 3 раза в неделю - Пн, Ср, Пт
                    shouldInclude = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
                    break;
                
                case 'fourTimesPerWeek': // 4 раза в неделю - Пн, Вт, Чт, Пт
                    shouldInclude = dayOfWeek >= 1 && dayOfWeek <= 5 && dayOfWeek !== 3;
                    break;
                
                case 'fiveTimesPerWeekExceptTueWed': // 5 раза в неделю (кроме вт., ср.) - Пн, Чт, Пт, Сб, Вс
                    shouldInclude = dayOfWeek !== 2 && dayOfWeek !== 3;
                    break;
                
                case 'sixTimesPerWeekExceptTueWed': // 6 раза в неделю (кроме вт., ср.) - все кроме вт и ср
                    shouldInclude = dayOfWeek !== 2 && dayOfWeek !== 3;
                    break;
                
                case 'oncePerEightDays': // 1 раз в 8 дней
                    shouldInclude = dayCounter % 8 === 0;
                    break;
                
                case 'evenDaysExceptWeekendsHolidays': // по четным (кроме суб., вск. и праздников)
                    shouldInclude = dayOfMonth % 2 === 0 && !isWeekend;
                    break;
                
                case 'oddDays': // по нечетным
                    shouldInclude = dayOfMonth % 2 === 1;
                    break;
                
                case 'tuWedFriSatSun': // по дням недели (вт., ср., пят., суб., вск.)
                    shouldInclude = [2, 3, 5, 6, 0].includes(dayOfWeek);
                    break;
                
                case 'weekendsAndHolidays': // суб., вск. и праздничные дни
                    shouldInclude = isWeekend;
                    break;
                
                case 'byDates': // по датам - пользователь выбирает вручную
                    shouldInclude = false;
                    break;
                
                default:
                    shouldInclude = false;
                    break;
            }

            if (shouldInclude && !occupiedDates.includes(dateStr)) {
                dates.push(dateStr);
            }

            currentDate.setDate(currentDate.getDate() + 1);
            dayCounter++;
        }

        setSelectedDates(dates);
    }, [startDate, endDate, periodicityId, periodicities, occupiedDates]);

    // Генерируем календарь на квартал (3 месяца) вперед или до конечной даты
    const generateCalendar = () => {
        const calendar = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Определяем количество месяцев для отображения
        let monthsToShow = 3;
        if (endDate) {
            const end = new Date(endDate);
            const monthsDiff = (end.getFullYear() - today.getFullYear()) * 12 + (end.getMonth() - today.getMonth()) + 1;
            monthsToShow = Math.max(3, Math.min(monthsDiff, 12)); // От 3 до 12 месяцев
        }
        
        for (let monthOffset = 0; monthOffset < monthsToShow; monthOffset++) {
            const monthDate = new Date(today);
            monthDate.setMonth(monthDate.getMonth() + monthOffset);
            monthDate.setDate(1);
            
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            // Получаем день недели первого дня (0 = воскресенье, нужно сделать понедельник = 0)
            let startDay = firstDay.getDay() - 1;
            if (startDay < 0) startDay = 6; // Воскресенье становится последним днем
            
            const weeks = [];
            let week = new Array(7).fill(null);
            
            // Заполняем пустые дни в начале
            for (let i = 0; i < startDay; i++) {
                week[i] = null;
            }
            
            // Заполняем дни месяца
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(year, month, day);
                
                // Форматируем дату вручную, чтобы избежать проблем с часовыми поясами
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                // Только даты начиная с сегодня
                if (date >= today) {
                    week[startDay] = dateStr;
                }
                
                startDay++;
                if (startDay === 7) {
                    weeks.push(week);
                    week = new Array(7).fill(null);
                    startDay = 0;
                }
            }
            
            if (startDay > 0) {
                weeks.push(week);
            }
            
            calendar.push({
                year,
                month,
                monthName: firstDay.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
                weeks
            });
        }
        
        return calendar;
    };

    const calendar = generateCalendar();
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    const getAllDates = () => {
        const dates = [];
        calendar.forEach(month => {
            month.weeks.forEach(week => {
                week.forEach(date => {
                    if (date) dates.push(date);
                });
            });
        });
        return dates;
    };
    
    const availableDates = getAllDates();

    const toggleDateSelection = (date) => {
        // Не позволяем выбрать занятую дату
        if (occupiedDates.includes(date)) {
            return;
        }
        
        // Ручная корректировка выбранных дат
        if (selectedDates.includes(date)) {
            setSelectedDates(selectedDates.filter(d => d !== date));
        } else {
            setSelectedDates([...selectedDates, date].sort());
        }
    };

    const selectAllDates = () => {
        // Выбираем только доступные (не занятые) даты
        const freeDates = availableDates.filter(date => !occupiedDates.includes(date));
        setSelectedDates([...freeDates]);
    };

    const clearAllDates = () => {
        setSelectedDates([]);
    };

    // Wizard navigation
    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceedToNext = () => {
        switch (currentStep) {
            case 1: return selectedTrain && selectedTrain.route;
            case 2: return selectedTrainWagonsPlan;
            case 3: return selectedDates.length > 0;
            case 4: return selectedSeatTariff;
            default: return false;
        }
    };

    const handleAllTasksComplete = () => {
        setWorkflowTaskIds([]);
        setIsSubmitting(false);
        setSelectedDates([]);
        
        // Обновляем список занятых дат после создания новых расписаний
        if (selectedTrainId) {
            const loadExistingSchedules = async () => {
                try {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    // Используем конечную дату из формы или 12 месяцев по умолчанию
                    let loadEndDate = new Date(today);
                    if (endDate) {
                        loadEndDate = new Date(endDate);
                    } else {
                        loadEndDate.setMonth(loadEndDate.getMonth() + 12);
                    }
                    
                    const response = await trainSchedulesResource.search({
                        paging: { skip: 0, take: 10000 },
                        filter: {
                            trainId: {
                                operand1: selectedTrainId,
                                operator: 'equals'
                            },
                            date: {
                                operand1: adjustDateToTimezone(today),
                                operand2: adjustDateToTimezone(loadEndDate),
                                operator: 'between'
                            }
                        }
                    });

                    const schedules = response?.result || [];

                    const dates = schedules.map(schedule => {
                        const date = new Date(schedule.date);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    });

                    setOccupiedDates(dates);
                } catch (error) {
                    console.error('Ошибка загрузки расписаний:', error);
                }
            };
            loadExistingSchedules();
        }
        
        onResourceSubmitted();
    };

    const handleTaskError = (taskData) => {
        setIsSubmitting(false);
        alert(`Ошибка выполнения задачи: ${taskData.errorMessage || 'Неизвестная ошибка'}`);
    };

    const handleSubmit = async () => {
        if (!selectedTrainId) {
            alert('Выберите поезд');
            return;
        }
        
        if (!periodicityId) {
            alert('Выберите периодичность');
            return;
        }
        
        if (!startDate || !endDate) {
            alert('Укажите начальную и конечную дату');
            return;
        }
        
        if (selectedDates.length === 0) {
            alert('Нет дат для создания расписаний. Проверьте параметры периодичности и даты.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const trainName = selectedTrain?.name || `Поезд ${selectedTrainId}`;
            
            // Подготовка дат
            const formattedDates = selectedDates.map(date => {
                const [year, month, day] = date.split('-').map(Number);
                const result = new Date(year, month - 1, day);
                return adjustDateToTimezone(result);
            });

            // Создаем workflow task для поезда
            const taskId = await workflowTasksResource.create({
                name: `Создание расписаний для ${trainName}`,
                category: 'TrainSchedules',
                input: {
                    trainId: selectedTrainId,
                    dates: selectedDates
                },
                state: WorkflowTaskStates.NotStarted,
                priority: 1,
                maxRetries: 3
            });

            // Запускаем создание расписаний для этого поезда (выполняется в фоне)
            const requestData = {
                trainId: selectedTrainId,
                dates: formattedDates,
                workflowTaskId: taskId
            };

            trainSchedulesResource.post('/dates', requestData).catch(error => {
                console.error(`Ошибка создания расписаний для поезда ${trainName}:`, error);
            });

            setWorkflowTaskIds([taskId]);

        } catch (error) {
            console.error('Ошибка создания workflow task:', error);
            alert('Ошибка при создании задачи');
            setIsSubmitting(false);
        }
    };

    return (
        <ResourceSubmit
            resource={resource}
            show={show}
            setShow={setShow}
            resourceName={resourceName}
            resourceMode={resourceMode}
            resourceData={resourceData}
            onResourceSubmitted={onResourceSubmitted}
            onSubmit={handleSubmit}
            hideButtons={true}
            size="7xl"
        >
            <div className="space-y-6">
                {/* Прогресс выполнения */}
                {workflowTaskIds.length > 0 && (
                    <MultiWorkflowTaskMonitor
                        taskIds={workflowTaskIds}
                        trainNames={[selectedTrain?.name || `Поезд ${selectedTrainId}`]}
                        onAllComplete={handleAllTasksComplete}
                        onError={handleTaskError}
                        autoCloseDelay={5000}
                    />
                )}

                {/* Выбор поезда */}
                {workflowTaskIds.length === 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Создание расписания</h2>
                            {selectedTrain && (
                                <div className="text-sm text-green-600 font-medium">
                                    Выбран поезд: {selectedTrain.name}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Выбор маршрута (Поезда) *
                            </label>
                            <TrainLookup
                                useResource={() => trainsResource}
                                placeholder="Выберите поезд..."
                                value={selectedTrainId}
                                onChange={(trainId) => {
                                    setSelectedTrainId(trainId);
                                }}
                                onRowChange={(train) => {
                                    if (train && (!train.planId || !train.routeId)) {
                                        alert('Нельзя выбрать этот поезд: ' + 
                                            (!train.planId && !train.routeId ? 'не указан состав и маршрут' :
                                             !train.planId ? 'не указан состав' : 'не указан маршрут'));
                                        setSelectedTrainId(null);
                                        setSelectedTrain(null);
                                        return;
                                    }
                                    setSelectedTrain(train);
                                }}
                                formatValue={(train) => {
                                    if (!train) return '';
                                    const hasNoPlan = !train.planId;
                                    const hasNoRoute = !train.routeId;
                                    let statusText = '';
                                    
                                    if (hasNoPlan && hasNoRoute) {
                                        statusText = ' ❌ не указан состав и маршрут';
                                    } else if (hasNoPlan) {
                                        statusText = ' ❌ не указан состав';
                                    } else if (hasNoRoute) {
                                        statusText = ' ❌ не указан маршрут';
                                    } else {
                                        statusText = ' ✓';
                                    }
                                    
                                    return `${train.name || `Поезд ${train.id}`}${train.code ? ` (${train.code})` : ''}${statusText}`;
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Wizard Header */}
                {workflowTaskIds.length === 0 && (
                    <>

                        {/* Wizard Steps */}
                        <div className="flex items-center justify-between mb-8">
                            {[
                                { id: 1, title: 'Маршрут', icon: '📍' },
                                { id: 2, title: 'Схема поезда', icon: '🚂' },
                                { id: 3, title: 'Расписание', icon: '📅' },
                                { id: 4, title: 'Тарифная сетка', icon: '💰' },
                                { id: 5, title: 'Итого', icon: '✅' }
                            ].map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                        currentStep >= step.id 
                                            ? 'bg-blue-500 border-blue-500 text-white' 
                                            : 'bg-gray-100 border-gray-300 text-gray-400'
                                    }`}>
                                        <span className="text-sm font-medium">
                                            {currentStep > step.id ? '✓' : step.icon}
                                        </span>
                                    </div>
                                    <span className={`ml-2 text-sm font-medium ${
                                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        {step.title}
                                    </span>
                                    {index < 4 && (
                                        <div className={`mx-4 h-0.5 w-8 ${
                                            currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Wizard Content */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[400px]">
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    {selectedTrain && selectedTrain.route ? (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-4 text-sm text-green-700">
                                                    <span className="text-lg font-semibold text-gray-800">Маршрут поезда:</span>
                                                    <span><strong>Поезд:</strong> {selectedTrain.name}</span>
                                                    <span className="text-green-400">|</span>
                                                    <span><strong>Маршрут:</strong> {selectedTrain.route.name}</span>
                                                    <span className="text-green-400">|</span>
                                                    <span><strong>Откуда:</strong> {selectedTrain.from?.name || 'Не указано'}</span>
                                                    <span className="text-green-400">|</span>
                                                    <span><strong>Куда:</strong> {selectedTrain.to?.name || 'Не указано'}</span>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                <RouteStations 
                                                    defaultQuery={routeStationsQuery}
                                                    fullHeight={false}
                                                    hideFilters={true}
                                                    hideActions={true}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-700">
                                                Сначала выберите поезд выше, чтобы увидеть информацию о маршруте.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            План вагонов *
                                        </label>
                                        <select
                                            value={selectedTrainWagonsPlan?.id || ''}
                                            onChange={(e) => {
                                                const plan = trainWagonsPlans.find(p => p.id === parseInt(e.target.value));
                                                setSelectedTrainWagonsPlan(plan);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Выберите план вагонов</option>
                                            {trainWagonsPlans.map(plan => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name || `План ${plan.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {selectedTrainWagonsPlan && (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-center gap-4 text-sm text-blue-700">
                                                    <span className="text-lg font-semibold text-gray-800">Схема поезда:</span>
                                                    <span><strong>План:</strong> {selectedTrainWagonsPlan.name || `План ${selectedTrainWagonsPlan.id}`}</span>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                <TrainWagonsPlanWagons 
                                                    defaultQuery={trainWagonsPlanWagonsQuery}
                                                    fullHeight={false}
                                                    isFilter={false}
                                                    isSort={false}
                                                    hideActions={true}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Выбор расписания</h3>
                                    
                                    {/* Периодичность и даты */}
                                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-md font-semibold text-gray-800">Параметры расписания</h4>
                                        
                                        {/* Периодичность */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Периодичность *
                                            </label>
                                            <select
                                                value={periodicityId || ''}
                                                onChange={(e) => setPeriodicityId(e.target.value ? parseInt(e.target.value) : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Выберите периодичность</option>
                                                {periodicities.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Даты в одной строке */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Начальная дата *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Конечная дата *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Календарь */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Календарь (выбрано: {selectedDates.length} дат)
                                                </label>
                                                {periodicityId && periodicities.find(p => p.id === periodicityId) && (
                                                    <div className="text-xs text-blue-600 font-medium">
                                                        Периодичность: {periodicities.find(p => p.id === periodicityId)?.name}
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-600">Даты выбраны автоматически по периодичности. Можно скорректировать вручную.</span>
                                                {isLoadingSchedules && (
                                                    <div className="text-xs text-gray-500">Загрузка существующих расписаний...</div>
                                                )}
                                                {!isLoadingSchedules && occupiedDates.length > 0 && (
                                                    <div className="text-xs text-green-600">Уже создано расписаний: {occupiedDates.length}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Календарь по месяцам */}
                                        <div className="overflow-x-auto">
                                        <div className="flex gap-4 pb-4">
                                        {calendar.map((monthData, monthIndex) => (
                                            <div key={monthIndex} className="border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 min-w-[300px]">
                                                {/* Заголовок месяца */}
                                                <div className="bg-blue-500 text-white px-4 py-3 text-center font-semibold capitalize">
                                                    {monthData.monthName}
                                                </div>

                                                {/* Дни недели */}
                                                <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-300">
                                                    {weekDays.map((day, i) => (
                                                        <div key={i} className="py-2 text-center text-sm font-medium text-gray-700 border-r border-gray-300 last:border-r-0">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Недели */}
                                                {monthData.weeks.map((week, weekIndex) => (
                                                    <div key={weekIndex} className="grid grid-cols-7">
                                                        {week.map((date, dayIndex) => {
                                                            if (!date) {
                                                                return (
                                                                    <div
                                                                        key={dayIndex}
                                                                        className="p-3 border-r border-b border-gray-200 min-h-[60px] bg-gray-50"
                                                                    />
                                                                );
                                                            }

                                                            // Парсим дату из строки формата YYYY-MM-DD
                                                            const [year, month, day] = date.split('-').map(Number);
                                                            const dayNumber = day;
                                                            
                                                            const todayStr = (() => {
                                                                const now = new Date();
                                                                return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                            })();
                                                            const isToday = date === todayStr;
                                                            const isSelected = selectedDates.includes(date);
                                                            const isWeekend = dayIndex >= 5;
                                                            const isOccupied = occupiedDates.includes(date);

                                                            return (
                                                                <div
                                                                    key={dayIndex}
                                                                    className={`
                                                                        p-3 border-r border-b border-gray-200 min-h-[60px] transition-all
                                                                        ${isOccupied ? 'bg-green-100 cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-blue-50'}
                                                                        ${isSelected && !isOccupied ? 'bg-blue-100 border-blue-400' : ''}
                                                                        ${!isOccupied && !isSelected ? 'bg-white' : ''}
                                                                        ${isToday ? 'ring-2 ring-yellow-400' : ''}
                                                                        ${isWeekend && !isOccupied ? 'bg-gray-50' : ''}
                                                                    `}
                                                                    onClick={() => !isOccupied && toggleDateSelection(date)}
                                                                    title={isOccupied ? 'Расписание уже создано' : ''}
                                                                >
                                                                    <div className="flex flex-col items-center justify-center h-full">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isSelected}
                                                                            disabled={isOccupied}
                                                                            onChange={() => !isOccupied && toggleDateSelection(date)}
                                                                            className="mb-2"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                        <span className={`text-lg font-medium ${isOccupied ? 'text-green-600' : isToday ? 'text-yellow-600 font-bold' : isWeekend ? 'text-red-600' : 'text-gray-700'}`}>
                                                                            {dayNumber}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Выбор тарифной сетки</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Тариф мест *
                                        </label>
                                        <select
                                            value={selectedSeatTariff?.id || ''}
                                            onChange={(e) => {
                                                const tariff = seatTariffs.find(t => t.id === parseInt(e.target.value));
                                                setSelectedSeatTariff(tariff);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Выберите тариф мест</option>
                                            {seatTariffs.map(tariff => (
                                                <option key={tariff.id} value={tariff.id}>
                                                    {tariff.name || `Тариф ${tariff.id}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {selectedSeatTariff && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <h4 className="font-medium text-yellow-800 mb-2">Выбранный тариф:</h4>
                                            <p className="text-sm text-yellow-700">
                                                <strong>Название:</strong> {selectedSeatTariff.name || `Тариф ${selectedSeatTariff.id}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Итого</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <h4 className="font-medium text-gray-800 mb-3">Параметры расписания:</h4>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>Поезд:</strong> {selectedTrain?.name || 'Не выбран'}</p>
                                                <p><strong>Маршрут:</strong> {selectedTrain?.route?.name || 'Не указан'}</p>
                                                <p><strong>Схема поезда:</strong> {selectedTrainWagonsPlan?.name || 'Не выбрана'}</p>
                                                <p><strong>Тариф:</strong> {selectedSeatTariff?.name || 'Не выбран'}</p>
                                                <p><strong>Периодичность:</strong> {periodicities.find(p => p.id === periodicityId)?.name || 'Не выбрана'}</p>
                                                <p><strong>Период:</strong> {startDate} - {endDate}</p>
                                                <p><strong>Количество дат:</strong> {selectedDates.length}</p>
                                            </div>
                                        </div>
                                        
                                        {selectedDates.length > 0 && (
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="font-medium text-blue-800 mb-2">Выбранные даты:</h4>
                                                <div className="text-sm text-blue-700">
                                                    {selectedDates.slice(0, 10).map(date => (
                                                        <span key={date} className="inline-block mr-2 mb-1">
                                                            {formatDate(new Date(date))}
                                                        </span>
                                                    ))}
                                                    {selectedDates.length > 10 && (
                                                        <span className="text-gray-500">... и еще {selectedDates.length - 10}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wizard Navigation */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Назад
                            </button>
                            
                            <div className="text-sm text-gray-500">
                                Шаг {currentStep} из 5
                            </div>

                            {currentStep < 5 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!canProceedToNext()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Далее
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !canProceedToNext()}
                                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? 'Создание...' : 'Создать расписание'}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </ResourceSubmit>
    )
}
