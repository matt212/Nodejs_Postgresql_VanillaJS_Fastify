> _`Please note if you have node/postgres/redis server installed in your instance/machine. Please comment the install information in primarySetup.sh file and then run this file`_

**app setup**

> **node,postgres, redis and app dependencies installation**

> _`bash ./app/utils/serverSetup/primarySetup.sh`_

> _`bash ./app/utils/serverSetup/secondarySetup.sh`_

**Mocha chai tests against 20,00,000 recordsets**

> _`npm run LoginEval or yarn LoginEval`_

> _`npm run ModuleEval or yarn ModuleEval`_

**app run**

> _`npm run app or yarn app`_

**app usage**

> _`goto localhost:3011/employees`_

> _`username : krennic and password:orson`_

> _`select birthdate from dropdown and select date range any from 1982 to till date`_

- ### `Dynamic pivot operation with highchart implementation`

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


  

  