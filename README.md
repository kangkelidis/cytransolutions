Taxi Management Web App

Introduction

A web application that allows taxi companies to mange their bookings and invoices.
It was built using JavaScript, React and NextJS with a MongoDB database to store the data.

Project Overview

The app uses a database to store clients, drivers, bookings and invoices.
It generates invoices for clients that prefer to pay at the end of the month for their rides.
When a new such booking is added it will check if it should be added in an existing invoice or create a new one.
It can then save multiple invoices as pdfs (using jsPDF) and sent each one to the client it belongs to.
 
NextAuth is used for authorisation and authentication. Only registered users  are permitted to access to the site.
And their role determines how they can interact with the data. A user can have one of three roles. Admin, Manager or Driver.
An admin has no restrictions to his/her privileges. A manager cannot register new users, only an admin can.
And a driver can only add, edit, view and delete the bookings his been involved in.

It also provides a dashboards that provides an overview of the company's performance and a set of quick actions.
And a calendar that displays the day's bookings color coded for each driver.

The site is responsive and designed to work on mobile devices.

Overview of the site's functionality.
A user can log in using his/her registered email and password
The sidebar hides links that the user is not allowed access and can be expanded on larger screens.

https://github.com/alekosomegas/cytransolutions/assets/64306207/50b7508c-f27d-47bf-847f-8e98ae3abdf7


https://github.com/alekosomegas/cytransolutions/assets/64306207/60117a6c-9eb6-4665-99b5-44d85584b916

https://github.com/alekosomegas/cytransolutions/assets/64306207/679fd8f8-9362-4402-8926-c62d2d35db60

https://github.com/alekosomegas/cytransolutions/assets/64306207/53dc73c6-4d09-4be3-bd54-780f61bb364e

https://github.com/alekosomegas/cytransolutions/assets/64306207/cbba62d3-2719-4bc9-a7cf-ade0a151b07c

https://github.com/alekosomegas/cytransolutions/assets/64306207/cdeae16d-9ddd-4d05-8e37-72e4f7d376a6

https://github.com/alekosomegas/cytransolutions/assets/64306207/2e71cdb6-82f6-400b-af78-996a2e23bbba

