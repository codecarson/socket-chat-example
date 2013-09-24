var Chat = Em.Application.create();

////////////////////////////////////////////////////////////////////////////////
//
// MODELS
//

Chat.Message = Em.Object.extend({
  text                    : null
, created_date            : null
, created_by              : null
, room_id                 : null
});


Chat.User = Em.Object.extend({
  user_name               : null
, room_id                 : null
});


Chat.Room = Em.Object.extend({
  room_id                 : null
, room_name               : null
});

////////////////////////////////////////////////////////////////////////////////
//
// CONTROLLERS
//
Chat.messagesDataController = Em.ArrayProxy.create({
  content                 : []
, add                     : function(message) {
    var modelMessage = Chat.Message.create(message);
    this.addObject(modelMessage);
  }
});

Chat.usersDataController = Em.ArrayProxy.create({
  content                 : []
, add                     : function(user) {
    var exists = this.filterProperty('user_name', user.user_name).length
      , modelUser = Chat.User.create(user);
    if(exists === 0) {
      this.addObject(modelUser);
    }
    return modelUser;
  }
, addMany                 : function(users) {
    for(var x=0; x<users.length; x++) {
      this.add(users[x]);
    }
  }
, remove                  : function(user) {
    var targetUser = this.findProperty('user_name', user.user_name);
    this.removeObject(targetUser);
  }
});

Chat.roomsDataController = Em.ArrayProxy.create({
  content                 : []
, add                     : function(room) {
    var modelRoom = Chat.Room.create(room);
    this.addObject(modelRoom);
  }
});




Chat.currentUser = Em.Object.create({
  user                    : null
});




Chat.MessagesController = Em.ArrayProxy.extend({
  content                 : []
, new                     : function(text) {
    var message = {}
      , modelMessage
      , currentUser = Chat.currentUser.get('user');
    message.text = text;
    message.created_date = new Date();
    message.created_by = currentUser;
    message.room_id = currentUser.room_id;
    Chat.messagesDataController.add(message);
    /* Socket.io Events */
  }
, filterBy                : function(property, value) {
    this.set('content', Chat.messagesDataController.filterProperty(property, value));
  }
, messagesObserver        : function() {
    //Fires anytime controller content changes in order to sort messages by date
    //Sort Asc
    this.content.sort(function(a, b) {
      return Date.parse(a.get('created_date')) - Date.parse(b.get('created_date'));
    });
  }.observes('[]')
, messagesDataObserver    : function() {
    //Fires anytime the messagesDataController changes
    var user = Chat.currentUser.get('user');
    this.filterBy('room_id', user.room_id);
  }.observes('Chat.messagesDataController.[]')
, roomObserver            : function() {
    var user = Chat.currentUser.get('user');
    if(user) this.filterBy('room_id', user.room_id);
  }.observes('Chat.currentUser.user.room_id')
});

Chat.MessageController = Em.Controller.extend();

Chat.UsersController = Em.ArrayProxy.extend({
  content                 : []
, filterBy                : function(property, value) {
    this.set('content', Chat.usersDataController.filterProperty(property, value));
  }
, currentUserObserver     : function() {
    var user = Chat.currentUser.get('user');
    if(user) this.filterBy('room_id', user.room_id);
  }.observes('Chat.currentUser.user')
, roomObserver            : function() {
    var user = Chat.currentUser.get('user');
    if(user) this.filterBy('room_id', user.room_id);
  }.observes('Chat.currentUser.user.room_id')
, usersDataObserver       : function() {
    var user = Chat.currentUser.get('user');
    if(user) this.filterBy('room_id', user.room_id);
  }.observes('Chat.usersDataController.[]')
, userCount               : function() {
    return this.get('length');
  }.property('@each')
});

Chat.UserController = Em.Controller.extend();

Chat.RoomsController = Em.ArrayProxy.extend({
  init                    : function() {
    var day_room = {
          room_id               : 'day_room'
        , room_name             : 'Day Room'
        }
      , night_room = {
          room_id               : 'night_room'
        , room_name             : 'Night Room'
        };
    Chat.roomsDataController.add(day_room);
    Chat.roomsDataController.add(night_room);
  }
, contentBinding          : 'Chat.roomsDataController'
});

Chat.RoomController = Em.Controller.extend();

Chat.ApplicationController = Em.Controller.extend();



////////////////////////////////////////////////////////////////////////////////
//
// VIEWS
//

Chat.ApplicationView = Em.View.extend({
  templateName            : 'appView'
, classNames              : ['container-fluid']
, userNameInput           : Em.TextField.extend({

  })
});


















