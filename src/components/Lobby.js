import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { dummyRooms } from '../core/data';
import { addJournal, listJournalsByUser, saveUserProfile } from '../core/mockDb';

@observer
class Lobby extends Component {
  state = {
    loading: true,
    creatingRoom: false,
    roomTitle: null,
    farmName: '',
    tankCount: 0,
    tanks: '',
    journal: { tank: '', temp: '', ph: '', do: '', salinity: '', ammonia: '', turbidity: '', note: '' },
    journals: [],
  };

  componentDidMount() {
    const { user } = this.props;
    setTimeout(() => {
      this.props.setRooms(dummyRooms);
      this.setState((state) => ({
        ...state,
        loading: false,
        farmName: user.farmName || '',
        tankCount: user.tankCount || 0,
        tanks: (user.tanks || []).join(', '),
        journals: listJournalsByUser(user.id),
      }));
    }, 300);
  }

  enterRoom = (room) => this.props.setActiveRoomId(room.id);

  onSaveProfile = () => {
    const { farmName, tankCount, tanks } = this.state;
    const next = saveUserProfile(this.props.user.id, {
      farmName,
      tankCount: Number(tankCount),
      tanks: tanks.split(',').map((v) => v.trim()).filter(Boolean),
    });
    this.props.setUser(next);
  };

  onJournal = () => {
    addJournal({ userId: this.props.user.id, createdAt: new Date().toISOString(), ...this.state.journal });
    this.setState((s) => ({
      ...s,
      journal: { tank: '', temp: '', ph: '', do: '', salinity: '', ammonia: '', turbidity: '', note: '' },
      journals: listJournalsByUser(this.props.user.id),
    }));
  };

  render() {
    const { rooms } = this.props;

    return (
      <div className='chat-lobby'>
        <h1>LOBBY</h1>
        <h3>양식장/수조 기본정보</h3>
        <input value={this.state.farmName} onChange={(e) => this.setState({ farmName: e.target.value })} placeholder='양식장명' />
        <input type='number' value={this.state.tankCount} onChange={(e) => this.setState({ tankCount: e.target.value })} placeholder='수조 개수' />
        <input value={this.state.tanks} onChange={(e) => this.setState({ tanks: e.target.value })} placeholder='수조 목록 (예: T1, T2)' />
        <button onClick={this.onSaveProfile}>기본정보 저장</button>

        <h3>모니터링 일지 입력 (DB 연동 대비)</h3>
        {['tank', 'temp', 'ph', 'do', 'salinity', 'ammonia', 'turbidity', 'note'].map((k) => (
          <input
            key={k}
            value={this.state.journal[k]}
            placeholder={k}
            onChange={(e) => this.setState((s) => ({ ...s, journal: { ...s.journal, [k]: e.target.value } }))}
          />
        ))}
        <button onClick={this.onJournal}>일지 저장</button>
        <ul>
          {this.state.journals.slice(0, 5).map((j) => (
            <li key={j.id}>{j.createdAt} / {j.tank} / T:{j.temp} pH:{j.ph} DO:{j.do}</li>
          ))}
        </ul>

        <ul>
          {this.state.loading && rooms.length === 0 ? (
            <li>채팅방 목록을 불러오는 중...</li>
          ) : rooms.map((room) => (
            <li key={room.id} onClick={() => this.enterRoom(room)}>
              <span>{room.title} <small>({room.users.length.toLocaleString()})</small></span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Lobby;
