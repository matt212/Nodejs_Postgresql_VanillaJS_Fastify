### Badges
[![Node.js Postgres Vanilla Fastify CI](https://github.com/matt212/Nodejs_Postgresql_VanillaJS_Fastify/actions/workflows/node.js.yml/badge.svg)](https://github.com/matt212/Nodejs_Postgresql_VanillaJS_Fastify/actions/workflows/node.js.yml)

[![GitHub Clones ](https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=count&url=https://gist.githubusercontent.com/matt212/fff906f983d73f42eadc74ab93701a83/raw/clone.json&logo=github)](https://github.com/matt212/Nodejs_Postgresql_VanillaJS_Fastify/actions/workflows/cloneCount.yml)



### Tech stacks
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)


<details>
 <summary id="problem-statement">🚄 Problem Statement </summary><blockquote>

 ![redlime](app/video/img/problem-statement.png)
<!--<table class="tg">
<thead>
  <tr>
    <td class="tg-0pky">Who<br></td>
    <td class="tg-0pky">Who has the problem?<br></td>
    <td class="tg-0pky"> Any Dev or Dev Team building project from Scratch or Migrating Existing Piece <br></td>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">What</td>
    <td class="tg-0pky">What is the problem?</td>
    <td class="tg-0pky">Conventional scaffolding / boilerplate does not cater to all  Key outcomes pointers</td>
  </tr>
  <tr>
    <td class="tg-0pky">Where</td>
    <td class="tg-0pky">When/Where the problem is occurring?</td>
    <td class="tg-0pky">During any project execution stage and even in planning phase  Team Has to spend a lot time and energy to plan, discuss and execute the project key outcomes mentioned as part of *solution statement*  mentioned above and thus planning and execution are pain points.</td>
  </tr>
  <tr>
    <td class="tg-0pky">Why</td>
    <td class="tg-0pky">why is it important to address?</td>
    <td class="tg-0pky">It is important to address because it would save time , energy of team members which in turn cascades  to finances, deadlines and other Factors.  </td>
  </tr>
</tbody>
</table>
 -->
 </details>


<details open>

<summary id="project-statement" href="#project-statement">
🚀 Solution Statement- Key Outcomes
</summary><blockquote>
   
  <details>
 <summary id="Objective">🍨 Objective </summary><blockquote>

![redlime](app/video/img/objective.png)

</details>
   
<details>
 <summary id="mandates">🍰 Mandates </summary><blockquote>

![redlime](app/video/img/mandates.png)

</details>
    
<details>
 <summary id="Conventional-Levels">🍦 Features/Functionalities : Conventional Levels</summary><blockquote>

![redlime](app/video/img/conventional.png)

</details>

<details>
 <summary id="Advanced-Levels">🍧 Features/Functionalities : Advanced Levels</summary><blockquote>

![redlime](app/video/img/advanced.png)


</details>
</details>
<details>
 <summary id="scope-statement">🎫 
 Scope Statement
 </summary><blockquote>

![redlime](app/video/img/Scope.png)

</details>


<details>
<summary id="Platform-Setup" href="#Platform-Setup">
📡  Platform Setup 
</summary>
<blockquote>
   
<details>

<summary id="sh-file-Setup" >
🍕sh file Setup
</summary>

> *`chmod +x ./app/utils/serverSetup/primarySetup.sh `*  

> *`sed -i -e 's/\r$//' ./app/utils/serverSetup/> primarySetup.sh`*

>*`chmod +x ./app/utils/serverSetup/secondarySetup.sh`*

>*`sed -i -e 's/\r$//' ./app/utils/serverSetup/secondarySetup.sh`*

>*`bash ./app/utils/serverSetup/primarySetup.sh`*

   

> _`Please note if you have node/postgres/redis server installed in your instance/machine. Please comment the install information in primarySetup.sh file and then run this file`_
</details>
  
  <details>
<summary id="app-Setup" >
🍤app Setup
</summary>
  
> **node,postgres, redis and app dependencies  installation**

>*`bash ./app/utils/serverSetup/primarySetup.sh`*

>*`bash ./app/utils/serverSetup/secondarySetup.sh`*
</details>


<details>
<summary id="mocha-test-cases" >
🍔 mocha chai tests against 20,00,000 recordsets
</summary>

> _`npm run LoginEval or yarn LoginEval`_

> _`npm run ModuleEval or yarn ModuleEval`_
</details>

<details>
<summary id="app-Run" >
🍟 app Run
</summary>

>*`npm run app or yarn app `*
</details>



<details>
<summary id="app-Usage" >
🍩 app Usage
</summary>

>*`goto localhost:3011/employees`*

>*`username : krennic and  password:orson`*

>*`select birthdate from dropdown and select date range any from 1982 to till date`*

</details>


<details>
<summary id="app-SuperAdmin-Usage" >
 🍜 app SuperAdmin Usage
</summary>

>*`goto localhost:3011/black-squadron`*

>*`username : krennic and password:orson`*

>*`for any other controls other than textbox it is mandatory`*

>*`to enter PIPE "|" separator in textbox column for e.g genderid|gendername`*

</details>


<details>
<summary id="app-API-Documentation-Usage(Swagger)" >
 🍘 API Documentation Usage(Swagger)
</summary>

>*`goto localhost:3011/getAccessToken`*

>*`Click on Get AccessToken button and copy the newly generated Access Token`*

>*`goto localhost:3012/api-docs`*

>*`Click on authorize and paste the access Token`*

</details>

</details>






<details open>
 <summary id="walkthrough-section">💈 Walkthroughs : Features/Functionalities </summary>
 <blockquote>
 <br/>
<details>
    <summary>🍇 Dynamic pivot operation from Postgres with highchart implementation (Redis Cached)
</summary>
 <br/>

![redlime](app/video/gif/pivot-final.gif)
</details>

<br/>
<details>
 <summary >🍊 Node.js stream based CSV download for more than 1000k recordsets from PostgresSQL with socket.io as progress feature</summary>
<br/>

  ![redlime](app/video/gif/c1.gif)
</details>
<br/>

<details>
 <summary >🍑 Automated Swagger for each Module created By build in scaffoding accessed at http://localhost:3012/api-docs/ </summary>
<br/>

  ![redlime](app/video/gif/d.gif)
</details>
<br/>

<details>
 <summary >🍐 Basic dashboard operation</summary>
<br/>

![redlime](app/video/gif/basic-dashboard.gif)
</details>
<br/>
<details>
 <summary >🍓 Boilerplate walkthrough with multi control(Radio and Checkbox-Data from respective db tables) with Automated mocha test Cases</summary>
<br/>

![redlime](app/video/gif/f.gif)
</details>
<br/>

<details>
 <summary >🍏 Boilerplate walkthrough with multi control(Radio-Data from respective db table) with Automated mocha test Cases</summary>
<br/>

![redlime](app/video/gif/e.gif)

</details>
<br/>
</details>


</details>
<details open>

<summary id="project-timelines" href="#project-timelines">
🤖 Deliverables Timeline
</summary><blockquote>
   
  <details>
 <summary id="Obj2022">🥑 2022 </summary><blockquote>

![redlime](app/video/img/ph4.png)

</details>
   
<details>
 <summary id="Obj2021">🌽 2021 </summary><blockquote>

![redlime](app/video/img/ph3.png)

</details>
    
<details>
 <summary id="Obj2020">🍄 2020</summary><blockquote>

![redlime](app/video/img/ph1.png)
![redlime](app/video/img/ph2.png)

</details>

</details>

#### 
 <details>
 <summary id="release-section">🍫 Releases</summary><blockquote>



- ### `Release notes 23 July 2022`

  >Optimized Dynamic Multi Column , Multi Select  filter from 5 secs to 16 ms for 2   million rows . 
  >[My stack overflow solution](https://stackoverflow.com/a/73085784/1333794)
   


- ### `Release notes 21 July 2022`

  >base and pivot Operation optimized
  
  >incremental load (pagination section loaded after report rendered) for base report
  
  >incremental load (pagination section loaded after report rendered) for pivot report   


- ### `Release notes 19 July 2022`

  >github actions
  >Integrated CI-workflows with redis, postgres for automation mocha test cases
  >
  >[Github Action - Automation mocha test cases](https://github.com/matt212/Nodejs_Postgresql_VanillaJS_Fastify/runs/7475512509?check_suite_focus=true )
   
- ### `Release notes 18 July 2022`

  >Implemented basic dark theme   


- ### `Release notes 17 July 2022`

  >Implemented Redis based Server-Side Caching for Pivot Operations  


- ### `Release notes 1 July 2022`

> **Superadmin scaffolding/ boilerplate Access URL**
 > *http://localhost:3011/black-squadron*
 
 > _`username : krennic and password:orson`_

 >`for any other controls other than textbox it is mandatory `

 >` to enter PIPE "|" separator in textbox column for e.g genderid|gendername` 




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
</details>


  </details>

 <details>
 <summary id="project-statement">
 🚁 Project Statement </summary><blockquote>

![redlime](app/video/img/merge_from_ofoct.jpg)

<!-- ![redlime](app/video/img/h1.png)
![redlime](app/video/img/h2.png)
![redlime](app/video/img/h3.png)
![redlime](app/video/img/mandates1.png)
![redlime](app/video/img/conventional1.png)
![redlime](app/video/img/advanced1.png) -->

</details>

<details open> 
<summary id="Code-Flow" href="#code-flow"> 🛰️ Architecture 
</summary><blockquote>
<details>
<summary id="Server-Side-Code-Flow" href="#Server-Side-Code-Flow"> 🌯 Server Side 
</summary><blockquote>

<details> <summary id="route-structure-module-operations">🥐 Route Structure Module Operations </summary>

![redlime](app/video/img/route-structure-module-operations.png) 
</details>



<details> <summary id="module-view-ejs">🥗 Module View (EJS) Render </summary>

![redlime](app/video/img/module-view-ejs.png) 
</details>


<details> <summary id="module-load-operations">🍲 Module Load Operations </summary>

![redlime](app/video/img/module-load-operations.png) 
</details>


<details> <summary id="multipurpose-features-operations">🍟 Multipurpose Features Operations </summary>

![redlime](app/video/img/multipurpose-features-operations.png) 
</details>


<details> <summary id="groupby-operations">🧆 Groupby Operations </summary>

![redlime](app/video/img/groupby-operations.png) 
</details>


<details> <summary id="create-operations">🥞 Create Operation </summary>

![redlime](app/video/img/create-operations.png) 
</details>


<details> <summary id="update-operations">🥨 Update Operations </summary>

![redlime](app/video/img/update-operations.png) 
</details>


<details> <summary id="upload-operations">🥖 ETL Upload Operations </summary>

![redlime](app/video/img/upload-operations.png) 
</details>


<details> <summary id="download-operations">🥐 ETL Download Operations </summary>

![redlime](app/video/img/download-operations.png) 
</details>

<details> <summary id="api-cache-operations">🍳 Api Cache Operations</summary>

![redlime](app/video/img/api-cache-operations.png) 
</details>

<details> <summary id="api-cache-drilldown">🥙 Api Cache Operations-Drilldown</summary>

![redlime](app/video/img/api-cache-drilldown.png) 
</details>


</details>
<!--client side -->
<details> 

<summary id="Client-Side-Code-Flow" href="#Client-Side-Code-Flow"> 🛸 Client Side 
</summary><blockquote>



<details > <summary id="view_structure_and_page_operations">✈️ View Structure and Page Operations </summary>

![redlime](app/video/img/view_structure_and_page_operations.png) 
</details>
<details> <summary id="page_load_and_date_range_operations">🛩️ Page Load and Date Range Operations </summary>

![redlime](app/video/img/page_load_and_date_range_operations.png) 
</details>
<details> <summary id="sort_and_pagination_operations">
🛶 Sort and Pagination Operations </summary>

![redlime](app/video/img/sort_and_pagination_operations.png) 
</details>
<details> <summary id="Filter_operations">🪂 Filter Operations </summary>

![redlime](app/video/img/Filter_operations.png) 
</details>
<details> <summary id="create_and_update_Operations">⛵ Create and Update Operations </summary>

![redlime](app/video/img/create_and_update_Operations.png) 
</details>
<details> <summary id="Field_validations">⛴️ Field Validations </summary>

![redlime](app/video/img/Field_validations.png) 
</details>
<details> <summary id="event_listners">🚤 Field Validations-Event listeners </summary>

![redlime](app/video/img/event_listners.png) 
</details>
<details> <summary id="app_module-actionFunctions">🤿 App Module-ActionFunctions </summary>

![redlime](app/video/img/app_module-actionFunctions.png) 
</details>

<details > <summary id="pivotoperations">🛷 Pivot Operations </summary>

![redlime](app/video/img/pivotoperations.png) 
</details>


<details> <summary id="etl-upload-operations">🏝️ ETL upload Operations </summary>

![redlime](app/video/img/etl-upload-operations.png) 
</details>


<details> <summary id="etl-download-user-actions">🍱 ETL download user Actions</summary>

![redlime](app/video/img/etl-download-user-actions.png) 
</details>


<details> <summary id="etl-download-operations">🍣 ETL download Operations</summary>

![redlime](app/video/img/etl-download-operations.png) 
</details>




</details>
</details>
<details open> 
<summary id="Release-Flow" href="#Release-Flow"> 🍍 Release Flow 
</summary><blockquote>

<details > <summary id="nodejs-web-app-Env-pt1">🥥 Nodejs Web App Env Release Mechanism Pt-1 </summary>

![redlime](app/video/img/nodejs-web-app-Env-pt1.png) 
</details>
<details> <summary id="nodejs-web-app-Env-pt2">🍒 Nodejs Web App Env Release Mechanism Pt-2 </summary>

![redlime](app/video/img/nodejs-web-app-Env-pt2.png) 
</details>
<details> <summary id="how-to-release-node-app">
🍌 How to Release Node App </summary>

![redlime](app/video/img/how-to-release-node-app.png) 
</details>



</details>

  
<br/>


#### 🍱Reach out to me 🍝 🍤

[![Linkedin Profile](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
)](https://www.linkedin.com/in/rizwan-patel/)
<a href="mailto:captainprice212@gmail.com?"><img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/></a>