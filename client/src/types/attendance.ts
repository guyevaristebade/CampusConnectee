export interface IArrival {
  arrival_time: string
  student_id: string
}

export interface IDeparture {
  departure_time: string
  student_id: string
}

export interface IDateType {
  start_date: Date
  end_date: Date
}

export interface IStatistics {
  total_student: number
  daily_student: number
  presence_rate: number
}

export interface IStudent {
  _id: string
  last_name: string
  first_name: string
}

export interface IRangeDateType {
  startDate: string | null
  endDate: string | null
}
