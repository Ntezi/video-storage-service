import * as schedule from 'node-schedule';
import Logger from "./Logger";

class Scheduler {
	private jobs: Map<string, schedule.Job>;

	constructor() {
		this.jobs = new Map();
	}

	public scheduleJob(name: string, rule: schedule.RecurrenceRule, job: () => void) {
		const scheduledJob = schedule.scheduleJob(name, rule, job);
		this.jobs.set(name, scheduledJob);
		Logger.info(`Job ${name} initialized successfully with rule: ${JSON.stringify(rule)}`);
	}

	public cancelJob(name: string) {
		const job = this.jobs.get(name);
		if (job) {
			job.cancel();
			this.jobs.delete(name);
		}
	}
}

export default new Scheduler();
