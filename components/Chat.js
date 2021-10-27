import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatBg: 'white',
    };
  }
  componentDidMount() {
    // call props (name and chatBg) passed from Start.js
    let name = this.props.route.params.name;
    let chatBg = this.props.route.params.chatBg;

    //set title to name from props
    this.props.navigation.setOptions({ title: name });

    //set chatBg state from props
    this.setState({
      chatBg,
    });
  }
  render() {
    const { chatBg } = this.state;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: chatBg,
        }}
      >
        <Text>Welcome to chats</Text>
        <Button
          title='Back'
          onPress={() => {
            this.props.navigation.navigate('Start');
          }}
        />
      </View>
    );
  }
}
