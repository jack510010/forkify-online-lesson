/*
into this file, we will basically put all the variables that should be constants,
and should be reused across the project.

and the goal of having this file with all these variables 
is that it will allow us to easily configure our project by simply changing some of the data,
that is here in this configuration file.

So therefore the name "config.js".

The only variables that we do want here are the ones,
that are responsible for kind of defining some important data,
about the application itself.
*/

// using uppercase here means basically, this is a constant that will never change.
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const KEY = 'f27db5be-76fa-42ab-a348-56634aae5888';
export const MODAL_CLOSE_SEC = 3;