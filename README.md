# Opening Hours React Component Challenge

GitHub Pages live demo link: https://jt4y.github.io/opening-hours-react/

### Running and testing
- Run the app by running ```npm run```
- Test the app by running ```npm test```

### Extras I installed:
- @mui/lab
- date-fns for date/time localisation (requirement for MUI timepicker)
- sass so I can write in it
- axois for http requests
- material icons for save button

### Other things I did:
- I did not use bootstrap, but I could have. Instead I wrote some simple scss using flexbox
- I used visibility on the timepickers as we only have a small explicit set number of rows. If it were a larger, or dynamic amount then removing the element from the DOM entirely may be a better option for performance, but in this instance it's most likely negligible. 
- When unchecking a day, I have chosen that the times are cleared.
- I took into consideration mobile, so I usually work from a mobile-first perspective. It looks OK on mobile, but would spend some more time on it.
- I used JSON, but could use GraphQL if using Apollo or AWS AppSync etc.

### Saving the form
I decided to use AWS to save the Opening Hours. For simplicity's sake I used S3 to store the JSON.
The implentation is below
- I created a Node Lambda function for the business logic
- I created an API Gateway as an endpoint for the Lambda function
- I created an S3 bucket to store the data (this would be a database in reality, but this is a quick and easy place to save the JSON for demonstration)
- I added an IAM statement to Lambda so it could access the S3 bucket
- There's no authentication, but I would implement Cognito w/ JWTs, auth0 or use an oAuth provider if real world
- Has open CORS policies but this would be locked down if real world
- Uses axios for http requests to API Gateway

### Things I need to do more research about:
- Having never used React I am not sure how far to break down a component at the moment
- Need to do some more learning with React Testing Library
- Again - Best practices - this is something I would go over with the team to understand how we approach development best practices and make sure we're all on the same page. This would be an ongoing discussion and is important. Things like, project structure, state management, testing, css naming conventions.

### Things that I may use or do if more time:
- Could use/setup TypeScript
- Use a store and possibly Redux, need to do some more learing/research around it
- Write some more unit tests to mock getting times and to test form submission
- A little more form validation on client and validation in node (Lambda)
- Some more work around error messaging, for example handling multiple error messages and highlighting the specific error inputs.
- It does not currently use WebSockets or Poll for updates to the opening times