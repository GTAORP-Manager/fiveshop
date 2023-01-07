# Fiveshop
Fiveshop features an online dashboard for your GTA5-FiveM character!


## Feature-list
* Multi-Character management
  * Easily switch between characters
* Basic server dashboard
  * Name, Gamebuild, Connected clients
* All server resources
  * Ability to add own dashboards/managements for resources (eg. `esx_policejob` has its own police interface, restricted for cops)
* Advanced character details
  * Full name, date of birth, gender, height, job, money, server-group, inventory, loadout, licenses
  * All player owned vehicles
  * All pending bills
  * All online banking transactions
  * All player owned properties
* Online shop 
  * Online shop for vehicles (cars, aircrafts, boats)
  * Item shop (WIP)


## Installation

This installation assums you already have setup your own [txAdmin](https://txadm.in) server using ESX.
You may choose the recommended template during the installation process of txAdmin.

### 1) Ensure the following versions and settings are installed and applied

> txAdmin version: `4.^14.0`
>
> FXServer version: `5562`


### 2) Ensure the following resources are installed

#### Required ESX Resources
* `es_extended` (Framework)
* `esx_identity`
* `esx_multicharacter`
* `esx_banking`
* `esx_basicneeds`
* `esx_billing`
* `esx_joblisting`
* `esx_jobs`
* `esx_license`
* `esx_policejob`
* `esx_society`
* `esx_status`

#### Required external resources
* `esx_advancedgarage`
* `esx_advancedvehicleshop`
* `LegacyFuel` (Recommended)
* `PhoenixProperty`

Currently FiveShop works best using these resources, it is not testet in different enviroments.

### 3) Ensure the database is correctly setup

I recommend using [Beekeeper Studio Community Edition](https://github.com/beekeeper-studio/beekeeper-studio) to view the database in a graphical userinterface.

#### The following tables and colums are required (`key` : `type`)

> Table-Name: `banking`
>
> Colums: 
>
> `identifier:varchar(46):nullable:default=null`
>
> `type:varchar(50):nullable:default=null`
>
> `amount:int(64):nullable:default=null`
>
> `time:date:nullable:default=null`
>
> `id:int(11):autoincrement:primary`

> Table-Name: `billing`
>
> Colums:
>
> `id:int(11):autoincrement:primary`
>
> `identifier:varchar(46):nullable:default=null`
> 
> `sender:varchar(60)`
>
> `target_type:varchar(50)`
>
> `target:varchar(40)`
>
> `label:varchar(255)`
>
> `amount:int(11)`

## Development

#### FiveShop Development Stack (information only)
> Development Framework             [Next.js](https://nextjs.org)
>
> Database wrapper                  [Prisma](https://www.prisma.io)
>
> Caching                           [Redis](https://redis.io)
>
> Component-Library                 [Material UI](https://mui.com/material-ui/getting-started/overview/)  
