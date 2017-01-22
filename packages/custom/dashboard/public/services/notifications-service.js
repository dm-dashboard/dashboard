(function () {
	'use strict'

	angular.module('mean.dashboard')
		.config(['ngToastProvider', function (ngToastProvider) {
			ngToastProvider.configure({
				animation: 'slide' // or 'fade'
			});
		}]);

	angular.module('mean.dashboard')
		.factory('notifications', notificationService);

	notificationService.$inject = ['ngToast'];

	function notificationService(ngToast) {
		var service = {};

        service.success = showSuccessNotification;
		service.warn = showWarningNotification;
		service.error = showErrorNotification;


		function showNotification(style, title, message) {
			var content = '<span class="toast-title">' + title + '</span>';
			if (message) {
				content += '<br/>' + message;
			}

			ngToast.create({
				className: style,
				content: content				
			});
		}

		function showSuccessNotification(title, message) {
			showNotification('success', title, message);
		}
		function showWarningNotification(title, message) {
			showNotification('warning', title, message);
		}
		function showErrorNotification(title, message) {
			showNotification('error', title, message);
		}

		return service;
	}

})()