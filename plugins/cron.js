import fastifyCron from 'fastify-cron'
import Vendor from '../models/Vendor';

import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify.register(fastifyCron, {
        jobs: [
          {
            // Only these two properties are required,
            // the rest is from the node-cron API:
            // https://github.com/kelektiv/node-cron#api
            cronTime: '0 0 * * *', // Everyday at midnight UTC
      
            // Note: the callbacks (onTick & onComplete) take the server
            // as an argument, as opposed to nothing in the node-cron API:
            onTick: async server => {
            //   await server.db.runSomeCleanupTask()
                let sixMonthsAgo = new Date(Date.now());
                let year = sixMonthsAgo.getMonth() < 7 ? sixMonthsAgo.getFullYear() - 1 : sixMonthsAgo.getFullYear();
                let month = sixMonthsAgo.getMonth() < 7 ? 12 + (sixMonthsAgo.getMonth() - 6) : sixMonthsAgo.getMonth();
                sixMonthsAgo.setMonth(month);
                sixMonthsAgo.setYear(year);
                
                let expiredRecords = await Vendor.find({
                    "subscription" : {
                        "time" : { $lte: ISODate(sixMonthsAgo.toISOString()) },
                        "subscriptionType" : "type1"
                    }
                })

                for( let vendor of expiredRecords) {
                    vendor.isSubscribed = false;
                }

                let nineMonthsAgo = new Date(Date.now());
                let nyear = nineMonthsAgo.getMonth() < 10 ? nineMonthsAgo.getFullYear() - 1 : nineMonthsAgo.getFullYear();
                let nmonth = nineMonthsAgo.getMonth() < 10 ? 12 + (nineMonthsAgo.getMonth() - 9) : nineMonthsAgo.getMonth();
                nineMonthsAgo.setMonth(nmonth);
                nineMonthsAgo.setYear(nyear);
                
                expiredRecords = await Vendor.find({
                    "subscription" : {
                        "time" : { $lte: ISODate(nineMonthsAgo.toISOString()) },
                        "subscriptionType" : "type2"
                    }
                })

                for( let vendor of expiredRecords) {
                    vendor.isSubscribed = false;
                }
            }
          }
        ]
      })
})