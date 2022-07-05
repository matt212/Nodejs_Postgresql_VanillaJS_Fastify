- 📡 **[Platform Setup](#Platform-Setup)**

   🍕 [sh file Setup](#sh-file-Setup)
  
   🍤 [Setup](#app-Setup)
   
   🍔 [Basic Automation Test Case](#mocha-test-cases) 
   
   🍟 [Run](#app-Run)
   
   🍩 [Usage](#app-Usage)
   
   🍜 [SuperAdmin Usage](#app-SuperAdmin-Usage)
   
   🍘 [API Documentation Usage-Swagger](#app-API-Documentation-Usage(Swagger))


- 🚀 **[Project Statement](#project-statement)**


<h3 id="Platform-Setup">
Platform Setup
</h4>

#### <h3 id="sh-file-Setup">
🍕sh file Setup</h3>

> *`chmod +x ./app/utils/serverSetup/primarySetup.sh `*  

> *`sed -i -e 's/\r$//' ./app/utils/serverSetup/> primarySetup.sh`*

>*`chmod +x ./app/utils/serverSetup/secondarySetup.sh`*

>*`sed -i -e 's/\r$//' ./app/utils/serverSetup/secondarySetup.sh`*

>*`bash ./app/utils/serverSetup/primarySetup.sh`*

   

> _`Please note if you have node/postgres/redis server installed in your instance/machine. Please comment the install information in primarySetup.sh file and then run this file`_

#### <h3 id="app-Setup">
 🍤app Setup </h3>
> **node,postgres, redis and app dependencies  installation**

>*`bash ./app/utils/serverSetup/primarySetup.sh`*

>*`bash ./app/utils/serverSetup/secondarySetup.sh`*

#### <h3 id="mocha-test-cases">
 🍔 mocha chai tests against 20,00,000 recordsets</h3>

> _`npm run LoginEval or yarn LoginEval`_

> _`npm run ModuleEval or yarn ModuleEval`_


#### <h3 id="app-run">
 🍟 app Run </h3>
>*`npm run app or yarn app `*

#### <h3 id="app-Usage">
 🍩 app Usage </h3>

>*`goto localhost:3011/employees`*

>*`username : krennic and  password:orson`*

>*`select birthdate from dropdown and select date range any from 1982 to till date`*

#### <h3 id="app-SuperAdmin-Usage">
 🍜 app SuperAdmin Usage </h3>

>*`goto localhost:3011/black-squadron`*

>*`username : krennic and password:orson`*

>*`for any other controls other than textbox it is mandatory`*

>*`to enter PIPE "|" separator in textbox column for e.g genderid|gendername`*


#### <h3 id="app-API-Documentation-Usage(Swagger)">
 🍘 API Documentation Usage(Swagger) </h3>

>*`goto localhost:3011/getAccessToken`*

>*`Click on Get AccessToken button and copy the newly generated Access Token`*

>*`goto localhost:3012/api-docs`*

>*`Click on authorize and paste the access Token`*
  
  #### <h3 id="project-statement">
 🚀 Project Statement </h3>


  <style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-cly1{text-align:left;vertical-align:middle}
.tg .tg-lboi{border-color:inherit;text-align:left;vertical-align:middle}
.tg .tg-9dzu{background-color:#F4F5F7;text-align:left;vertical-align:middle}
.tg .tg-crcv{background-color:#F4F5F7;border-color:inherit;text-align:left;vertical-align:middle}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-crcv"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Driver<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></th>
    <th class="tg-lboi">&nbsp;&nbsp;&nbsp;<br>Rizwan Patel&nbsp;&nbsp;&nbsp;</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-crcv"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Approver<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-lboi">&nbsp;&nbsp;&nbsp;<br>Rizwan Patel&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Contributors<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>Rizwan Patel&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Informed<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>Rizwan Patel&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Objective<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>Build Modularize and Config Based&nbsp;&nbsp;&nbsp;Boilerplate platform with RBAC implementation for any project with basic&nbsp;&nbsp;&nbsp;automation test cases coverage.<br>&nbsp;&nbsp;&nbsp;<br>Tech Specs <br>&nbsp;&nbsp;&nbsp;<br>Server stack : Node.js <br>&nbsp;&nbsp;&nbsp;<br>Database Stack : PostgreSQL and&nbsp;&nbsp;&nbsp;Redis.<br>&nbsp;&nbsp;&nbsp;<br>Client Stack : Vanilla JavaScript&nbsp;&nbsp;&nbsp;(ES+)&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Due date<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>Since it is Vanity Project No Due&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Key&nbsp;&nbsp;&nbsp;outcomes<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>The outcomes would be boilerplate&nbsp;&nbsp;&nbsp;platform which delivers below<br>&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;<br>Server and Client: Transactional and Analytical&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reporting solution. <br>&nbsp;&nbsp;&nbsp;&nbsp;<br>Client : Client Side Scaffolding&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Solution for any Client Side implementation for any B2B and B2C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;verticals which are compatible with any server stacks (Java, C#,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Python,Node.js, Ruby and more) <br>&nbsp;&nbsp;&nbsp;&nbsp;<br>Server: Server Side Scaffolding for&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;any cross platform integration Solution (e.g Mobile Apps, complex SOA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;architecture systems and many more).&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;<br>So In order to Deliver above. <br>&nbsp;&nbsp;&nbsp;<br>The entities / modules should&nbsp;&nbsp;&nbsp;abide Below <br>&nbsp;&nbsp;&nbsp;<br>Two&nbsp;&nbsp;&nbsp;Mandates <br>&nbsp;&nbsp;&nbsp;<br>a. Config based Modularize&nbsp;&nbsp;&nbsp;programming approach.<br>&nbsp;&nbsp;&nbsp;<br>b. All the below features and&nbsp;&nbsp;&nbsp;functionalities should be Autogenerated with minimum User Input&nbsp;&nbsp;&nbsp;through Single Web Form.<br>&nbsp;&nbsp;&nbsp;<br>(e.g model names ,fields,&nbsp;&nbsp;&nbsp;datatypes and just few more) <br>&nbsp;&nbsp;&nbsp;<br>Features/Functionalities<br>&nbsp;&nbsp;&nbsp;<br>Conventional&nbsp;&nbsp;&nbsp;Levels :-<br>&nbsp;&nbsp;&nbsp;<br>1.CRUD operation .<br>&nbsp;&nbsp;&nbsp;<br>2.Pagination in API.<br>&nbsp;&nbsp;&nbsp;<br>3. Search : <br>&nbsp;&nbsp;&nbsp;<br>a.Multicolumns and Multiselect&nbsp;&nbsp;&nbsp;filter for search Operations.<br>&nbsp;&nbsp;&nbsp;<br>b.Consolidated Search Operations&nbsp;&nbsp;&nbsp;for across all columns of respective Module.<br>&nbsp;&nbsp;&nbsp;<br>4.Sort : <br>&nbsp;&nbsp;&nbsp;<br>a. All columns Dynamic Sort&nbsp;&nbsp;&nbsp;functionality for the respective module.<br>&nbsp;&nbsp;&nbsp;<br>b. Dynamic PageSize functionality.<br>&nbsp;&nbsp;&nbsp;<br>c. Newest and Oldest sort order&nbsp;&nbsp;&nbsp;functionality.<br>&nbsp;&nbsp;&nbsp;<br>Advanced&nbsp;&nbsp;&nbsp;Levels :-<br>&nbsp;&nbsp;&nbsp;<br>5.Basic ETL operation .<br>&nbsp;&nbsp;&nbsp;<br>(Upload and Download large File&nbsp;&nbsp;&nbsp;with socket IO implementation)<br>&nbsp;&nbsp;&nbsp;<br>In scope : 20,00,000 records in&nbsp;&nbsp;&nbsp;dataset with atleast 5 -6 columns of diverse columns (date range, age, number&nbsp;&nbsp;&nbsp;, address and more).<br>&nbsp;&nbsp;&nbsp;<br>6.Dynamic Pivot operation for the&nbsp;&nbsp;&nbsp;module .<br>&nbsp;&nbsp;&nbsp;<br>7.Applying Dynamic Pivot resultset&nbsp;&nbsp;&nbsp;for graphs and Charts.<br>&nbsp;&nbsp;&nbsp;<br>8. Basic Automation test cases&nbsp;&nbsp;&nbsp;Generation for the respective Module.<br>&nbsp;&nbsp;&nbsp;<br>9.Swagger API Implementation with&nbsp;&nbsp;&nbsp;Access token mechanism for respective Module.<br>&nbsp;&nbsp;&nbsp;<br>10.Custom RBAC Implementation for&nbsp;&nbsp;&nbsp;the platform.&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Status<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>complete&nbsp;&nbsp;&nbsp;</td>
  </tr>
</tbody>
</table>


 ### `Dynamic pivot operation with highchart implementation`

![redlime](app/video/gif/b2.gif)

- ### `Node.js stream based CSV download for more than 1000k recordsets from PostgresSQL with socket.io as progress feature`
  ![redlime](app/video/gif/c1.gif)

* ### `Automated Swagger for each Module created By build in scaffoding accessed at http://localhost:3012/api-docs/`

  ![redlime](app/video/gif/d.gif)

* ### `Basic dashboard operation`

![redlime](app/video/gif/a1.gif)

**Custom fractural pattern based app** :

> things which are plug and play

In case of error running sh Files Follow below
**sh file Setup**

> _`chmod +x ./app/utils/serverSetup/primarySetup.sh`_

> _`sed -i -e 's/\r$//' ./app/utils/serverSetup/primarySetup.sh`_

> _`chmod +x ./app/utils/serverSetup/secondarySetup.sh`_

> _`sed -i -e 's/\r$//' ./app/utils/serverSetup/secondarySetup.sh`_

> _`bash ./app/utils/serverSetup/primarySetup.sh`_

- new fields (datatypes string and ints ) ,
  config based modular apporach on server side `duh`.
- validation is implemented  by config based modular apporach on client side.
- <u> `modulerized everything baby` </u> concept for excel export ,import table rendering and dynamic pivot based filters !
- create, update , delete and search features is implemented for single table with complex queries multi join 
- every features be as may search, group by multiselect search is paginated to the core for effeciency and scalabliltiy and is modulerized to the barebone .
- single set depenendences routes wherein all dependencies are imported from dependencies core.
  > **_The essence is request and response structure which in turn is based on fractural pattern which is fuel for this custom ad -hoc
  > fractural beast of an app_**.

> oOh, I forgot stream based realtime **_2000k_** yup you read that right **_2000k_** with bare minimum hardware pick any lowest minimum droplet (digitalocean), aws instance for more or less \$5 a months and this ground up platform works seamlessly due to fine tune architecture 

- ### `Release notes 1 July 2022`

> **Superadmin scaffolding/ boilerplate Access URL**
 > *http://localhost:3011/black-squadron*
 
 > _`username : krennic and password:orson`_

 >`for any other controls other than textbox it is mandatory `

 >` to enter PIPE "|" separator in textbox column for e.g genderid|gendername` 


* ### `Boilerplate walkthrough with multi control(Radio and Checkbox-Data from respective db tables)`
![redlime](app/video/gif/f.gif)

* ### `Boilerplate walkthrough with multi control(Radio-Data from respective db table)`

![redlime](app/video/gif/e.gif)


- ### `Release notes 11 Feb 2021`

  >boilerplate for multiselect integration with radio and checkboxes completed 

- ### `Release notes 09 Feb 2021`

  >Applied in  boilerplate multi and single select Dynamic SQLConstruct with 360 degree coverage 

- ### `Release notes 06 Feb 2021`

  >for boilerplate multi and single select static mapping for edit and default rendering case scenarios completed
  
- ### `Release notes 29 Jan 2021`

  >validations applied for bolierplate dynamic radio button and checkboxes with 

- ### `Release notes 27 Jan 2021`

  >applied multi control for radio scaffolding 
 
- ### `Release notes 20 Jan 2021`

  >For rbac test cases modularized

  > `yarn mroleEval`

  > `yarn userroleEval`

- ### `Release notes 9 Jan 2021`

  >For rbac user-Role Mapping  module migrated to fastify with its 35 mocha chai test cases respectively 

  > `yarn mroleEval`

  > `yarn userroleEval`

- ### `Release notes 22 Dec 2020`
  >Dynamic Bolierplate generation completed for dataType Strings , Integers and BigInt data types config based
  
  >For rbac modname,muser modules migrated to fastify with their respective 43 and 63 mocha chai test cases
  
  >For rbac role module migrated to fastify with its 43 mocha chai test cases
  > `yarn ModEval`
  > `yarn roleEval`
 
- ### `Release notes 21 Dec 2020`
  > 73 **Modular** Mocha test cases against 20,00,000 recordset with 360 coverage including schema,NaN,Undefined,Multi Column Search,Multi Select,Pivot X and Y for pageSize and pageNo  payload Validations
  
  > `yarn ModuleEval`

- ### `Release notes 20 Dec 2020`
  > 73 **Modular** Mocha test cases against 20,00,000 recordset with 360 coverage including schema,NaN,Undefined,Multi Column Search,Multi Select,Pivot X and Y for pageSize and pageNo  payload Validations
  > `yarn ModuleEval`

- ### `Release notes 11 Dec 2020`
  > basic login tests are written and can view and evaluated by running below command
  > `yarn LoginEval`

- ### `Release notes 10 Dec 2020`
  > run `yarn perfgraph`
  > in new shell run autocannon `yarn customAutocannon`
  > when autocannon bench is completed go back to perfgraph shell and stop the shell (ctlrl+C)
  > it will generate graph html link in same perfgraph shell

- ### `Release notes 7 Dec 2020`
  > made date filter optional with code refractoring by introducing `disableDate=true` arguement in API payload.


  

  