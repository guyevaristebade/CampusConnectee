export interface IArrival{
    arrival_time: string;
    student_id: string;
}

export interface IDeparture{
    departure_time: string;
    student_id: string;
}

export interface IDate{
    today_date : string
}

export interface FeeDocument {
    _id: string;
    student_id: string;
    today_date: string;
    arrival_time: string;
    total_hours: number;
    status: string;
    is_registered: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    departure_time: string;
}

