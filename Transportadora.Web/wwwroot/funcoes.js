function getTimeNow(data) {
    //var date = data.substring(6, 10) + '-' + data.substring(3, 5).padStart(2, '0') + '-' + data.substring(0, 2).padStart(2, '0');
    var time = data.substring(11, 13).padStart(2, '0') + ':' + data.substring(14, 16).padStart(2, '0') + ":00";
    return time;
}


function getDateNow(data) {
    var date = data.substring(6, 10) + '-' + data.substring(3, 5).padStart(2, '0') + '-' + data.substring(0, 2).padStart(2, '0');
    var time = data.substring(11, 13).padStart(2, '0') + ':' + data.substring(14, 16).padStart(2, '0') + ":00";

    return date;
}
