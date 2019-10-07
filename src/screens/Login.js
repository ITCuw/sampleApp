import React, { Component } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
import { initLogin, sendbirdLogin } from '../actions';
import { sbRegisterPushToken } from '../sendbirdActions';
import { NavigationActions, StackActions } from 'react-navigation';
import { Button, Spinner } from '../components';
import firebase from 'react-native-firebase';

import { addUser } from '../api/usersApi';

class Login extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      nickname: '',
      firstName: '',
      lastName: '',
    };
  }

  componentDidMount() {
    this.props.initLogin();
  }

  componentWillReceiveProps(props) {
    let { user, error } = props;
    if (user) {
      firebase
        .messaging()
        .getToken()
        .then(pushToken => {
          if (pushToken) {
            sbRegisterPushToken(pushToken)
              .then(res => {})
              .catch(err => {});
          }
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Menu' })]
          });
          this.setState({ userId: '', nickname: '', isLoading: false }, () => {
            this.props.navigation.dispatch(resetAction);
          });
        });
    }

    if (error) {
      this.setState({ isLoading: false });
    }
  }

  _onUserIdChanged = userId => {
    this.setState({ userId });
  };

  _onNicknameChanged = nickname => {
    this.setState({ nickname });
  };

  _onFirstnameChanged = firstname => {
    this.setState({ firstname });
  };

  _onLastnameChanged = lastname => {
    this.setState({ lastname });
  };

onUserAdded = (user) => {
  console.log('User Added');
  console.log(user);
}

  _onButtonPress = () => {
    const { userId, nickname } = this.state;
    this.setState({ isLoading: true }, () => {
      this.props.sendbirdLogin({ userId, nickname });
    });
    addUser({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    }, this.onUserAdded)
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <Spinner visible={this.state.isLoading} />
        <View style={styles.logoViewStyle}>
          <Image style={{ width: 150, height: 150 }} source={require('../img/icon_sb_512.png')} />
          <Text style={styles.logoTextTitle}>TheRadar</Text>
          <Text style={styles.logoTextSubTitle}>By Students - 4 People</Text>
        </View>

        <View style={styles.inputViewStyle}>
          <TextInput
            label="User ID"
            placeholder="User ID"
            style={styles.inputStyle}
            value={this.state.userId}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onUserIdChanged}
          />
        </View>

        <View style={styles.inputViewStyle}>
          <TextInput
            label="Nickname"
            placeholder="Nickname"
            style={styles.inputStyle}
            value={this.state.nickname}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onNicknameChanged}
          />
        </View>

        <View style={styles.inputViewStyle}>
          <TextInput
            label="firstname"
            placeholder="firstname"
            style={styles.inputStyle}
            value={this.state.firstname}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onFirstnameChanged}
          />
        </View>

        <View style={styles.inputViewStyle}>
          <TextInput
            label="lastname"
            placeholder="lastname"
            style={styles.inputStyle}
            value={this.state.lastname}
            duration={100}
            autoCorrect={false}
            maxLength={16}
            underlineColorAndroid="transparent"
            onChangeText={this._onLastnameChanged}
          />
        </View>

        <View style={styles.buttonStyle}>
          <Button
            title="CONNECT"
            buttonStyle={{ backgroundColor: '#F36F6F' }}
            onPress={this._onButtonPress}
            disabled={this.state.isLoading}
          />
        </View>

        <Text style={styles.errorTextStyle}>{this.props.error}</Text>

        <View style={[styles.footerViewStyle]}>
          <Text style={styles.footerTextStyle}>Sample UI v3.0.0 / SDK v.3.0.99</Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps({ login }) {
  const { error, user } = login;
  return { error, user };
}

export default connect(
  mapStateToProps,
  { initLogin, sendbirdLogin }
)(Login);

const styles = {
  containerStyle: {
    backgroundColor: '#fff',
    flex: 1
  },
  logoViewStyle: {
    marginTop: 35,
    marginBottom: 5,
    alignItems: 'center'
  },
  logoTextTitle: {
    color: '#F36F6F',
    fontSize: 30,
    fontWeight: '600'
  },
  logoTextSubTitle: {
    color: '#F36F6F',
    fontSize: 13,
    fontWeight: '500'
  },
  inputViewStyle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 28,
    marginRight: 28,
    marginTop: 8
  },
  inputStyle: {
    fontSize: 13,
    backgroundColor: '#fff'
  },
  buttonStyle: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 50
  },
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#e03131'
  },
  footerViewStyle: {
    paddingLeft: 28,
    paddingRight: 28,
    marginTop: 15,
    flexDirection: 'column'
  },
  footerTextStyle: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#8e8e8e'
  }
};
