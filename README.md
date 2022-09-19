### Run the code

`npm i && npx ts-node index.ts`

### Solution walk through

We know employees and clocks share the common employee id, so we build a hashmap of employees so we don't need to do a .find() operation when we are associating them

The main loop will be the clocks array, and since the employee id is the unique key, we can use another hashmap to optimize the creation of the computed time data

Now comes the fun part, `findMatchingPeriodsHours()` contains the bulk of the biz logic, so first we remove the edge case the starting timeBlock and the ending timeBlock, since they could contain partial hours.

Then we just need to grab whatever is inbetween them can get the full period hours

the first edge case is period4, period4 has an endTime smaller than startTime, so I had to do a inline conditioinal to add 24hrs to the end time

the second edge case is multiday shifts, if it's more than 1 full day, I simply add full period to all 4 period. The issue is when the start time block is later than the end time block spanning multiple days, the simpliest solution was to just rearrange the timeBlock array and then remove start and end block, whatever is in between gets picked up.

I wrote some tests for my own sanity, in prod I would write more tests and cover all the util functions
