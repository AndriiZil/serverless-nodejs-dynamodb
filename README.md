### Serverless API example

```
    sls deploy
```
### For destroying
```
    sls remove
```

### Example endpoints
```
    POST - https://5m0jrg67kj.execute-api.eu-central-1.amazonaws.com/dev/candidates
    GET - https://5m0jrg67kj.execute-api.eu-central-1.amazonaws.com/dev/candidates
    GET - https://5m0jrg67kj.execute-api.eu-central-1.amazonaws.com/dev/candidates/{id}
```
### Body for POST Request
```
    "fullname": "Rober Williams",
    "email": "robert.williams@gmail.com",
    "experience": 10
```