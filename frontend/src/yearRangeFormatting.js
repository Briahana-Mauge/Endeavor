const yearRange = () => {
    let month = new Date().getMonth() + 2 ;
    let year = new Date().getFullYear() - 1;
    const datesArr = [];
    
    for (let i = 0; i < 12; i++) {
        let date = '';
        if (month <= 12) {
            if (month < 10) {
                date = '0' + month + '-' + year;
            } else {
                date = month + '-' + year;
            }
            month += 1;
        } else {
            if (month < 22) {
                date = '0' + (month - 12) + '-' + (year + 1);
            } else {
                date = (month - 12) + '-' + (year + 1);
            }
            month += 1;
        }
        datesArr.push(date);
    }
    return datesArr;
}

export default yearRange;