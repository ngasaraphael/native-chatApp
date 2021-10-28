import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      chatBg: 'white',
    };
  }
  componentDidMount() {
    // call props (name, chatBg) passed from Start.js
    let userName = this.props.route.params.name;
    let chatBg = this.props.route.params.chatBg;

    //set title to name from props
    this.props.navigation.setOptions({ title: userName });

    this.setState({
      chatBg,
      messages: [
        {
          _id: 1,
          text: 'Hello ' + userName,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: userName + ' has joined the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
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
  }

  render() {
    const { chatBg } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: chatBg }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}
