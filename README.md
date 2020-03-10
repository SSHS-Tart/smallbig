# smallbig chatbot
## Prerequisites

Make sure you installed [Node.js](https://nodejs.org/) and [yarn](hhttps://yarnpkg.com/).
When using windows, install unix tools and git bash from [git](https://git-scm.com/download/win).
The setup instructions assume a bash environment.

## Initial setup

Clone this repository and install all dependencies: 

``` shell
$ git clone https://github.com/SSHS-Tart/smallbig.git
$ cd smallbig
$ yarn
```

You should create an env file for the chatbot's credentials.
Make a `.env` file with the credentials:

``` shell
$ touch .env
$ cat <<EOF > .env
FB_EMAIL="address@example.com"
FB_PWD="superstrongpassword"
EOF
```

Start the chatbot:

``` shell
$ node src/index.js
```

On first run, the chatbot will make an `appstate.json` file that is reused on successive runs.
This contains various credentials for the chatbot's facebook account - don't commit this file.
