
import React from 'react';

const PSEUDOCODE = [
  "HUFFMAN(C)",
  "1  n = |C|",
  "2  Q = C (Frequency Map)",
  "3  for i = 1 to n - 1",
  "4      allocate a new node z",
  "5      z.left = x = EXTRACT-MIN(Q)",
  "6      z.right = y = EXTRACT-MIN(Q)",
  "7      z.freq = x.freq + y.freq",
  "8      INSERT(Q, z)",
  "9  return EXTRACT-MIN(Q)"
];

const STAGE_TO_LINES = {
  'FREQUENCY_MAP': [1, 2],
  'INITIAL_FOREST': [2],
  'SELECT_MIN': [3, 5, 6],
  'MERGE_NODES': [4, 7, 8],
  'TREE_COMPLETE': [10],
  'ASSIGN_CODES': [10],
  'RESULT': []
};

const EducationalPanel = ({ step }) => {
  const activeLines = step ? (STAGE_TO_LINES[step.stage] || []) : [];

  return (
    <div className="educational-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel">
        <h3 style={{ marginBottom: '15px', color: 'var(--accent-primary)' }}>Pseudocode</h3>
        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.8rem', 
          background: 'rgba(0,0,0,0.3)', 
          padding: '15px', 
          borderRadius: '8px',
          color: '#dcdcaa',
          lineHeight: '1.6'
        }}>
          {PSEUDOCODE.map((line, index) => (
            <div 
              key={index} 
              style={{ 
                background: activeLines.includes(index) ? 'rgba(124, 77, 255, 0.3)' : 'transparent',
                borderLeft: activeLines.includes(index) ? '3px solid var(--accent-primary)' : '3px solid transparent',
                paddingLeft: '10px',
                transition: 'all 0.3s'
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '15px', color: 'var(--accent-secondary)' }}>Complexity Analysis</h3>
        <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <strong>Frequency Map:</strong> <span style={{ color: 'var(--accent-secondary)' }}>O(n)</span>
          </div>
          <div>
            <strong>Build Min-Heap:</strong> <span style={{ color: 'var(--accent-secondary)' }}>O(n log n)</span>
          </div>
          <div>
            <strong>Build Tree:</strong> <span style={{ color: 'var(--accent-secondary)' }}>O(n log n)</span>
          </div>
          <div style={{ marginTop: '5px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
            <p>Each <code>EXTRACT-MIN</code> and <code>INSERT</code> operation takes <code>O(log n)</code>. We do this <code>n</code> times.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '10px', color: 'var(--accent-primary)' }}>Key Insights</h3>
        <ul style={{ fontSize: '0.85rem', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
          <li>Greedy choice: Merge two nodes with lowest frequencies first.</li>
          <li>Prefix-free property: No code is a prefix of another.</li>
          <li>Optimal for character-by-character compression.</li>
        </ul>
      </div>
    </div>
  );
};

export default EducationalPanel;
