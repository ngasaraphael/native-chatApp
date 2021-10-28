import React from 'react';
import image from '../assets/bg.png';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      chatBg: '',
    };
  }

  render() {
    const { name, chatBg } = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode='cover' style={styles.image}>
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>ChatApp</Text>
            </View>
            <View style={styles.loginContainer}>
              <TextInput
                style={styles.inputText}
                placeholder='Enter your Name'
                onChangeText={(name) => this.setState({ name })}
                value={name}
              />
              <View style={styles.bgColors}>
                <Text style={styles.bgColorTitle}>Choose Background Color</Text>
                <View style={styles.bgColorsContainer}>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel='Margenta Color'
                    accessibilityHint='Background color for chats'
                    style={[styles.bgColor1, styles.allBgColors]}
                    onPress={() => this.setState({ chatBg: '#5d0580' })}
                  ></TouchableOpacity>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel='Darkblue Color'
                    accessibilityHint='Background color for chats'
                    style={[styles.bgColor2, styles.allBgColors]}
                    onPress={() => this.setState({ chatBg: '#05177d' })}
                  ></TouchableOpacity>

                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel='Darkred Color'
                    accessibilityHint='Background color for chats'
                    style={[styles.bgColor3, styles.allBgColors]}
                    onPress={() => this.setState({ chatBg: '#6F1E51' })}
                  ></TouchableOpacity>
                  <TouchableOpacity
                    accessible={true}
                    accessibilityLabel='Darkgreen Color'
                    accessibilityHint='Background color for chats'
                    style={[styles.bgColor4, styles.allBgColors]}
                    onPress={() => this.setState({ chatBg: '#006266' })}
                  ></TouchableOpacity>
                </View>
              </View>

              {/* pass props to and navigate to Chat */}
              <Pressable
                style={styles.startChatBnt}
                onPress={() =>
                  this.props.navigation.navigate('Chat', {
                    name,
                    chatBg,
                  })
                }
              >
                <Text style={{ color: 'white' }}>Start Chat</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginContainer: {
    height: '44%',
    minHeight: 300,
    maxHeight: 300,
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    width: 320,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  inputText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    width: '88%',
    height: 50,
    borderColor: '#d3dff2',
    borderWidth: 0.7,
    borderRadius: 3,
    padding: 6,
    marginBottom: 20,
  },

  bgColorsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },

  bgColorTitle: {
    marginBottom: 16,
    color: '#757083',
    opacity: 0.9,
  },

  bgColors: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  allBgColors: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 14,
    marginRight: 14,
  },
  bgColor1: {
    backgroundColor: '#5d0580',
  },
  bgColor2: {
    backgroundColor: '#05177d',
  },
  bgColor3: {
    backgroundColor: '#6F1E51',
  },
  bgColor4: {
    backgroundColor: '#006266',
  },

  startChatBnt: {
    height: 50,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#757083',
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
});
