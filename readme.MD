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
    <summary >🍇 Dynamic pivot operation with highchart implementation
</summary>
 <br/>

![redlime](app/video/gif/b2.gif)
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

![redlime](app/video/gif/a1.gif)
</details>
<br/>
<details>
 <summary >🍓 Boilerplate walkthrough with multi control(Radio and Checkbox-Data from respective db tables)</summary>
<br/>

![redlime](app/video/gif/f.gif)
</details>
<br/>

<details>
 <summary >🍏 Boilerplate walkthrough with multi control(Radio-Data from respective db table)</summary>
<br/>

![redlime](app/video/gif/e.gif)

</details>
<br/>
</details>



#### 
 <details>
 <summary id="release-section">🍫 Releases</summary><blockquote>

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
 🚀 Project Statement </summary><blockquote>
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
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br><h3 id="Objective">Objective</h3><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>Build Modularize and Config Based&nbsp;&nbsp;&nbsp;Boilerplate platform with RBAC implementation for any project with basic&nbsp;&nbsp;&nbsp;automation test cases coverage.<br>&nbsp;&nbsp;&nbsp;<br>Tech Specs <br>&nbsp;&nbsp;&nbsp;<br>Server stack : Node.js <br>&nbsp;&nbsp;&nbsp;<br>Database Stack : PostgreSQL and&nbsp;&nbsp;&nbsp;Redis.<br>&nbsp;&nbsp;&nbsp;<br>Client Stack : Vanilla JavaScript&nbsp;&nbsp;&nbsp;(ES+)&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Due date<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>Since it is Vanity Project No Due&nbsp;&nbsp;&nbsp;Date&nbsp;&nbsp;&nbsp;&nbsp;</td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br><h3 id="Key-outcomes">Key outcomes</h3><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1"><p>The outcomes would be boilerplate platform which delivers below</p>
<ul>
    <li>
        <p><u>Server and Client:</u> Transactional and Analytical Reporting &nbsp;solution.&nbsp;</p>
    </li>
    <li>
        <p><u>Client</u> : Client Side Scaffolding Solution for any Client Side implementation for any B2B and B2C verticals which are compatible with any server stacks (Java, C#, Python,Node.js, Ruby and more)&nbsp;</p>
    </li>
    <li>
        <p><u>Server</u>: Server Side Scaffolding for any cross platform integration Solution (e.g Mobile Apps, complex SOA architecture systems and many more).&nbsp;</p>
    </li>
</ul>
<p>&nbsp;So In order to Deliver above.&nbsp;</p>
<p>The &nbsp;entities / modules should abide Below&nbsp;</p>
<h3><em><strong><u><h3 id="mandates-statement">Two Mandates</h3></u></strong></em> <button><svg width="24" height="24">
            <g fill="currentColor" fill-rule="evenodd">
                <path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path>
                <path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path>
            </g>
        </svg></button></h3>
<p>a. Config based Modularize programming approach.</p>
<p>b. All the below features and functionalities should be <strong><u>Autogenerated</u>&nbsp;</strong>with minimum User Input through Single Web Form.</p>
<p>(e.g model names ,fields, datatypes and just few more)&nbsp;</p>
<p><strong><u>Features/Functionalities</u></strong></p>
<h4><em><strong><u><h3 id="Conventional-Levels">Conventional Levels :-</h3> </u></strong></em><button><svg width="24" height="24">
            <g fill="currentColor" fill-rule="evenodd">
                <path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path>
                <path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path>
            </g>
        </svg></button></h4>
<p>1.CRUD operation .</p>
<p>2.Pagination in API.</p>
<p>3. <u>Search</u> : &nbsp;</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; a.Multicolumns and Multiselect filter for search Operations.</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; b.Consolidated Search Operations for across all columns of respective &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Module.</p>
<p>4.<u>Sort</u> :&nbsp;</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;a. All columns Dynamic Sort functionality for the respective module.</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;b. Dynamic PageSize functionality.</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;c. Newest and Oldest sort order functionality.</p>
<h4><em><strong><u><h3 id="Advanced-Levels">Advanced Levels :-</h3></u></strong></em><button><svg width="24" height="24">
            <g fill="currentColor" fill-rule="evenodd">
                <path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path>
                <path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path>
            </g>
        </svg></button></h4>
<p>5.Basic ETL operation .</p>
<p>(Upload and Download large File with socket IO implementation)</p>
<p>In scope : 20,00,000 records in dataset with atleast 5 -6 columns of diverse columns (date range, age, number , address and more).</p>
<p>6.Dynamic Pivot operation for the module .</p>
<p>7.Applying Dynamic Pivot resultset for graphs and Charts.</p>
<p>8. Basic Automation test cases Generation for the respective Module.</p>
<p>9.Swagger API Implementation with Access token mechanism for respective Module.</p>
<p>10.Custom RBAC Implementation for the platform.</p></td>
  </tr>
  <tr>
    <td class="tg-9dzu"><span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span><br>Status<span style="background-color:#F4F5F7">&nbsp;&nbsp;&nbsp;</span></td>
    <td class="tg-cly1">&nbsp;&nbsp;&nbsp;<br>complete&nbsp;&nbsp;&nbsp;</td>
  </tr>
</tbody>
</table>
</details>

  

  