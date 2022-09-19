import { employeeTimePeriod } from "./index";
import { testData } from "./input";

test("output should be correct", () => {
  const result = employeeTimePeriod(testData);

  // 5 hours, 49 minutes and 47 seconds
  expect(result.find((elem) => elem.employee_id === 0)?.labour[0].total).toBe(
    5.829722222222222
  );
  // 7 hours, 34 minutes and 5 seconds
  expect(result.find((elem) => elem.employee_id === 2)?.labour[0].total).toBe(
    7.5680555555555555
  );
  // 1 day, 23 hours, 59 minutes and 59 seconds
  expect(result.find((elem) => elem.employee_id === 3)?.labour[0].total).toBe(
    47
  );
});
