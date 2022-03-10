# Task schedulers in Node.js

## [node-cron](https://www.npmjs.com/package/node-cron)

It's a popular implementation for Node.js. It's base on GNU crontab. It uses the cron syntax i.e.(* * * * *)

## [Agenda](https://www.npmjs.com/package/agenda)

It's a bit different from cron-based solutions. It uses human-friendly time intervals and expressions.
It uses MongoDB to persist jobs. This helps to continue processing jobs after a stop or break in the main service.

## Resources

[crontab guru - A good site to test cron expressions and intervals](https://crontab.guru/)

[How To Use node-cron to Run Scheduled Jobs in Node.js?](https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples)

[A good task scheduler](https://softwareontheroad.com/nodejs-scalability-issues/#jobs)

[Comparing the best Node.js schedulers](https://blog.logrocket.com/comparing-best-node-js-schedulers/)
