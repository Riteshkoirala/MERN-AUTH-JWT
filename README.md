## Run Locally

To get started, you need to have [Node.js](https://nodejs.org/en) installed. You also need to have MongoDB installed locally ([download here](https://www.mongodb.com/docs/manual/installation/)), or you can use a cloud service like [MongoDB Atlas](https://www.mongodb.com/atlas/database). You will also need to create a [Resend](https://resend.com) account to send emails.

Clone the project

```bash
git clone https://github.com/nikitapryymak/mern-auth-jwt.git
```

Go to the project directory

```bash
cd mern-auth-jwt
```

Navigate to the backend directory

```bash
cd backend
```

Use the right node version (using [nvm](https://github.com/nvm-sh/nvm))

```bash
nvm use
```

Install Backend dependencies

```bash
npm install
```

Before running the server, you need to add your ENV variables. Create a `.env` file and use the `sample.env` file as a reference.
For development, you can set the `EMAIL_SENDER` to a random string, since the emails are sent with a resend sandbox account (when running locally).

```bash
cp sample.env .env
# open .env and add your variables
```

Start the MongoDB server (if running locally)

```bash
# using homebrew
brew services start mongodb-community@7.0
```

Start the API server

```bash
# runs on http://localhost:4004 (default)
npm run dev
```

Navigate to the frontend directory & install dependencies

```bash
cd ../frontend
npm install
```

Create a `.env` file at the root and add the `VITE_API_URL`. This is the URL of the backend API.

```bash
VITE_API_URL=http://localhost:4004
```

Start the dev server

```bash
# runs on http://localhost:5173
  npm run dev
```

### Postman Collection

There is a Postman collection in the `backend` directory that you can use to test the API. The `postman.json` contains requests for all the routes in the API. You can [import the JSON directly](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/#import-postman-data) into Postman.

## 🛠️ Build

To build either the frontend or backend, run the following command in the respective directory:

```bash
npm run build
```

To test the compiled API code, run:

```bash
# this runs the compiled code in the dist directory
npm run start
```
