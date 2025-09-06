import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowLeft, Users, MessageSquare, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Zap, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee: string;
  assigneeName: string;
  assigneeAvatar?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface Message {
  id: string;
  author: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design homepage wireframes',
      description: 'Create initial wireframes for the new homepage layout',
      status: 'done',
      assignee: '1',
      assigneeName: 'John Doe',
      assigneeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      dueDate: '2024-02-10',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Implement responsive navigation',
      description: 'Code the responsive navigation component with mobile menu',
      status: 'in-progress',
      assignee: '2',
      assigneeName: 'Sarah Chen',
      assigneeAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b3c79?w=100&h=100&fit=crop&crop=face',
      dueDate: '2024-02-15',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Content strategy planning',
      description: 'Plan content structure and copywriting approach',
      status: 'todo',
      assignee: '3',
      assigneeName: 'Mike Johnson',
      dueDate: '2024-02-20',
      priority: 'low'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: '1',
      authorName: 'John Doe',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: 'Just finished the wireframes! Ready for review.',
      timestamp: '2024-02-08T10:30:00Z'
    },
    {
      id: '2',
      author: '2',
      authorName: 'Sarah Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b3c79?w=100&h=100&fit=crop&crop=face',
      content: 'Great work! I\'ll start on the navigation component today.',
      timestamp: '2024-02-08T11:15:00Z'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as const
  });

  const [newMessage, setNewMessage] = useState('');
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);

  // Mock project data
  const project = {
    id: projectId,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with new branding',
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
      { id: '2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b3c79?w=100&h=100&fit=crop&crop=face' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face' }
    ]
  };

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      const assigneeMember = project.members.find(m => m.id === newTask.assignee);
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: 'todo',
        assignee: newTask.assignee,
        assigneeName: assigneeMember?.name || 'Unassigned',
        assigneeAvatar: assigneeMember?.avatar,
        dueDate: newTask.dueDate,
        priority: newTask.priority
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', assignee: '', dueDate: '', priority: 'medium' });
      setShowCreateTaskDialog(false);
      toast({
        title: "Task created!",
        description: `${task.title} has been added to the project.`,
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        author: user?.id || '1',
        authorName: user?.name || 'You',
        authorAvatar: user?.avatar,
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'in-progress': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'todo': return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'todo': return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{project.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {project.members.map((member) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Team
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="chat">Discussion</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Tasks</h2>
              <Dialog open={showCreateTaskDialog} onOpenChange={setShowCreateTaskDialog}>
                <DialogTrigger asChild>
                  <Button className="shadow-elegant">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to this project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        placeholder="Enter task title..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        placeholder="Describe the task..."
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-assignee">Assignee</Label>
                      <Select value={newTask.assignee} onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {project.members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="task-due-date">Due Date</Label>
                        <Input
                          id="task-due-date"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateTask} className="flex-1">
                        Create Task
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateTaskDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Task Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['todo', 'in-progress', 'done'] as const).map((status) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <h3 className="font-semibold capitalize">
                      {status.replace('-', ' ')} ({tasks.filter(t => t.status === status).length})
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {tasks.filter(task => task.status === status).map((task) => (
                      <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium leading-5">
                              {task.title}
                            </CardTitle>
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                          </div>
                          {task.description && (
                            <CardDescription className="text-xs line-clamp-2">
                              {task.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={task.assigneeAvatar} />
                                <AvatarFallback className="text-xs">{task.assigneeName[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <Select value={task.status} onValueChange={(value: any) => updateTaskStatus(task.id, value)}>
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Project Discussion
                </CardTitle>
                <CardDescription>
                  Team communication and updates for this project
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.authorAvatar} />
                        <AvatarFallback>{message.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;