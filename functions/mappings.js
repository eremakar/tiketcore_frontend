export const mapEmployeeName = (employee) => {
    if (!employee)
        return null;

    return employee.firstName + " " + employee.lastName + " " + employee.fatherName;
}

export const mapTrainScheduleName = (schedule) => {
    if (!schedule)
        return null;

    const date = schedule.date ? new Date(schedule.date).toLocaleDateString('ru-RU') : '';
    const trainName = schedule.train?.name || 'Поезд';
    
    return `${date} ${trainName}`;
}

export const mapSeatSegmentName = (segment) => {
    if (!segment)
        return null;

    const fromStation = segment.from?.station?.name || 'Не указано';
    const toStation = segment.to?.station?.name || 'Не указано';
    
    return `${fromStation} - ${toStation}`;
}
