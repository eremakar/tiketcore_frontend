import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import { formatDate } from "@/components/genA/functions/datetime";

export default function TrainScheduleSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const [selectedTrainId, setSelectedTrainId] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const trainsResource = useResource('trains');
    const trainSchedulesResource = useResource('trainSchedules');

    // Генерируем список дат на 2 месяца вперед, начиная с текущей даты
    const generateDatesList = () => {
        const dates = [];
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 2);

        for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date).toISOString().split('T')[0]);
        }
        return dates;
    };

    const availableDates = generateDatesList();

    const toggleDateSelection = (date) => {
        if (selectedDates.includes(date)) {
            setSelectedDates(selectedDates.filter(d => d !== date));
        } else {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const selectAllDates = () => {
        setSelectedDates([...availableDates]);
    };

    const clearAllDates = () => {
        setSelectedDates([]);
    };

    const handleSubmit = async () => {
        if (!selectedTrainId || selectedDates.length === 0) {
            alert('Выберите поезд и добавьте хотя бы одну дату');
            return;
        }

        setIsSubmitting(true);
        try {
            // Используем специальный API для создания расписаний по датам
            const requestData = {
                trainId: selectedTrainId,
                dates: selectedDates.map(date => new Date(date).toISOString())
            };

            await trainSchedulesResource.post('/dates', requestData);
            onResourceSubmitted();
        } catch (error) {
            console.error('Ошибка создания расписаний:', error);
            alert('Ошибка при создании расписаний');
        } finally {
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
                {/* Выбор поезда */}
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

                {/* Выбор дат */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Даты отправления (выбрано: {selectedDates.length})
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={selectAllDates}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Выбрать все
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

                    {/* Календарная сетка дат */}
                    <div className="border border-gray-300 rounded-md max-h-80 overflow-y-auto">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedDates.length === availableDates.length && availableDates.length > 0}
                                    onChange={() => selectedDates.length === availableDates.length ? clearAllDates() : selectAllDates()}
                                    className="mr-3"
                                />
                                <span className="font-medium text-gray-700">Выберите даты</span>
                            </div>
                        </div>

                        {/* Сетка дат */}
                        <div className="grid grid-cols-7">
                            {availableDates.map((date, index) => {
                                const dateObj = new Date(date);
                                const dayNumber = dateObj.getDate();
                                const month = dateObj.getMonth();
                                const currentMonth = new Date().getMonth();
                                const isToday = date === new Date().toISOString().split('T')[0];
                                const isSelected = selectedDates.includes(date);
                                const isNewMonth = index > 0 && month !== new Date(availableDates[index - 1]).getMonth();

                                return (
                                    <div
                                        key={index}
                                        className={`
                                            relative p-2 border-r border-b border-gray-200 min-h-[40px] flex items-center justify-center cursor-pointer
                                            hover:bg-blue-50 transition-colors
                                            ${isSelected ? 'bg-blue-100' : ''}
                                            ${isToday ? 'bg-yellow-50 font-bold' : ''}
                                        `}
                                        onClick={() => toggleDateSelection(date)}
                                    >
                                        <div className="flex flex-col items-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleDateSelection(date)}
                                                className="mb-1"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className={`text-xs ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                                                {dayNumber}
                                            </span>
                                            {isNewMonth && month > currentMonth && (
                                                <span className="text-[10px] text-gray-500 mt-1">
                                                    {dateObj.toLocaleDateString('ru-RU', { month: 'short' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Кнопка создания */}
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
            </div>
        </ResourceSubmit>
    )
}
