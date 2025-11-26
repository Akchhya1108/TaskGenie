export const exportTasksToCSV = (tasks) => {
  if (!tasks || tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  const headers = [
    'Title',
    'Description',
    'Category',
    'Priority',
    'Status',
    'Completed',
    'Due Date',
    'Created At',
    'Tags'
  ];

  const csvContent = [
    headers.join(','),
    ...tasks.map(task => [
      `"${task.title || ''}"`,
      `"${task.description || ''}"`,
      task.category || '',
      task.priority || '',
      task.status || '',
      task.completed ? 'Yes' : 'No',
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
      new Date(task.createdAt).toLocaleDateString(),
      `"${task.tags?.join(', ') || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `taskgenie-tasks-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};