import { QueueEvents } from "bullmq";
import { redisConnection } from "../config/redis.js";
import emailQueue from "../queues/emailQueue.js";
import emailDLQ from "../queues/emailDLQ.js";

const queueEvents = new QueueEvents("emailQ", {
    connection: redisConnection
})

queueEvents.on("failed", async ({ jobId, failedReason }) => {

    const job = await emailQueue.getJob(jobId);

    if (!job) return;

    console.log("Attempts made:", job.attemptsMade)
    console.log("Maximum attempts:", job.opts.attempts);
    console.log("Failed job ID:", jobId);
    console.log("Failure reason:", failedReason);

    const maxAttempts = job.opts.attempts ?? 1;

    if (job.attemptsMade >= maxAttempts) {
        console.log("Job exhausted all retry attempts");
        console.log("Adding to DLQ");

        await emailDLQ.add(job.name, {
            ...job.data,
            originalJobId: job.id,
            failureReason: failedReason,
            attemptsMade: job.attemptsMade
        }, {
            jobId: `dlq-${job.id}`,
        });

    }

});