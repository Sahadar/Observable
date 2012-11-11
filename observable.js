/*
	Observable
	Implementation of observer coding pattern

	@version 1.0
	@author Wojciech Dłubacz (Sahadar)
	
	Copyright(c) 2012 Wojciech Dłubacz

	Licensed under MIT license
 */
Observable = (function() {
	var _eventObject = {};

	return function() {
		/**
		 * Listen on events distinguished by namespace
		 * @param  {string} namespace Event namespace (which we want to trigger)
		 * @param  {object} callback Callback which will be triggered on event
		 * @param  {callback_object} Object which will be "this" inside callback
		 */
		this.addEventListener = function(namespace, callback, callback_object) {
			var namespace = (typeof namespace === 'string') ? namespace : (console.error('Namespace must be string type'), 'randomString'),
				parts = namespace.split(':'),
				eventObject = null,
				callback_object = callback_object || callback,
				i = 0; // iterator
			
			//Iterating through _eventObject to find proper nsObject
			nsObject = _eventObject;
			for (i = 0; i < parts.length; i += 1) {
				if (typeof nsObject[parts[i]] === "undefined") {
					nsObject[parts[i]] = {};
					nsObject[parts[i]]['_events'] = [];
				}
				nsObject = nsObject[parts[i]];
			}
			
			eventObject = {
				callback	: callback,
				object      : callback_object
			};
			
			nsObject['_events'].push(eventObject);
		}
		/**
		 * Trigger event on given namespace, namespace can be separated by ":"
		 * @param  {string} namespace Event namespace (which we want to trigger)
		 * @param  {object} data      Data for event callbacks
		 */
		this.trigger = function(namespace, data) {
			var namespace = (typeof namespace === 'string') ? namespace : (console.error('Namespace must be string type'), 'randomString'),
				parts = namespace.split(':'), //array of splitted parts
				nsObject, //Namespace object to which we attach event
				data = data || {},
				i;
			
			//executes callback on given namespace
			//this method also bubble event forward
			function executeCallback(subscribtion) {
				var i = 0, //iterator
					subscribtionEvents = subscribtion['_events'];

				//execute event
				for(i = 0; i < subscribtionEvents.length; i++) {
					if(typeof subscribtionEvents[i] === 'object') {
						subscribtionEvents[i].callback.apply(subscribtionEvents[i].object, [data]);
					}
				}
				//bubble event up
				for(innernamespace in subscribtion) {
					if(typeof subscribtion[innernamespace] === 'object'
						&& innernamespace !== '_events') {
							executeCallback(subscribtion[innernamespace]);
					}
				}
			}
			
			//Iterating through _eventObject to find proper nsObject
			nsObject = _eventObject;
			for (i = 0; i < parts.length; i += 1) {
				if (typeof nsObject[parts[i]] === "undefined") {
					console.warn('There is no ' + namespace + ' subscription');
					return null;
				}
				nsObject = nsObject[parts[i]];
			}
			executeCallback(nsObject);
		}
		/**
		 * Remove triggered callback from event namespace
		 * @param  {string} namespace Event namespace
		 * @param  {object} callback  Callback which we want to remove from event namespace
		 */
		this.removeEventListener = function(namespace, callback) {
			var namespace = (typeof namespace === 'string') ? namespace : (console.error('Namespace must be string type'), 'randomString'),
				parts = namespace.split(':'), //array of splitted parts
				nsObject, //Namespace object from which we detach event
				i;
			
			//Iterating through _eventObject to find proper nsObject
			nsObject = _eventObject;
			for (i = 0; i < parts.length; i += 1) {
				if (typeof nsObject[parts[i]] === "undefined") {
					console.error('There is no ' + namespace + ' subscription');
					return null;
				}
				nsObject = nsObject[parts[i]];
			}
			
			//remove event from namespace
			//one per remove
			(function() {
				var i = 0,
					eventObject = null;
				for(i = 0; i < nsObject['_events'].length; i++) {
					eventObject = nsObject['_events'][i];
					if(typeof nsObject === 'object') {
						if(eventObject.callback === callback) {
							nsObject['_events'].splice(i, 1);
							break;
						}
					}
				}
			})();
		}
	}
})();