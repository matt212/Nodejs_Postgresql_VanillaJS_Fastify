select   ROLEID as RoleID,Rolename,  isactive , 
string_agg(distinct ModID::text,',') as ModID,
string_agg(distinct Modulename,',')as Modulename,
string_agg(distinct Accestype,',') as Accestype ,
string_agg(distinct mroleID::text,',') as mroleID from 
( 
select r.mroleid, r.isactive,rl.roleid AS ROLEID,n.modnameID as modID, n.Mname as Modulename,rl.rolename as Rolename, r.accesstype as Accestype  
from mrole r
left join modname n on r.modulename::int=n.modnameid
left join role rl on r.rolename::int=rl.roleid
join userrolemapping ur on ur.muserid=2
)
as a  GROUP BY ROLEID,Rolename,isactive