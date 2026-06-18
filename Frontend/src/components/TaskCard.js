

import React from 'react';

const STATUS_COLORS = {
  todo:       { bg: '#e3f2fd', text: '#1565c0', label: '📋 To Do'      },
  inprogress: { bg: '#fff8e1', text: '#f57f17', label: '🔄 In Progress' },
  done:       { bg: '#e8f5e9', text: '#2e7d32', label: '✅ Done'        },
};

const NEXT_STATUS = {
  todo:       'inprogress',
  inprogress: 'done',
  done:       null,
};

export default function TaskCard({ task, onUpdate, onDelete }) {
  const sc   = STATUS_COLORS[task.status];
  const next = NEXT_STATUS[task.status];

  return (
    <div style={styles.card}>
      {/* Status badge */}
      <span style={{ ...styles.badge, background: sc.bg, color: sc.text }}>
        {sc.label}
      </span>

      {/* Title */}
      <h3 style={styles.title}>{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p style={styles.desc}>{task.description}</p>
      )}

      {/* Due date */}
      {task.dueDate && (
        <p style={styles.due}>
          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* Action buttons */}
      <div style={styles.actions}>
        {next && (
          <button
            style={styles.moveBtn}
            onClick={() => onUpdate(task._id, { status: next })}
          >
            Move to {STATUS_COLORS[next].label}
          </button>
        )}
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(task._id)}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card:      { background:'white', borderRadius:'10px', padding:'16px', marginBottom:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', borderLeft:'4px solid #1565c0' },
  badge:     { display:'inline-block', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', marginBottom:'8px' },
  title:     { margin:'0 0 6px 0', color:'#1a237e', fontSize:'16px' },
  desc:      { color:'#555', fontSize:'14px', margin:'0 0 6px 0' },
  due:       { color:'#888', fontSize:'13px', margin:'0 0 10px 0' },
  actions:   { display:'flex', gap:'8px', flexWrap:'wrap' },
  moveBtn:   { padding:'6px 12px', background:'#1565c0', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  deleteBtn: { padding:'6px 12px', background:'#ffebee', color:'#c62828', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
};
