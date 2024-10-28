export const  timeToDecimal = (timeStr : string) : string =>{
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours + (minutes / 60)).toFixed(2);
}
