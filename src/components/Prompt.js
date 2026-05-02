import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { avatarUrls } from '../core/data';
import { login, signup } from '../core/mockDb';

@observer
class Prompt extends Component {
  state = {
    mode: 'login',
    loading: false,
    avatarUrl: avatarUrls[0],
    nickname: '',
    email: 'test@shrimp.local',
    password: 'test1234',
    farmName: '',
    tankCount: 0,
    message: '',
  };

  setField = (key, value) => this.setState((s) => ({ ...s, [key]: value }));

  submit = (e) => {
    e.preventDefault();
    const { mode, loading, email, password, nickname, avatarUrl, farmName, tankCount } = this.state;
    if (loading) return;

    this.setState((s) => ({ ...s, loading: true, message: '' }));

    try {
      const user =
        mode === 'login'
          ? login({ email, password })
          : signup({ email, password, nickname, avatarUrl, farmName, tankCount: Number(tankCount), tanks: [] });

      if (!user) {
        this.setState((s) => ({ ...s, loading: false, message: '로그인 실패: 계정을 확인하세요.' }));
        return;
      }

      this.props.setUser(user);
    } catch (err) {
      this.setState((s) => ({ ...s, message: err.message, loading: false }));
    }
  };

  render() {
    const { mode } = this.state;
    return (
      <div className='chat-prompt'>
        <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>
        <p>테스트 계정: test@shrimp.local / test1234</p>
        <form onSubmit={this.submit}>
          <input type='email' value={this.state.email} placeholder='이메일' onChange={(e) => this.setField('email', e.target.value)} />
          <input type='password' value={this.state.password} placeholder='비밀번호' onChange={(e) => this.setField('password', e.target.value)} />
          {mode === 'signup' && (
            <>
              <input type='text' value={this.state.nickname} placeholder='닉네임' onChange={(e) => this.setField('nickname', e.target.value)} />
              <input type='text' value={this.state.farmName} placeholder='양식장명' onChange={(e) => this.setField('farmName', e.target.value)} />
              <input type='number' value={this.state.tankCount} placeholder='수조 개수' onChange={(e) => this.setField('tankCount', e.target.value)} />
              <ul>
                {avatarUrls.map((avatarUrl, key) => (
                  <li key={key}>
                    <img src={avatarUrl} width={this.state.avatarUrl === avatarUrl ? 80 : 40} onClick={() => this.setField('avatarUrl', avatarUrl)} />
                  </li>
                ))}
              </ul>
            </>
          )}
          <input type='submit' value={mode === 'login' ? '로그인' : '회원가입'} disabled={this.state.loading} />
        </form>
        <button onClick={() => this.setField('mode', mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? '회원가입으로' : '로그인으로'}
        </button>
        {this.state.message && <p>{this.state.message}</p>}
      </div>
    );
  }
}

export default Prompt;
