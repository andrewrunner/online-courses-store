# Online courses store 

### Use
- [NestJS](https://nestjs.com/)
- RabbitMQ
- Nx (monorepo)
- MongoDB, Mongoose
- passport jwt and bcrypt
- class-validator


NestJS offers an out of the box microservices experience with support for a variety of transports. However, because NestJS microservices strives to work with a variety of transport mechanisms in a generic way, it misses out on some of the powerful functionality offered by individual transport layers.

Some of the most notable missing functionality includes common messaging patterns like publish/subscribe and competing consumers.


```sh
#To run the dev server for account service
npx nx serve accounts

#To run the dev servers for all services
npx nx run-many --target=serve --all --parallel=4

#To create a production bundle
npx nx build accounts

#To see all available targets to run for a project

npx nx show project accounts


#To generate a new application
npx nx g @nx/nest:app demo

#To generate a new library
npx nx g @nx/node:lib mylib

#To connect to Nx Cloud, run the following command:
npx nx connect

#Use the following command to configure a CI workflow for your workspace:
npx nx g ci-workflow
```