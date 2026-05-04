
import React from 'react';
import { Download } from 'lucide-react';

const StatsPanel = ({ stats, codes, encodedText }) => {
  const downloadBinary = () => {
    // Basic implementation to download the binary string as a file
    const blob = new Blob([encodedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.bin';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Original Size</div>
          <div className="stat-value">{stats.originalSize} bits</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Compressed Size</div>
          <div className="stat-value">{stats.compressedSize} bits</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ratio</div>
          <div className="stat-value">{stats.compressionRatio}%</div>
        </div>
      </div>

      <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <h4 style={{ marginBottom: '15px' }}>Bit Stream Output</h4>
        <div style={{ 
          wordBreak: 'break-all', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.8rem', 
          color: 'var(--accent-secondary)',
          maxHeight: '150px',
          overflowY: 'auto',
          padding: '10px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px'
        }}>
          {encodedText}
        </div>
        <button className="btn-primary" onClick={downloadBinary} style={{ marginTop: '15px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Download size={18} /> Export as Binary
        </button>
      </div>

      <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <h4 style={{ marginBottom: '15px' }}>Character Code Table</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {Object.entries(codes).map(([char, code]) => (
            <div key={char} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
              <span style={{ fontWeight: 'bold' }}>{char === ' ' ? 'Space' : char}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>{code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
