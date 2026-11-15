import emailQueue from "../queues/emailQueue.js";
import emailDLQ from "../queues/emailDLQ.js";
import { AppError } from "../types/appError.js";

const jobRecovery = async (dlqId: string) => {
    const dlqJob = await emailDLQ.getJob(dlqId);

    if (!dlqJob) {
        throw new AppError("DLQ job not found", 404);
    }

    const originalJob = await emailQueue.getJob(dlqJob.data.originalJobId);

    if (originalJob) {
        const originalJobState = await originalJob.getState();

        if (originalJobState != "failed") {
            throw new AppError(`Recovery Not Allowed, Job State is ${originalJobState}`, 409);
        }
    }

    const { subject, email, html } = dlqJob.data;

    const recoveredJob = await emailQueue.add(dlqJob.name, {

        subject: subject,
        email: email,
        html: html

    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        }
    });

    await emailDLQ.remove(dlqId);

    return {
        message: "Job Recovered and Added to Queue Successfully",
        recoveredJobId: recoveredJob.id 
    }

}

export default jobRecovery;