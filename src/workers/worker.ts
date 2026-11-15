import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import "../services/emailQueueEvents.js"
import sendEmail from "../utils/emailProvider.js";

const emailWorker =  new Worker("emailQ", async (job) => {
    console.log("Job name:", job.name);
    console.log("Job data:", job.data);

},
{
    connection: redisConnection
})