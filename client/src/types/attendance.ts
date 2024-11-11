export interface IArrival{
    arrival_time: string;
    student_id: string;
}

export interface IDeparture{
    departure_time: string;
    student_id: string;
}

export interface IDateType {
    start_date : string;
    end_date : string;
}

export interface IStatistics {
    total_student: number;
    daily_student: number;
    presence_rate: number;
}

export interface IStudent{
    _id : string;
    last_name : string;
    first_name : string;
}