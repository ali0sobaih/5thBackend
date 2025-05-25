import { db } from "../db/connection";

// TODO: read this

//? investor
export const makeProposeService = async () => {
    
};

//? investor
export const trackProposeService = async () => {};
//! isn't this for the INVESTOR?? the figma shows it as it's for the EMPLOYEE!
//* Don't take naming so seriously. the UI Designer is copying and pasting interfaces then modifying them
//* he must've forgotten.
//* So it makes sense that the result of this function is for the investor to see.
//! BUT DO NOT BE MISTAKEN. event though the result is for the investor.
//! the one using causing this function to run is the EMPLOYEE because of his update to the status
//! the investor should only receive the update as a notification rather than request
//* Side note: the screen you saw is for the following service function.

//? employee + investor
export const getAllProposesService = async () => {};
//! show all investment proposes to handel them + another API for filtering the investments by the locations or the type
//* 1. One api should be fine. just utilize path queries for filtering
//* 2. Remember to separate investor result from employee results 

//? employee
export const getProposeInfoService = async () => {};
//! what is a propose?? is it just a location and a type?? could there be a file??
//* The propose consists of location, type (who is suggestion) and a name could also include a description

//? employee
export const approveProposeService = async () => {}; 

//? employee
export const refuseProposeService = async () => {}; 

//? investor + employee
//! Make sure to use a better naming convention. (for future references of this file)
export const showSuggestionsMapService = async () => {};
//! the ones suggested by employees ON MAP
//* That's correct

//? investor + employee
//! Make sure to use a better naming convention. (for future references of this file)
export const showSuggestionsListService = async () => {};
//! the ones suggested by employees ON LIST
//* Same as before, although you don't need to separate apis/services
//* let the front-end devs handle the display options

//? employee
export const suggestPlaceService = async () => {};
//! check the next one
//* Checked

//? investor
export const askForPlaceService = async () => {};
//! did not see that in the use cases but it make sense with the previous use case!
//* I have no Idea what that is and I need more clarification on the matter.
