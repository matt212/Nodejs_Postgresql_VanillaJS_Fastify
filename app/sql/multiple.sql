UPDATE employees AS v 
SET birth_date = s.created_at
FROM employees AS s
WHERE v.employeesid = s.employeesid




select date_trunc('day', birth_date - interval '1 month')  from employees
select date_trunc('day', birth_date - interval '2 month')  from employees
select date_trunc('day', birth_date - interval '3 month')  from employees
select date_trunc('day', birth_date - interval '4 month')  from employees
select date_trunc('day', birth_date - interval '5 month')  from employees

select date_trunc('day', birth_date - interval '1 year')  from employees
select date_trunc('day', birth_date - interval '2 year')  from employees
select date_trunc('day', birth_date - interval '3 year')  from employees
select date_trunc('day', birth_date - interval '4 year')  from employees
select date_trunc('day', birth_date - interval '5 year')  from employees


ALTER SEQUENCE employees_employees_id_seq RESTART 


https://github.com/sequelize/sequelize/issues/8417