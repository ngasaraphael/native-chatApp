import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

//Firebase DB
const firebase = require('firebase');
require('firebase/firestore');

// The applications main chat component that renders the UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      uid: 0,
      chatBg: 'white',
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
    };

    //Firebase Config
    const firebaseConfig = {
      apiKey: 'AIzaSyAyBQj-fuaGjNGTpJD5wt6WuiR9yb8G4JM',
      authDomain: 'chatapp-f7f6c.firebaseapp.com',
      projectId: 'chatapp-f7f6c',
      storageBucket: 'chatapp-f7f6c.appspot.com',
      messagingSenderId: '961812459510',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
    this.referenceMessageUser = null;
  }

  componentDidMount() {
    //call props (name, chatBg) passed from Start.js
    let name = this.props.route.params.name;
    let chatBg = this.props.route.params.chatBg;
    this.props.navigation.setOptions({ title: name });

    //verify if user is connected to the internet
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');

        //auth event on firebase
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            chatBg: chatBg,
            messages: [],
            image: null,
            location: null,
            user: {
              _id: user.uid,
              name: name,
            },
          });
          //getMessage of active user from DB
          this.referenceMessagesUser = firebase
            .firestore()
            .collection('messages')
            .where('uid', '==', this.state.uid);
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        // getMessage from AsyncStorage if offline
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.authUnsubscribe();
  }

  //getMessage from AsyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Delete messages from AsyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // Add messages to DB
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // Save Messages to AsyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  // Send Message
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),

      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  // get message from db and update state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || '',
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  //render inputtoolbar only when online
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

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

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  render() {
    let { messages, user, chatBg } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: chatBg }}>
        <GiftedChat
          messages={messages}
          renderInputToolbar={this.renderInputToolbar}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          onSend={(messages) => this.onSend(messages)}
          user={user}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}
