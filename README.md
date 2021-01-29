# install dependencies
```bash
$ yarn
```

# create CSV file of users that will be deprovisioned
```bash
$ yarn csv
```

# deprovision the oldest users that exceed environment var MAX_USERS (or 240 if not set)
```bash
$ yarn clean
```