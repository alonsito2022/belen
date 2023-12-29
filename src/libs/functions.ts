

export function obtenerSemanaActual(): string {
    const hoy: Date = new Date();
    const anio: number = hoy.getFullYear();
    const numeroDeSemana: number = obtenerNumeroDeSemana(hoy);
    return `${anio}-W${numeroDeSemana < 10 ? '0' : ''}${numeroDeSemana}`;
}
  
export function obtenerNumeroDeSemana(fecha: Date): number {

    const inicioAnio: Date = new Date(fecha.getFullYear(), 0, 1);
    const milisegundosEnDia: number = 86400000; // 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
  
    const diasTranscurridos: number = Math.floor((fecha.getTime() - inicioAnio.getTime()) / milisegundosEnDia);
    const numeroDeSemana: number = Math.ceil((diasTranscurridos + inicioAnio.getDay() + 1) / 7);
  
    return numeroDeSemana;
}

export function formatFecha(fecha: Date) {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = obtenerNombreMes(fecha.getMonth());
    return `${dia}-${mes}`;
}

// Función para obtener el nombre del mes dado su número (0-indexado)
export function obtenerNombreMes(numeroMes: number) {
    const nombresMes = [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];

    return nombresMes[numeroMes];
}

// export const getFirstMondayOfMonth = (date: Date): Date => {
//     const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//     const dayOfWeek = firstDayOfMonth.getDay();
//     const daysUntilMonday = (8 - dayOfWeek) % 7;
//     firstDayOfMonth.setDate(1 + daysUntilMonday);
//     return firstDayOfMonth;
// };

// export const getLastDayOfMonth = (date: Date): Date => {
//     const lastDayOfWeek = getFirstMondayOfMonth(date);
//     lastDayOfWeek.setDate(lastDayOfWeek.getDate() - 1);
//     return lastDayOfWeek
// };

export function getDates(startDate: Date, endDate: Date) {
    const dateArray = [];
    // let currentDate = new Date(startDate);
    let currentDate = startDate;

    const daysOfWeek = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    while (currentDate <= new Date(endDate)) {
        const formattedDate = `${daysOfWeek[currentDate.getDay()]} ${formatFecha(currentDate)}`;

        dateArray.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

interface DateObject {
    formattedDate: string;
    formattedWeekday: string;
}

export function traducirFechaAlEspanol(dateArray: DateObject[]): { formattedDate: string; formattedWeekday: string }[] {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    return dateArray.map(dateObj => {
        const fechaArray = dateObj.formattedDate.split('-');
        console.log('fechaArray 0', fechaArray[0])
        console.log('fechaArray 1', fechaArray[1])
        const mes = meses[parseInt(fechaArray[1]) - 1];
        const diaSemana = diasSemana.indexOf(dateObj.formattedWeekday) !== -1 ? diasSemana[diasSemana.indexOf(dateObj.formattedWeekday)] : dateObj.formattedWeekday;

        return {
            formattedDate: `${fechaArray[0]}-${mes}`,
            formattedWeekday: diaSemana
        };
    });
}

export function getWeekDayInSpanish(value: string){
    return value.toLocaleUpperCase().replace("Ã©", "É").replace("Ã¡", "Á").replace("MONDAY", "LUNES").replace("TUESDAY", "MARTES").replace("WEDNESDAY", "MIERCOLES").replace("THURSDAY", "JUEVES").replace("FRIDAY", "VIERNES").replace("SATURDAY", "SABADO").replace("SUNDAY", "DOMINGO");
}

export function getShortNameMonth(value: string){
    return value.toLocaleUpperCase().replace("DEC", "DIC");
}


export function getDayNameByIndex(value: number){
    const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
    return diasSemana[value];
}