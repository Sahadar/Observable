Description
===========

JavaScript observer coding pattern implementation

API
===

new Observable() returns Observable object

Methods
-------

**trigger**(namespace, data)
_Trigger event on given namespace, namespace can be separated by ":"_
* @param  {string} namespace Event namespace (which we want to trigger)
* param  {object} data      Data for event callbacks

**addEventListener**(namespace, callback, callback_object)
_Listen on events distinguished by namespace_
* @param  {string} namespace Event namespace (which we want to trigger)
* @param  {object} callback Callback which will be triggered on event
* @param  {callback_object} Object which will be "this" inside callback

**removeEventListener**((namespace, callback)
_Remove triggered callback from event namespace_
* @param  {string} namespace Event namespace
* @param  {object} callback  Callback which we want to remove from event namespace

Examples
========

```javascript
var observable = new Observable();
observable.addEventListener("change:title", function(data) {
	console.log("title has changed to ", data.title);
});
observable.trigger("change:title", { title: "foo" }); // "title has changed to foo"
observable.trigger("change", { title: "bar" }); // "title has changed to bar"
```

```javascript
var observable = new Observable();
var anotherHandler = function() {
	console.log("I'm another handler");
};
var handler = function(data) {
    console.log("removing my friend");
    observable.removeEventListener("change:title", anotherHandler);
};
observable.addEventListener("change:title", handler);
observable.addEventListener("change:title", anotherHandler);
observable.trigger("change:title", { title: "moo" }); // "removing my friend"
```