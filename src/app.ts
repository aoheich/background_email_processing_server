import express, { type NextFunction, type Request, type Response } from "express";
import addWelcomeEmailJob from "./services/emailProducerService.js";
import emailQueue from "./queues/emailQueue.js";
import jobRecovery from "./services/emailRecoveryService.js";

const app = express();

app.use(express.json());

app.post("/test", async (req: Request<{}, {}, { name: string, email: string }>, res, next) => {
    const { name, email } = req.body
    let html = `<h1>Hello ${name}</h1>
                <p>test email</p>`;
    let subject = "TESTS"

    const job = await addWelcomeEmailJob(email, subject, html)
    res.status(202).json({
        message: "Job added",
        jobId: job.id!
    })
})

app.get("/failed", async (req: Request, res: Response, next: NextFunction) => {

    const failedJobs = await emailQueue.getFailed();

    const jobs = (failedJobs.map(job => ({
        id: job.id,
        name: job.name,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason
    })));

    res.status(200).json(jobs);

})

app.post("/recover", async (req: Request<{}, {}, {id: string}>, res: Response, next: NextFunction) => {

   const result = await jobRecovery(req.body.id)

   res.status(202).json(result)

})


export default app;