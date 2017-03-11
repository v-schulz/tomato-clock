class Timer {
		
	constructor() {
		this.storage = new Storage();
		this.interval = null;
		this.beginTime = 0;
		this.endTime = 0;
		this.totalTime = 0;
		this.timeLeft = 0;
		this.type = "";
		
		this.startedEventHandlers = [];
		this.updatedEventHandlers = [];
		this.finishedEventHandlers = [];
		this.canceledEventHandlers = [];
	}

	initializeInterval() {
		this.interval = setInterval(() => {
			this.timeLeft = this.endTime - Date.now();
			if (this.timeLeft <= 0) {
				this.reset();
				this.notifyFinishedEventHandlers();
			} else {
				this.notifyUpdatedEventHandlers();
			}
		}, 100);
	}
	
	isRunning() {
		return this.interval !== null;
	}
	
	getTimerScheduledTime() {
		return this.endTime;
	}
	
	set(type) {
		return new Promise((resolve, reject) => {
			this.storage.getTime(type).then((time) => {
				const milliseconds = getMinutesInMilliseconds(time);
				this.reset();
				this.beginTime = Date.now();
				this.endTime = this.beginTime + milliseconds;
				this.totalTime = milliseconds;
				this.timeLeft = this.totalTime;
				this.type = type;
				
				this.notifyStartedEventHandlers();
				
				this.initializeInterval();
				resolve();
			});
		});	
	}
	
	reset() {
		clearInterval(this.interval);
		this.interval = null;
		this.beginTime = null;
		this.endTime = 0;
		this.totalTime = 0;
		this.timeLeft = 0;
		this.type = "";

		this.notifyCanceledEventHandlers();
	}
	
	registerStartedEventHandler(eventHandler) {
		this.startedEventHandlers.push(eventHandler);
	}
		
	notifyStartedEventHandlers() {
		this.notifyEventHandlers(this.startedEventHandlers, "onTimerStarted");
	}
	
	registerUpdatedEventHandler(eventHandler) {
		this.updatedEventHandlers.push(eventHandler);
	}
		
	notifyUpdatedEventHandlers() {
		this.notifyEventHandlers(this.updatedEventHandlers, "onTimerUpdated");
	}
	
	registerFinishedEventHandler(eventHandler) {
		this.finishedEventHandlers.push(eventHandler);
	}
	
	notifyFinishedEventHandlers() {
		this.notifyEventHandlers(this.finishedEventHandlers, "onTimerFinished");
	}
	
	registerCanceledEventHandler(eventHandler) {
		this.canceledEventHandlers.push(eventHandler);
	}
	
	notifyCanceledEventHandlers() {
		this.notifyEventHandlers(this.canceledEventHandlers, "onTimerCanceled");
	}
	
	notifyEventHandlers(handlers, methodname) {
		try {
			const _this = this;
			handlers.forEach(function(eventHandler) {
				eventHandler[methodname].call(eventHandler, _this);
			});
		} catch (err) {
			console.log(handlers, methodname, err); 
		}
	}
	
	toJSON() {
		const obj = {
			beginTime: this.beginTime,
			endTime: this.endTime,
			totalTime: this.totalTime,
			timeLeft: this.timeLeft,
			type: this.type
		};
		return JSON.stringify(obj);
	}
	
	fromJSON(json) {
		const obj = JSON.parse(json);
		this.beginTime = obj.beginTime;
		this.endTime = obj.endTime;
		this.totalTime = obj.totalTime;
		this.timeLeft = obj.timeLeft;
		this.type = obj.type;
		
		if(this.endTime>Date.now()) {
			this.initializeInterval();
		}
	}
	
}