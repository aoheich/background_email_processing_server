import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

const emailDLQ = new Queue("emailDLQ", {
    connection:  redisConnection
});

export default emailDLQ;