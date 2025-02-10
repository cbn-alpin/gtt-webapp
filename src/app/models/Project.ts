import { Action } from "./Action";

export interface Project {
    id_project: number;
    code: number;
    name: string;
    description: string;
    start_date: Date;
    end_date: Date;
    is_archived: boolean;
    list_action: Action[];
}