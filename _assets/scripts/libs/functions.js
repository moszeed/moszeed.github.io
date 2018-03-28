function unixToDate(unix_timestamp) {

    var date = new Date(unix_timestamp*1000);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return day + '.' + month + '.' + year;
}