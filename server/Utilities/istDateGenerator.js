function datesGenerator(checkinNumber, checkoutNumber) {

    let days = 0;
    
    let twentyFourHours = 1000 * 60 * 60 * 24;
    let counterNumber = checkinNumber; //incrementing 24 hours in the checkin till checkout
    let dateArray = [];

    while (counterNumber < checkoutNumber * 1) {

        let aDate = new Date(counterNumber) // the incrementing date in milliseconds that is supposed to be sent to the database 

        let xyear = new Date(aDate).getFullYear()
        let xmonth = new Date(aDate).getMonth() + 1;
        let xdate = new Date(aDate).getDate();

        // add 0 to make 2 digits month and date
        xmonth < 10 ? xmonth = "0" + xmonth : xmonth = "" + xmonth;
        xdate < 10 ? xdate = "0" + xdate : xdate = "" + xdate;

        dateArray.push(`${xyear}-${xmonth}-${xdate}`);
        counterNumber += twentyFourHours;
        days+=1;
    }
    // dateArray.push(`${new Date(checkoutNumber).getDate()}-${new Date(checkoutNumber).getMonth() + 1}-${new Date(checkoutNumber).getFullYear()}`)
    return {"datesArr":  dateArray, "dayz": days};

    
}
export default datesGenerator;

// console.log(datesGenerator (1675011586891, 1675555200000));