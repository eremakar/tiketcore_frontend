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
import WorkflowTaskMonitor from "@/components/genA/WorkflowTaskMonitor";

export default function TrainScheduleSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const [selectedTrainId, setSelectedTrainId] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [workflowTaskId, setWorkflowTaskId] = useState(null);
    const [occupiedDates, setOccupiedDates] = useState([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

    const trainsResource = useResource('trains');
    const trainSchedulesResource = useResource('trainSchedules');
    const workflowTasksResource = useResource('workflowTasks');

    // Загружаем существующие расписания при выборе поезда
    useEffect(() => {
        if (!selectedTrainId) {
            setOccupiedDates([]);
            return;
        }

        const loadExistingSchedules = async () => {
            setIsLoadingSchedules(true);
            try {
                // Получаем диапазон дат (сегодня + 3 месяца)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const endDate = new Date(today);
                endDate.setMonth(endDate.getMonth() + 3);
                
                // Загружаем существующие расписания для выбранного поезда
                const response = await trainSchedulesResource.search({
                    paging: { skip: 0, take: 1000 },
                    filter: {
                        trainId: {
                            operand1: selectedTrainId,
                            operator: 'equals'
                        },
                        date: {
                            operand1: adjustDateToTimezone(today),
                            operand2: adjustDateToTimezone(endDate),
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

                setOccupiedDates(dates);
            } catch (error) {
                console.error('Ошибка загрузки расписаний:', error);
                setOccupiedDates([]);
            } finally {
                setIsLoadingSchedules(false);
            }
        };

        loadExistingSchedules();
    }, [selectedTrainId]);

    // Генерируем календарь на квартал (3 месяца) вперед
    const generateCalendar = () => {
        const calendar = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
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
        
        if (selectedDates.includes(date)) {
            setSelectedDates(selectedDates.filter(d => d !== date));
        } else {
            setSelectedDates([...selectedDates, date]);
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

    const handleTaskComplete = (taskData) => {
        setWorkflowTaskId(null);
        setIsSubmitting(false);
        setSelectedDates([]);
        
        // Обновляем список занятых дат после создания новых расписаний
        if (selectedTrainId) {
            const loadExistingSchedules = async () => {
                try {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const endDate = new Date(today);
                    endDate.setMonth(endDate.getMonth() + 3);
                    
                    const response = await trainSchedulesResource.search({
                        paging: { skip: 0, take: 1000 },
                        filter: {
                            trainId: {
                                operand1: selectedTrainId,
                                operator: 'equals'
                            },
                            date: {
                                operand1: adjustDateToTimezone(today),
                                operand2: adjustDateToTimezone(endDate),
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
        if (!selectedTrainId || selectedDates.length === 0) {
            alert('Выберите поезд и добавьте хотя бы одну дату');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Создаем workflow task
            const taskId = await workflowTasksResource.create({
                name: `Создание расписаний для поезда ${selectedTrainId}`,
                category: 'TrainSchedules',
                input: {
                    trainId: selectedTrainId,
                    dates: selectedDates
                },
                state: WorkflowTaskStates.NotStarted,
                priority: 1,
                maxRetries: 3
            });

            setWorkflowTaskId(taskId);

            // Подготовка данных
            const requestData = {
                trainId: selectedTrainId,
                dates: selectedDates.map(date => {
                    const [year, month, day] = date.split('-').map(Number);
                    const result = new Date(year, month - 1, day);
                    return adjustDateToTimezone(result);
                }),
                workflowTaskId: taskId
            };

            // Запускаем создание расписаний (выполняется в фоне)
            trainSchedulesResource.post('/dates', requestData).catch(error => {
                console.error('Ошибка создания расписаний:', error);
                setIsSubmitting(false);
                setWorkflowTaskId(null);
            });

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
        >
            <div className="space-y-6">
                {/* Прогресс выполнения */}
                {workflowTaskId && (
                    <WorkflowTaskMonitor
                        taskId={workflowTaskId}
                        onComplete={handleTaskComplete}
                        onError={handleTaskError}
                        autoCloseDelay={5000}
                    />
                )}

                {/* Выбор поезда */}
                {!workflowTaskId && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Поезд *
                        </label>
                        <FormField
                            resource={trainsResource}
                            type="resourceselect"
                            name="trainId"
                            mode="portal"
                            label="Поезд"
                            value={selectedTrainId}
                            onChange={setSelectedTrainId}
                            isValidated={true}
                        />
                    </div>
                )}

                {/* Выбор дат */}
                {!workflowTaskId && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Даты отправления (выбрано: {selectedDates.length})
                                </label>
                                {isLoadingSchedules && (
                                    <span className="text-xs text-gray-500">Загрузка существующих расписаний...</span>
                                )}
                                {!isLoadingSchedules && occupiedDates.length > 0 && (
                                    <span className="text-xs text-red-500">Занято дат: {occupiedDates.length}</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={selectAllDates}
                                    disabled={isLoadingSchedules}
                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Выбрать все доступные
                                </button>
                                <button
                                    type="button"
                                    onClick={clearAllDates}
                                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Очистить
                                </button>
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
                )}

                {/* Кнопка создания */}
                {!workflowTaskId && (
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedTrainId || selectedDates.length === 0}
                            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Создание...' : `Создать ${selectedDates.length} расписаний`}
                        </button>
                    </div>
                )}
            </div>
        </ResourceSubmit>
    )
}
