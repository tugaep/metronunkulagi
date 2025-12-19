export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            submissions: {
                Row: {
                    id: string
                    created_at: string
                    metro_line: string
                    from_station: string
                    to_station: string
                    direction: string
                    message: string
                    timestamp: string
                    people_attributes: string[] | null
                    location_type: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    metro_line: string
                    from_station: string
                    to_station: string
                    direction: string
                    message: string
                    timestamp: string
                    people_attributes?: string[] | null
                    location_type?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    metro_line?: string
                    from_station?: string
                    to_station?: string
                    direction?: string
                    message?: string
                    timestamp?: string
                    people_attributes?: string[] | null
                    location_type?: string | null
                }
            }
        }
    }
}
