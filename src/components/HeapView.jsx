
import React from 'react';
import { motion } from 'framer-motion';

const HeapView = ({ heap, activeNodes = [] }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {heap.map((node, index) => {
        const isActive = activeNodes.includes(node.id);
        return (
          <motion.div
            key={node.id}
            layout
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: node.color || 'var(--bg-card-border)',
              boxShadow: isActive ? `0 0 15px ${node.color || 'var(--accent-primary)'}` : 'none'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '2px solid',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '0.8rem', position: 'absolute', top: '-10px', background: 'var(--bg-main)', padding: '0 5px', borderRadius: '4px' }}>
              #{index}
            </span>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: node.color || 'white' }}>
              {node.char === ' ' ? '␣' : (node.char || '•')}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{node.freq}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeapView;
