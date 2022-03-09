import { schedule } from 'node-cron'
import { TokenService } from '../services/token.service'

// based on crontab
// Node.js: node-cron, cron
// try https://crontab.guru/

/*
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
*/

schedule('*/2 * * * *', TokenService.prune)
