import { db } from "../db/connection";

// TODO: read this 

//? investor
export const makeProposeService = async () => {}; //! adding investment propose 

//? investor
export const trackProposeService = async () => {}; //! isn't this for the INVESTOR?? the figma shows it as it's for the EMPLOYEE!

//? employee + investor
export const getAllProposesService = async () => {}; //! show all investment proposes to handel them + another API for filtering the investments by the locations or the type

//? employee
export const getProposeInfoService = async () => {}; //! what is a propose?? is it just a location and a type?? could there be a file??

//? employee
export const approveProposeService = async () => {}; 

//? employee
export const refuseProposeService = async () => {};

//? employee
export const addSugsService = async () => {}; //! suggest for the investor 

//? investor + employee
export const showSugsMapService = async () => {}; //! the ones suggested by employees ON MAP

//? investor + employee
export const showSugsListService = async () => {}; //! the ones suggested by employees ON LIST

//? employee 
export const suggestPlaceService = async () => {}; //! check the next one

//? investor 
export const askForPlaceService = async () => {}; //! did not see that in the use cases but it make sense with the previous use case!  

