import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

//Database
const firebase = require('firebase');
require('firebase/firestore');

//Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyAyBQj-fuaGjNGTpJD5wt6WuiR9yb8G4JM',
  authDomain: 'chatapp-f7f6c.firebaseapp.com',
  projectId: 'chatapp-f7f6c',
  storageBucket: 'chatapp-f7f6c.appspot.com',
  messagingSenderId: '961812459510',
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      chatBg: 'white',
      uid: '',
      user: {
        _id: 1,
        name: '',
        avatar: '',
      },
    };

    //Connecting to Firebase DB
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() {
    // call props (name, chatBg) passed from Start.js
    let name = this.props.route.params.name;
    let chatBg = this.props.route.params.chatBg;
    //set title to name from props
    this.props.navigation.setOptions({ title: name });

    //Reference to load existing messages from firebase
    this.referenceChatMessages = firebase.firestore().collection('messages');

    //Anonymous authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        chatBg,
        uid: user.uid,
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
        messages: [],
      });

      // Create reference to messages of active users
      this.referenceMessagesUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
      // Listen for collection changes
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // const messages = [...this.state.messages];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();

      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || '',
        system: data.system,
        user: data.user,
      });
    });

    this.setState({ messages });
  };

  addMessage() {
    const message = this.state.messages[0];
    // add new messages to collection
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // add message to localStorage
        this.addMessage();
      }
    );
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#57606f',
          },
        }}
      />
    );
  };

  render() {
    const { chatBg, messages, user } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: chatBg }}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: user._id,
          }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}
