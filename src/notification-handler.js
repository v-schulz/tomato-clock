class NotificationHandler {
	
	constructor() {
		this.notificationSound = new Audio('/assets/sounds/Portal2_sfx_button_positive.m4a');
		this.initNotificationHandling();
	}
	
	initNotificationHandling() {
		browser.notifications.onClicked.addListener(notificationId => {
			if (notificationId === NOTIFICATION_ID) {
				browser.notifications.clear(notificationId);
			}
		});
	}
	
	onTimerStarted(timer) {
		const message = START_MESSAGES[timer.type];
		this.createBrowserNotification(message);
	}
	
	onQueueFinished(timer) {
		this.createBrowserNotification(FINISHED_MESSAGES);
	}
	
	createBrowserNotification(message) {
		browser.notifications.create(NOTIFICATION_ID, {
			type: 'basic',
			iconUrl: '/assets/img/tomato-icon-64.png',
			title: 'Tomato Clock',
			message: message
		});

		this.notificationSound.play();
	}
	
} 