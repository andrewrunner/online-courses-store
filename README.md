# Online courses store 

### Use
- [NestJS](https://nestjs.com/)
- RabbitMQ with nestjs-rmq (NestJS offers an out of the box microservices experience but misses out on some of the powerful functionality offered by individual transport layers)
- Nx (monorepo)
- MongoDB, Mongoose
- passport jwt and bcrypt
- class-validator


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