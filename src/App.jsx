
import React, { useState, useEffect, useRef } from 'react';
import { generateSimulationSteps } from './logic/huffman';
import Visualization from './components/Visualization';
import EducationalPanel from './components/EducationalPanel';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Download } from 'lucide-react';

const PRESETS = {
  pangram: "The quick brown fox jumps over the lazy dog",
  redundancy: "AAAAAABBBCCCCDDDEEEEE",
  binary: "0101110010101111",
  test: "ernerkgnragebjjjjjjnrgwlllll"
};

function App() {
  const [input, setInput] = useState(PRESETS.test);
  const [selectedPreset, setSelectedPreset] = useState("test");
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  const timerRef = useRef(null);

  const startSimulation = () => {
    const generatedSteps = generateSimulationSteps(input);
    if (generatedSteps.length === 0) return;
    setSteps(generatedSteps);
    setCurrentStepIdx(0);
    setIsPlaying(true); // Auto-start the simulation
  };

  const reset = () => {
    setSteps([]);
    setCurrentStepIdx(-1);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(nextStep, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentStepIdx, speed, steps.length]);

  const currentStep = steps[currentStepIdx] || null;

  return (
    <div className="container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Examples Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Examples:</span>
        {Object.keys(PRESETS).map(key => (
          <button 
            key={key} 
            className="preset-btn"
            onClick={() => {
              setSelectedPreset(key);
              setInput(PRESETS[key]);
              reset();
            }}
            style={{ 
              padding: '6px 16px', 
              borderRadius: '20px', 
              background: selectedPreset === key ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: selectedPreset === key ? 'white' : 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Controls */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="input-field" 
            value={input} 
            style={{ flex: 1, fontSize: '1.1rem', padding: '12px 20px' }}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectedPreset("");
              reset();
            }}
            placeholder="Enter text to compress..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={startSimulation} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px 30px', 
              background: 'var(--accent-primary)', 
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            <Play size={18} fill="currentColor" />
            Simulate Compression
          </button>
          <button 
            className="btn-secondary" 
            onClick={reset}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)'
            }}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SPEED</span>
               <input 
                  type="range" 
                  min="200" 
                  max="2000" 
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  style={{ width: '100px' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="nav-btn" onClick={prevStep} disabled={currentStepIdx <= 0}><ChevronLeft size={18} /></button>
              <button className="nav-btn" onClick={nextStep} disabled={currentStepIdx === -1 || currentStepIdx >= steps.length - 1}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Breadcrumbs */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
        {[
          { label: 'Frequency Table', stage: 'FREQUENCY_MAP' },
          { label: 'Build Heap', stage: 'INITIAL_FOREST' },
          { label: 'Merge Nodes', stage: 'MERGE_NODES' },
          { label: 'Assign Codes', stage: 'ASSIGN_CODES' },
          { label: 'Encode', stage: 'RESULT' }
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep?.stage === s.stage ? 1 : 0.4 }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentStep?.stage === s.stage ? 'var(--accent-secondary)' : '#666' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: currentStep?.stage === s.stage ? 'white' : 'var(--text-muted)' }}>{s.label}</span>
            {i < 4 && <ChevronRight size={12} color="#444" />}
          </div>
        ))}
      </div>

      {/* Unified Visualization Section */}
      <main>
        <Visualization 
          step={currentStep} 
          steps={steps}
          currentStepIdx={currentStepIdx}
        />
      </main>

      <footer style={{ marginTop: '100px', padding: '40px 0', textAlign: 'center', color: '#444', fontSize: '0.7rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        HuffZip Educational Engine • Designed by Antigravity
      </footer>
    </div>
  );
}

export default App;
