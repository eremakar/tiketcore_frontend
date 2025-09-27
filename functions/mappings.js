export const mapEmployeeName = (employee) => {
    if (!employee)
        return null;

    return employee.firstName + " " + employee.lastName + " " + employee.fatherName;
}
