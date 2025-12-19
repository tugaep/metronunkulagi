export interface Station {
  Id: number;
  Name: string;
  LineId: number;
  LineName: string;
  Description: string;
  Order: number;
  IsActive: boolean | null;
  FunctionalCode: string;
  DetailInfo: {
    Escolator: number;
    Lift: number;
    BabyRoom: boolean;
    WC: boolean;
    Masjid: boolean;
    Latitude: string;
    Longitude: string;
  };
}

export interface MetroData {
  Success: boolean;
  Error: string | null;
  Data: Station[];
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

export interface Conversation {
  id: string;
  created_at: string;
  content: string;
  line_id: string;
  location_type: 'station' | 'between_stations';
  station_primary: string;
  station_secondary: string | null;
  direction: string;
  people_attributes: string[];
  happened_at: string;
}

export type LocationType = 'station' | 'between_stations';

export const METRO_LINE_COLORS: Record<string, string> = {
  // Metro lines - from metro-colorcodes.csv
  'M1A': '358 86% 53%',    // Red #EE2229
  'M1B': '358 86% 53%',    // Red #EE2229
  'M2': '149 95% 31%',     // Green #059A4D
  'M2-S': '149 95% 31%',   // Green (Shuttle) #059A4D
  'M3': '195 91% 46%',     // Blue #0CA6DF
  'M4': '333 83% 51%',     // Pink/Magenta #E81E77
  'M5': '302 37% 30%',     // Purple #683166
  'M6': '37 40% 63%',      // Beige #C9AA79
  'M7': '340 81% 76%',     // Salmon #F490B3
  'M8': '216 47% 51%',     // Navy Blue #487ABF
  'M9': '49 97% 52%',      // Yellow #FCD10D
  'M10': '110 48% 45%',    // Bright Green #4CAA3C
  'M11': '185 80% 45%',    // Teal (placeholder)
  'M12': '280 65% 55%',    // Violet (placeholder)
  // Tram lines
  'T1': '206 100% 26%',    // Dark Blue #004B86
  'T2': '210 70% 55%',     // Tram Blue (placeholder)
  'T3': '22 53% 39%',      // Brown #99562F
  'T4': '19 100% 63%',     // Orange #FF7E42
  'T5': '249 28% 57%',     // Lilac #7B72B2
  // Funiculars
  'F1': '51 16% 41%',      // Greyish Brown #7A745A
  'F3': '51 16% 41%',      // Greyish Brown #7A745A
  'F4': '51 16% 41%',      // Greyish Brown #7A745A
  // Teleferiks (Cable cars)
  'TF1': '145 100% 24%',   // Dark Green #007A33
  'TF2': '145 100% 24%',   // Dark Green #007A33
  // Marmaray
  'MARMARAY': '15 85% 55%', // Marmaray Orange (placeholder)
};

export const PEOPLE_TAGS = [
  'Teyze', 'Amca', 'Genç', 'Çocuk', 'Öğrenci',
  'İş İnsanı', 'Turist', 'Çift', 'Arkadaşlar', 'Aile'
];
