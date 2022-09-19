import { Clock, Employee, testData, TimeData } from "./input";

import { differenceInDays, isSameDay } from "date-fns";

import fs from "fs";

interface HourMinSec {
  hour: number;
  minute: number;
  second: number;
}

function getHourMinSec(timeStamp: string): HourMinSec {
  const date = new Date(timeStamp);
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

const timeBlocks = [
  {
    name: "period1",
    start: 5,
    end: 12,
  },
  {
    name: "period2",
    start: 12,
    end: 18,
  },
  {
    name: "period3",
    start: 18,
    end: 23,
  },
  {
    name: "period4",
    start: 23,
    end: 5,
  },
];

function findTimeBlockIndex({ hour, minute, second }: HourMinSec) {
  const time = hour + (minute * 60 + second) / 3600;

  if (time >= 5 && time <= 12) {
    return 0;
  } else if (time >= 12 && time <= 18) {
    return 1;
  } else if (time >= 18 && time <= 23) {
    return 2;
  } else if (time >= 23 || time <= 5) {
    return 3;
  } else return -1;
}

function getYearMonthDate(input: string) {
  const date = new Date(input);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function findMatchingPeriodsHours({
  clock_in_datetime,
  clock_out_datetime,
}: Clock) {
  // 1. Morning (5:00 AM - 12:00 PM)
  // 2. Afternoon (12:00 PM - 18:00 PM)
  // 3. Evening (18:00 PM - 23:00 PM)
  // 4. Late Night (23:00 PM - 5:00 AM)

  const clockIn = getHourMinSec(clock_in_datetime);
  const clockOut = getHourMinSec(clock_out_datetime);

  const startBlockIndex = findTimeBlockIndex(clockIn);

  const endBlockIndex = findTimeBlockIndex(clockOut);

  if (startBlockIndex === -1 || endBlockIndex === -1) {
    throw new Error("time stamp is invalid");
  }

  const startBlock = (() => {
    const hour =
      timeBlocks[startBlockIndex].end < clockIn.hour
        ? timeBlocks[startBlockIndex].end + 24
        : timeBlocks[startBlockIndex].end;

    return [
      {
        name: timeBlocks[startBlockIndex].name,
        hours: (() => {
          const minAndSecToHours =
            (clockIn.minute * 60 + clockIn.second) / 3600;

          return hour - clockIn.hour - minAndSecToHours;
        })(),
      },
    ];
  })();

  const daysCount = differenceInDays(
    new Date(clock_out_datetime),
    new Date(clock_in_datetime)
  );

  const endBlock = (() => {
    if (
      timeBlocks[endBlockIndex].name === timeBlocks[startBlockIndex].name &&
      daysCount <= 1
    )
      return [];
    const hour =
      clockOut.hour < timeBlocks[endBlockIndex].start
        ? clockOut.hour + 24
        : clockOut.hour;

    return [
      {
        name: timeBlocks[endBlockIndex].name,
        hours: (() => {
          const minAndSecToHours =
            (clockOut.minute * 60 + clockOut.second) / 3600;

          return hour - timeBlocks[endBlockIndex].start + minAndSecToHours;
        })(),
      },
    ];
  })();

  const inBetweenBlocks = (() => {
    if (!isSameDay(new Date(clock_out_datetime), new Date(clock_in_datetime))) {
      const left = timeBlocks.slice(0, startBlockIndex);
      const right = timeBlocks.slice(startBlockIndex);

      return [...right, ...left].slice(
        startBlock.findIndex(
          ({ name }) => name === timeBlocks[startBlockIndex].name
        ) + 1,
        endBlockIndex === startBlockIndex
          ? undefined
          : endBlock.findIndex(
              ({ name }) => name === timeBlocks[endBlockIndex].name
            )
      );
    }
    return timeBlocks.slice(startBlockIndex + 1, endBlockIndex);
  })();

  const timeSpentInBetweenBlocks = inBetweenBlocks.map((block) => ({
    name: block.name,
    hours: (block.end < block.start ? block.end + 24 : block.end) - block.start,
  }));

  const computedTimeBlocks = [
    ...startBlock,
    ...timeSpentInBetweenBlocks,
    ...endBlock,
  ];

  if (daysCount >= 1) {
    for (let index = 0; index < daysCount; index++) {
      const fullDayOfShift = timeBlocks.map((block) => ({
        name: block.name,
        hours:
          (block.end < block.start ? block.end + 24 : block.end) - block.start,
      }));

      computedTimeBlocks.push(...fullDayOfShift);
    }
  }

  return {
    total: computedTimeBlocks.reduce((prev, curr) => curr.hours + prev, 0),
    labourByTimePeriod: {
      period1: computedTimeBlocks
        .filter(({ name }) => name === "period1")
        .reduce((prev, curr) => curr.hours + prev, 0),
      period2: computedTimeBlocks
        .filter(({ name }) => name === "period2")
        .reduce((prev, curr) => curr.hours + prev, 0),
      period3: computedTimeBlocks
        .filter(({ name }) => name === "period3")
        .reduce((prev, curr) => curr.hours + prev, 0),
      period4: computedTimeBlocks
        .filter(({ name }) => name === "period4")
        .reduce((prev, curr) => curr.hours + prev, 0),
    },
  };
}

export interface ComputedTimeData {
  employee_id: number;
  first_name: string | null;
  last_name: string | null;
  labour: {
    date: string;
    total: number;
    labour_by_time_period: {
      period1: number;
      period2: number;
      period3: number;
      period4: number;
    };
  }[];
}

function buildHash(employees: TimeData["employees"]) {
  const hash: Record<string, Employee> = {};

  employees.forEach((employee) => {
    hash[employee.id] = employee;
  });

  return hash;
}

export function employeeTimePeriod({
  clocks,
  employees,
}: TimeData): ComputedTimeData[] {
  const employeeHashTable = buildHash(employees);

  const computedTimeDataHashTable: Record<string, ComputedTimeData> = {};

  clocks.forEach((clock) => {
    const employee = employeeHashTable[clock.employee_id];
    const timeBlocksWithHours = findMatchingPeriodsHours(clock);

    computedTimeDataHashTable[employee.id] = {
      employee_id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      labour: [
        ...(computedTimeDataHashTable[employee.id]?.labour ?? []),
        {
          date: getYearMonthDate(clock.clock_in_datetime),
          total: timeBlocksWithHours.total,
          labour_by_time_period: timeBlocksWithHours.labourByTimePeriod,
        },
      ],
    };
  });

  return Object.values(computedTimeDataHashTable);
}

const result = JSON.stringify(employeeTimePeriod(testData), null, 2);
fs.writeFileSync("./output.json", result);
