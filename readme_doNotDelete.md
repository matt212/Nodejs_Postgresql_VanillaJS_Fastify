
** reporting fetching from million rows  **
this indexes is catch 22 if we apply below its works great for report but distarous for group by clause (multiselect and 
multicol filter)

CREATE INDEX ix_employees_gender_lower2 ON public.employees USING btree (lower((gender)::text) varchar_pattern_ops, gender)
--alternative col index approach
CREATE INDEX ix_employees_last_name_lower ON public.employees USING btree (lower((last_name)::text) varchar_pattern_ops)



=VLOOKUP($E2,$K$2:$L$2387,2,FALSE)
Sheet1

redis-cli flushall
https://explain.dalibo.com/plan#
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
for readmes table generaor

https://www.tablesgenerator.com/html_tables

** after workstation restart **
 > *`sudo service redis-server restart` *
 > *`sudo service postgresql restart` *

** Superadmin scafolding/ boilerplate**
 > *http://127.0.0.1:3011/black-squadron*
 > *`for any other controls other than textbox it is mandatory to enter` *
 > *` | separator in textbox column for e.g genderid|gendername` *
 

** multicolumn multiselect Indexing **
 > *`create index ix_employees_col_lower on employees (lower(first_name) varchar_pattern_ops);`*

**sh file Setup**
> *`chmod +x ./app/utils/serverSetup/primarySetup.sh `*  

> *`sed -i -e 's/\r$//' ./app/utils/serverSetup/> primarySetup.sh`*

>*`chmod +x ./app/utils/serverSetup/secondarySetup.sh`*

>*`sed -i -e 's/\r$//' ./app/utils/serverSetup/secondarySetup.sh`*

>*`bash ./app/utils/serverSetup/primarySetup.sh`*

*`basic dashboard operation`*
![redlime](app/video/gif/a.gif)

*`dynamic pivot operation with highchart implementation`*
![redlime](app/video/gif/b.gif)

*`Node.js stream based CSV download for 1000k from PostgresSQL with socket.io as progress feature`*
![redlime](app/video/gif/c.gif)

**app setup**
> **node and postgres**

> **node** 
> * `sudo apt update`
> * `sudo apt install nodejs`
> * `sudo apt install npm`
>**redis**
> * `sudo apt update`
> * `sudo apt install redis-server`
> * `goto sudo nano /etc/redis/redis.conf and change from [supervised no ] to [supervised systemd]`
> * `sudo service redis-server start`
> **postgres**
> * `sudo service postgresql status`
> * `sudo apt-get update`
> * `sudo apt-get install postgresql  postgresql-contrib`
> after postgres fresh install
> * `sudo -u postgres psql postgres`
> *  `\password postgres`
> locate SHOW hba_file using  *`psql "dbname='postgres' user='postgres' password='abc123' host='localhost'" -c 'SHOW hba_file'`
>* `sudo npm install -g module --unsafe-perm`
> run * `sudo nano /etc/postgresql/12/main/pg_hba.conf`
> `change peer to m`

> * `CREATE DATABASE demodb;`
> **uninstall node** 
> * `sudo apt-get remove nodejs`
> * `sudo apt-get remove npm`
> * `sudo apt purge nodejs`
> * `sudo apt purge npm`
> * `sudo apt-get update`
> * `sudo rm /usr/bin/node or sudo rm /usr/ocal/bin/node`

> **upgrading node**
> * `npm install -g n`
> * `n stable`

>**uninstall redis**
> *`sudo apt-get purge --auto-remove redis-server`
> **uninstall postgresql**
> * `https://askubuntu.com/questions/32730/how-to-remove-postgres-from-my-installation`
> * `sudo apt-get --purge remove postgresql`
> * `dpkg -l | grep postgres`
> * `sudo apt-get --purge remove postgresql postgresql-doc postgresql-common postgresql-12 postgresql-client-12`

**goto app folder**
> * `npm install` or `yarn`
> * `npm run preinstall` or `yarn preinstall`
> * `npm run createDB` or `yarn createDB`
> * `npm run pgRestore` or `yarn pgRestore`
> * `npm run app` or `yarn app`

**if app server deployment**
> * `npm run preinstall` or `yarn preinstall`
> * `npm run mig` or `yarn mig`
> * `npm run build` or `yarn build`

> **for enabling pivot**
> * `CREATE EXTENSION IF NOT EXISTS tablefunc`;

> **for some sequelize error** 
sudo npm install -g pg

> renaming folder 
git mv casesensitive tmp
git mv tmp CaseSensitive

> for plantUML setup with vscode
> \*refer this for windows envirnoment

- https://stackoverflow.com/questions/53856294/plantuml-extension-for-visual-studio-code-on-windows-only-working-with-sequence

> for swagger implementation in different repo

```

git clone https://github.com/swagger-api/swagger-editor.git
cd swagger-editor
npm install
npm run build
npm start

```

**_OR in same app_**

> got to root > swagger folder and use

       `swagger.yaml`

> for every time swagger file update
> run commands `yarn yaml2json`

> and access  
> http://localhost:3009/api-docs/ > **_for getting access Token to be used in swagger api_**

- goto /getAccessToken
- login with superadmin cred
- redirects to /accessTokenlisting
- click on `copy to clipboard`
- paste the same in swagger `Authorize` button overlay

> for self hosted CI 
> https://github.com/bleenco/abstruse/blob/master/docs/INSTALLATION.md#docker-image
> for windows issues
* https://github.com/ethereumjs/ethereumjs-util/issues/43
*   npm i -g uws@10.148.1 (for this issues Cannot find module 'uws')
---

**swagger routes dashboard**

> http://localhost:3009/swagger-stats/ui

**Custom fractural pattern based app** :

> things which are plug and play

- new fields (datatypes string and ints ) ,
  config based modular apporach on server side `duh`.
- validation is sly-ly implemented taken care by config based modular apporach on client side.
- <u> `modulerized everything baby` </u> concept for excel export ,import table rendering and dynamic pivot based filters !
- create, update , delete. search is implemented for single table and complex queries multi join alias based approach queries.
- every thing search, group by multiselect search is paginated to the core for effeciency and scalabliltiy.which goes without sayin is modulerized to the core .
- single set depenendences routes wherein all dependencies are imported from dependencies core.
  > **_The essence is request and response structure which in turn is based on fractural pattern which is fuel for this custom ad -hoc
  > fractural beast of an app_**.

> oOh, I forgot stream based realtime **_1000k_** yup you read that right **_1000k_**
>
> - record **_E_** import, export ,
>   **_TL_**(pivot , search multiselect multicolumn)
>   applications anything from
>   custom b2b app like crm etc .

> Work in progress
>
> - all control config and fully functional
>   (radio buttons, checkboxes, select,image gallery) is required mark for controls chanllenge is ui come all apply design schematics !
> - release builds minify and compress


> for installing  docker on ubuntu and 
 >* curl -fsSL get.docker.com -o get-docker.sh
 >*  chmod +x get-docker.sh
 >*  sudo ./get-docker.sh
 
 >  jenkins pull install 
 for running as container
  `sudo docker run -d -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts`


> to recover jenkins password
* `docker exec <container> cat /var/jenkins_home/secrets/initialAdminPassword`
* current password `9977af27365e4dbe8bb2c12f74ae588f`

> to stop localhost 
sudo kill $(sudo lsof -t -i:3009)

> for installing docker compose
> *https://docs.docker.com/compose/install/

> postgres useful commands !
> * https://zaiste.net/postgresql_primer_for_busy_people/

>>**for scaffolding**
> **server side**
> * update routes in `app/utils/app.js`
> * create folder with modname and create validationConfig.js in 
> *    `app/routes/utils/{modname}/validationConfig.js`
> * create routes filename with modname with {modname and modnameid}
> *    `app/routes/{modname}.js`
> * create models for modname in 
> *    `app/models/{modname}.js`
> * create swagger .yml in 
> *  `app/utils/swagger/docs/{modname}.js `
>> **for scaffolding client side**
> * create js file for client side modname  in   
> *    `app/public/app_{modname}.js`
> * create html file in  in 
> *    `app/view/{modname}/{modname}.html`

**remove install**
> * `chmod +x ./app/utils/serverSetup/remove-Setup.sh`
> * `sed -i -e 's/\r$//' ./app/utils/serverSetup/> remove-Setup.sh`
> * `bash ./app/utils/serverSetup/remove-Setup.sh`

>**********************Important notice for complex muti control form**
for create complex file like multi checkbox for complex multi control use respective module file for insert , update and delete *do not use modular code from baseutils inherit it and use it in module js files"


Steps for using scaffolding
1.for createing new table just select textbox and enter , new table would be created along with swagger and whole nine yards.
2.for using radio , checkbox used textbox first time to create table and use its dbtable when you want use radio button in form when it is intended. 
like for e.g 
for including sex radio button in in recruits form
first create sex table in db by inputting sex in fresh scaffolding
and use swagger to input data or form 
and then you can select from sex as dbtable while creating recruits form as fresh install


>>**for Muti control access data for EDIT AND update across use interimdatapayload child object of base**
>> for restart wsl ubuntu wslconfig /t Ubuntu
>>for containerX
amisize
ebsvolume
georegion

###############upgrading nodejs#####################
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | sh
source ~/.nvm/nvm.sh
nvm install --lts
nvm use --lts
npm --version