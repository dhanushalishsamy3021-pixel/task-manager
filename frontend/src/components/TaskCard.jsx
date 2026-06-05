export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggle}
          title="Toggle status"
        />
        <h3 className={isCompleted ? 'strikethrough' : ''}>{task.title}</h3>
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-footer">
        <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
          {task.status}
        </span>
        <div className="task-actions">
          <button onClick={onEdit} className="btn-icon">✏️ Edit</button>
          <button onClick={onDelete} className="btn-icon btn-danger">🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}