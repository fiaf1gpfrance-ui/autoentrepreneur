import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TaskListWidgetProps {
  initialTasks?: Task[];
}

export function TaskListWidget({ initialTasks = [] }: TaskListWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks.length > 0 ? initialTasks : [
    { id: '1', text: 'Recruter un développeur', completed: false, priority: 'high' },
    { id: '2', text: 'Lancer campagne marketing', completed: false, priority: 'medium' },
    { id: '3', text: 'Payer les impôts', completed: true, priority: 'high' },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks(prev => [...prev, {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        priority: 'medium'
      }]);
      setNewTaskText('');
      setShowInput(false);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ListTodo className="w-3 h-3" />
          <span>{completedCount}/{tasks.length} terminées</span>
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-5 h-5 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors"
        >
          <Plus className="w-3 h-3 text-primary" />
        </button>
      </div>

      {/* New Task Input */}
      {showInput && (
        <div className="flex gap-1">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Nouvelle tâche..."
            className="flex-1 text-[10px] px-2 py-1 bg-background/50 rounded border border-white/10 focus:outline-none focus:border-primary/50"
            autoFocus
          />
          <button
            onClick={addTask}
            className="px-2 py-1 text-[10px] bg-primary/30 hover:bg-primary/50 rounded transition-colors"
          >
            Ajouter
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-1 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {tasks.map(task => (
          <div
            key={task.id}
            className={cn(
              "group flex items-center gap-2 bg-background/30 rounded px-2 py-1.5 transition-all",
              task.completed && "opacity-50"
            )}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="shrink-0"
            >
              {task.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              ) : (
                <Circle className={cn("w-3.5 h-3.5", getPriorityColor(task.priority))} />
              )}
            </button>
            <span className={cn(
              "flex-1 text-[10px] truncate",
              task.completed && "line-through"
            )}>
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
