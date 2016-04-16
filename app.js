var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createSerer();

var helloBot = new builder.BotConnectorBot();

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

server.use(helloBot.verifyBotFramework({
	appId: 1,
	addSecret: 012345
}));
server.post('/v1/messages', helloBot.listen());

server.listen(8080, function() {
	console.log('%s listening to %s', server.name, server.url);
});