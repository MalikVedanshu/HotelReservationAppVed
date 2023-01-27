import { check } from "express-validator";

function datesGenerator(checkinNumber, checkoutNumber) {
    let twentyFourHours = 1000 * 60 * 60 * 24;
    let counterNumber = checkinNumber;
    let dateArray = []
    while (counterNumber < checkoutNumber * 1) {
        let aDate = new Date(counterNumber)
        let dateString = `${new Date(aDate).getDate()}-${new Date(aDate).getMonth() + 1}-${new Date(aDate).getFullYear()}`;
        dateArray.push(dateString);
        counterNumber += twentyFourHours;
    }
    // dateArray.push(`${new Date(checkoutNumber).getDate()}-${new Date(checkoutNumber).getMonth() + 1}-${new Date(checkoutNumber).getFullYear()}`)
    return dateArray;

    
}
export default datesGenerator;