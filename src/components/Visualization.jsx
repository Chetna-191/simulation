import React, { useMemo } from 'react';
import TreeView from './TreeView';
import StatsPanel from './StatsPanel';
import { motion } from 'framer-motion';

const Visualization = ({ step, steps = [], currentStepIdx = -1 }) => {
  const mergeLog = useMemo(() => {
    return steps
      .slice(0, currentStepIdx + 1)
      .filter(s => s.stage === 'MERGE_NODES')
      .map(s => {
        // Parse the description to make it colorful
        // Example: "Merged a(2) + b(3) -> internal(5)"
        return s.description;
      });
  }, [steps, currentStepIdx]);

  if (currentStepIdx === -1) {
    return (
      <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <p>Enter text above and click Simulate to start.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px' }}>
      
      {/* Step 1: Frequency Table */}
      <section>
        <div className="section-header">STEP 1 — FREQUENCY TABLE</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {step?.freqMap && Object.entries(step.freqMap).map(([char, freq]) => (
            <div key={char} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: step.charColors?.[char] || 'var(--accent-primary)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s ease',
                  cursor: 'default'
                }}
                className="char-box-node"
              >
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                  {char === ' ' ? 'SPC' : char}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{freq}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 1B: Min-Heap Built */}
      <section>
        <div className="section-header">STEP 1B — MIN-HEAP BUILT</div>
        <div className="glass-panel" style={{ padding: '20px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 'bold' }}>Heap root = min frequency node. Array snapshot:</div>
          <div style={{ color: 'white' }}>
            {step?.heap ? step.heap.map((n, i) => (
              <span key={i}>
                <span style={{ color: n.isLeaf() ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}>{n.char || 'internal'}</span>({n.freq}){i < step.heap.length - 1 ? ', ' : ''}
              </span>
            )) : 'Waiting for heap...'}
          </div>
        </div>
      </section>

      {/* Step 2: Greedy Merge Log */}
      <section>
        <div className="section-header">STEP 2 — GREEDY MERGE LOG</div>
        <div className="glass-panel" style={{ padding: '20px', maxHeight: '300px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: '#0a0a0c' }}>
          {mergeLog.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>No merges yet.</div>
          ) : (
            mergeLog.map((log, i) => {
              // Extract parts: "Merged node1 + node2 -> internal node(8)"
              const parts = log.split('->');
              const nodesPart = parts[0].replace('Merged', '').trim();
              const resultPart = parts[1] ? parts[1].trim() : '';

              return (
                <div key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#888' }}>Merged</span>
                  <span style={{ color: '#4a9eff' }}>{nodesPart}</span>
                  {resultPart && <span style={{ color: '#4caf50' }}>→ {resultPart}</span>}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Step 3: Huffman Tree */}
      <section>
        <div className="section-header">STEP 3 — HUFFMAN TREE & CODE TABLE</div>
        <div className="glass-panel" style={{ height: '600px', background: 'rgba(0,0,0,0.4)', position: 'relative' }}>
          {step?.stage === 'RESULT' ? (
            <StatsPanel stats={step.stats} codes={step.codes} encodedText={step.encodedText} />
          ) : (
            <div style={{ height: '100%', width: '100%' }}>
               <TreeView 
                  roots={step?.heap || [step?.root].filter(Boolean)} 
                  activeNodes={step?.activeNodes} 
                  codes={step?.codes || {}}
                />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Visualization;
