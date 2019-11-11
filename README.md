## Slack Validator MicroService

#### Validates Slack Requests
Verifies that requests were actually sent from Slack

- Looks for raw body in header as `x-raw-body`
- Looks for request token in header as `x-raw-token`
- Supply the following environmental variables (retrieve these values from your Slack app):
 - SIGNING_SECRET
 - VERIFICATION_TOKEN
