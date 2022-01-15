README
=====
This is an example ticketing system that utilizes microservices design, NATS message queue, Kubernates clustering (along with Docker), React and Next.js for frontend, Node.js for backend, mongodb for data, and Skaffold for improved DX with Kubernates.

About
-----
This is a learning project to increase my knowledge about microservices and the tooling in the javascript ecosystem context. The solutions is based on Stephen Grider's course "Microservices with Node JS and React" (https://www.udemy.com/course/microservices-with-node-js-and-react) that I've fiddled to test things and to make it look more like how I would have made it.

The solution is not meant to be used in any production system. I've put it into github just for myself and others to see as an example of a microservices project setup.

Prerequisites
--------------
- Docker (used with Desktop) (used Docker engine version 20.10.12)
- Kubernates / kubectl CLI tool (used version 1.22.5)
- Node.js (used version v17.3.0)
- Skaffold (used version v1.23.0)
- create-react-app

Optionally:
- Verdaccio (a npm registry) for self-hosted npm package management (`Dockerfile`s and `package.json` files have been configured to use custom registry from local address 192.168.1.103; that should be updated to point into local address if Verdaccio is run locally instead from a network server setup that I have used).

- Setting up host configuration where "ticketing.local" address is redirected into localhost (127.0.0.1) to work properly with the Kubernates setup (`infra/k8s/ingress-srv` nginx service relies on in order to be able to route the traffic between docker containers).

- The payment service uses Stripe (https://stripe.com) for managing the payments. A test account for stripe was used in this context.

About the architecture
-----------------------

Microservices for managing different tasks:

- auth: handles user authentication related things
  * has a mongodb database as a data storage
- tickets: handles event ticket creations, modifications, etc
  * has a mongodb database as a data storage
- orders: handles order creation, modifications, etc
  * has a mongodb database as a data storage
- expiration: watches orders that are pending completion and cancels them after timeout value (15 minutes)
  * has a Redis in-memory key-value store as a data storage
- payments: handles credit card payments and order cancellation/completion respectively on failing/succeeding payments.
  * has a mongodb database as a data storage
  * uses Stripe service for managing payments

Other services:
- NATS streaming server works as an event queue that receives and delivers events that are used on inter-service communication.
- ingress-srv is a nginx container that manages network traffic routing inside the Kubernates cluster
- client container serves the frontend resources (i.e. the React app)

Starting it up (development context)
-----------------------------------

### To prepare running the code:
The common library (`./common`) is expected to be found from the npm registry. There is a helper script `pub` located in the `./common/package.json` to publish a version from the common library to the configured npm registry (**Note:** verdaccio is used to prevent publishing the code into the public npmjs registry).

**To publish the common library, run the following command:**

```bash
(cd ./common & npm run build && npm publish)
```

Kubernates needs to be running. When using Docker Desktop, it is a matter of checking the "Kubernates" checkbox in settings (and saving & restarting as requested).
The services uses couple of secrets stored into Kubernates using the built-in secret store functionality. The secrets are used e.g. to sign JWT values used in the authentication.

**Setting up the Secrets into Kubernates:**
- `jwt-secret` (Kubernates secret key) - `JWT_KEY` (available as environment value)

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=change-me-to-some-secret
```

- `stripe-secret` (Kubernates secret key) - `STRIPE_KEY` (available as environment value)
```bash
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=change-me-to-test-stripe-key
```

### When ready to start
To start the cluster, just run `Skaffold dev` in the root directory containing the `skaffold.yaml` configuration file.

Todos
------
- Some of the services are lacking tests
- The nextjs/react client should be re-written with Typescript
- The tsconfig in common section could be merged into the root level tsconfig
- The Typescript version could be updated into the latest version

Acknowledgements
-----------------
The code, structure and architecture is largely based on the Udemy course "Microservices with Node JS and React" (https://www.udemy.com/course/microservices-with-node-js-and-react) by Stephen Grider. As he instructs the students to put the code into (public) Github repo when e.g. having troubles so it is easier to review it, I'm assuming he has no objection for me to have this code published to the public in the open source manner.

License (The Unlicense)
------------------------
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
