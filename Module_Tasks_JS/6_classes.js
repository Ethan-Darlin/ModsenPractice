class Employee {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
    calculateSalary() {
        return this.salary * 12;
    }
}

class Manager extends Employee {
    constructor(name, salary, department) {
        super(name, salary);
        this.department = department;
    }
    calculateSalary() {
        return super.calculateSalary() * 1.1; // 10%
    }
}

const m1 = new Manager('Ivan Erokhovets', 5000, 'sales');
const m2 = new Manager('Dima Volikov', 5500, 'sales');

console.log(m1.calculateSalary()); // 66000
console.log(m2.calculateSalary()); // 72600
