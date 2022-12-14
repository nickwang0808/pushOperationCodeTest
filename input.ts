export interface Employee {
  id: number;
  first_name: string | null;
  last_name: string | null;
}

export interface Clock {
  employee_id: number;
  clock_in_datetime: string;
  clock_out_datetime: string;
}

export interface TimeData {
  employees: Employee[];
  clocks: Clock[];
}

export const testData: TimeData = {
  employees: [
    {
      id: 0,
      first_name: "Cave",
      last_name: "Johnson",
    },
    {
      id: 1,
      first_name: "Chell",
      last_name: "Johnson",
    },
    {
      id: 2,
      first_name: "Doug",
      last_name: "Rattmann",
    },
    {
      id: 3,
      first_name: "GLaDOS",
      last_name: null,
    },
  ],
  clocks: [
    {
      employee_id: 0,
      clock_in_datetime: "1953-07-20 09:01:12",
      clock_out_datetime: "1953-07-20 14:50:59",
    },
    {
      employee_id: 1,
      clock_in_datetime: "2017-02-07 10:05:12",
      clock_out_datetime: "2017-02-07 14:50:59",
    },
    {
      employee_id: 2,
      clock_in_datetime: "2017-02-04 19:30:36",
      clock_out_datetime: "2017-02-05 03:04:41",
    },
    {
      employee_id: 3,
      clock_in_datetime: "2012-11-12 00:00:00",
      clock_out_datetime: "2012-11-13 23:59:59",
    },
    {
      employee_id: 1,
      clock_in_datetime: "2017-02-04 09:05:12",
      clock_out_datetime: "2017-02-04 11:50:59",
    },
    {
      employee_id: 1,
      clock_in_datetime: "2017-02-04 12:28:27",
      clock_out_datetime: "2017-02-04 20:16:24",
    },
  ],
};
