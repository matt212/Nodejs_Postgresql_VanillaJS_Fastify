
select  to_char(birth_date ,'yyyy') as yr,to_char(birth_date ,'FMMM') as mnth,count(*)::int as cnt   from 
employees
--where 
--trim(both ' ' from to_char(birth_date ,'yyyy')) ='1965'
--and  trim(both ' ' from to_char(birth_date ,'month')) = 'august'
group by mnth, yr
order by  1,2 asc

select format_maskextract(month from days)
from(
  select generate_series(0,365) + date'2008-01-01' as days
)dates
group by 1
order by 1;



SELECT *
FROM   crosstab(
        'select  to_char(birth_date ,''yyyy'') as yr,to_char(birth_date ,''FMMM'') as mnth,count(*)::int as cnt   from 
employees
group by mnth, yr
order by  1,2 asc',
'select m from generate_series(01,12) m')
AS orders(
    yr text,
    "Jan" int,
  "Feb" int,
  "Mar" int,
  "Apr" int,
  "May" int,
  "Jun" int,
  "Jul" int,
  "Aug" int,
  "Sep" int,
  "Oct" int,
  "Nov" int,
  "Dec" int
);
select to_char(birth_date ,''MM'') as mnth from employees group by mnth



SELECT *
FROM   crosstab(
        'select  to_char(birth_date ,''yyyy'') as yr,to_char(birth_date ,''MM'') as mnth,count(*)::int as cnt   from 
employees
group by mnth, yr
order by  1,2 asc',
'select to_char(birth_date ,''MM'') as mnth from employees group by mnth order by 1')
AS orders(
    yr text,
    "Jan" int,
  "Feb" int,
  "Mar" int,
  "Apr" int,
  "May" int,
  "Jun" int,
  "Jul" int,
  "Aug" int,
  "Sep" int,
  "Oct" int,
  "Nov" int,
  "Dec" int
);



  select pivotcode('employees','to_char(birth_date ,''yyyy'')','to_char(birth_date ,''FMMM'')','count(*)','integer'); 
  
  select * from crosstab (
 'select to_char(birth_date ,''yyyy'') as yr ,to_char(birth_date ,''FMMM'') as m,count(*)as cnt from 
employees 
group by 1,2 
order by 1,2',
 'select distinct to_char(birth_date ,''FMMM'') from employees order by 1'
 )
 as newtable (yr varchar,_1 integer,_10 integer,_11 integer,_12 integer,_2 integer,_3 integer,_4 integer,_5 integer,_6 integer,_7 integer,_8 integer,
 _9 integer);
  