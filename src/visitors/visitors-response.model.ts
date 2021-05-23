//Interface defining the structure of the api response
export interface VisitorsResponse {
  attendance: Attendance;
}

interface Attendance {
  month: string;
  year: number;
  highest: Museum;
  lowest: Museum;
  ignored?: Museum;
  total: number;
}

interface Museum {
  museum: string;
  visitors: number;
}
