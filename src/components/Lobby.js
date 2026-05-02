import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { dummyRooms } from '../core/data';
import { addJournal, listJournalsByUser, saveUserProfile } from '../core/mockDb';

const chartStyle = { width: 240, height: 70, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 6 };

const toPoints = (arr, key, max = null) => {
  if (!arr.length) return '';
  const values = arr.map((v) => Number(v[key]) || 0);
  const maxV = max || Math.max(...values, 1);
  return values
    .map((v, i) => `${(i / Math.max(values.length - 1, 1)) * 230 + 5},${65 - (v / maxV) * 55}`)
    .join(' ');
};

@observer
class Lobby extends Component {
  state = {
    loading: true,
    creatingRoom: false,
    roomTitle: null,
    farmName: '',
    tankCount: 0,
    tanks: '',
    selectedTank: null,
    selectedMetric: 'temp',
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
        selectedTank: (user.tanks || [])[0] || null,
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
    this.setState({ selectedTank: next.tanks[0] || null });
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
    const tankList = this.state.tanks.split(',').map((v) => v.trim()).filter(Boolean);
    const tankLogs = this.state.journals.filter((j) => j.tank === this.state.selectedTank);
    const latest = tankLogs[0] || {};

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

        <h3>수조 상세 (수조 클릭)</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {tankList.map((t) => (
            <button key={t} onClick={() => this.setState({ selectedTank: t })}>
              {t} {this.state.selectedTank === t ? '✓' : ''}
            </button>
          ))}
        </div>
        {this.state.selectedTank && (
          <div>
            <div>선택 수조: <b>{this.state.selectedTank}</b></div>
            <div>최근 측정값: T {latest.temp || '-'} / pH {latest.ph || '-'} / DO {latest.do || '-'}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
              {['temp', 'ph', 'do', 'salinity', 'ammonia', 'turbidity'].map((m) => (
                <button key={m} onClick={() => this.setState({ selectedMetric: m })}>{m}</button>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <svg viewBox='0 0 240 70' style={chartStyle}>
                <polyline fill='none' stroke='#2563eb' strokeWidth='2' points={toPoints(tankLogs.slice(0, 12).reverse(), this.state.selectedMetric)} />
              </svg>
            </div>
          </div>
        )}

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
