import emailQueue from "../queues/emailQueue.js";

const addWelcomeEmailJob = (email: string, subject: string, html: string) => {
    return emailQueue.add("welcome-email", {
        subject,
        email,
        html
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnFail: false
    })
}

export default addWelcomeEmailJob;