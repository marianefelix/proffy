export default function convertHourToMinutes(time: string){
    //separa a string em hora e minutos 
    const [hour, minutes] = time.split(':').map(Number);
    //converte a hora para minutos
    const timeInMinutes = (hour * 60) + minutes;
    
    return timeInMinutes;
}