// Fixed excerpt from user-provided snippet: normalize smart quotes and ellipsis token.
export const nowTime = () => {
  const t = new Date();
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
};

export const statusColor = (s, C) =>
  s === 'normal' ? C.success : s === 'warning' ? C.warn : C.danger;

export const statusLabel = (s) =>
  s === 'normal' ? '정상' : s === 'warning' ? '주의' : '위험';
