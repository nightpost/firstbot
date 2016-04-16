var builder = require('botbuilder');

var helloBot = new builder.TextBot();

helloBot.add('/', new builder.CommandDialog()
	.matches('^set name', builder.DialogAction.beginDialog('/profile'))
	.matches('^quit', builder.DialogAction.endDialog())
	.onDefault(function (session) {
		if(!session.userData.name) {
			session.beginDialog('/profile');
		} else {
			session.send('Hello %s', session.userData.name);
		}
}));

helloBot.add('/profile', [
	function(session) {
		if(session.userData.name) {
			builder.Prompts.text(session, 'What d\'you like to change?');
		} else {
			builder.Prompts.text(session, 'What is your name?');
		}
	},
	function(session, result) {
		session.userData.name = result.response;
		session.endDialog();
}]);

helloBot.listenStdin();
