
export interface TravelExpense {
    id_travel?: number;
    code_project : number;
    start_date: Date; 
    start_time : string;
    start_place: string;
    end_date: Date;
    end_time : string;
    return_place: string;
    status?: string;
    purpose: string;
    start_municipality: string;
    end_municipality: string;
    night_municipality: string;
    destination_municipality: string;
    night_count?: number;
    meal_count?: number;
    comment?: string;
    license_vehicule?: string;
    comment_vehicule?: string;
    start_km?: number;
    end_km?: number;
}
  

