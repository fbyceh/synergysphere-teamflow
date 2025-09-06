import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, User, Clock, MessageSquare, Save, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Mock task data - replace with actual data fetching
  const [task, setTask] = useState<Task>({
    id: taskId || '1',
    title: 'Design User Authentication Flow',
    description: 'Create wireframes and mockups for the login, signup, and password reset flows. Include mobile responsive designs.',
    assignee: 'Sarah Chen',
    assigneeAvatar: undefined,
    dueDate: '2024-02-15',
    status: 'in-progress',
    priority: 'high',
    comments: [
      {
        id: '1',
        author: 'John Doe',
        content: 'Started working on the wireframes. Should have initial drafts ready by tomorrow.',
        timestamp: '2024-01-10T10:30:00Z'
      },
      {
        id: '2',
        author: 'Sarah Chen',
        content: 'Thanks! Make sure to include the forgot password flow as well.',
        timestamp: '2024-01-10T14:15:00Z'
      }
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Task updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        content: newComment,
        timestamp: new Date().toISOString()
      };
      setTask({
        ...task,
        comments: [...task.comments, comment]
      });
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-muted text-muted-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'done': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/project/${projectId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          <div className="flex-1" />
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Task
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  {isEditing ? (
                    <Input
                      value={task.title}
                      onChange={(e) => setTask({...task, title: e.target.value})}
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                  )}
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        value={task.description}
                        onChange={(e) => setTask({...task, description: e.target.value})}
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({task.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Comment */}
                  <div className="border-t pt-4">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={2}
                        />
                        <Button onClick={handleAddComment} size="sm">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Assignee */}
                <div>
                  <Label className="text-sm font-medium">Assignee</Label>
                  {isEditing ? (
                    <Select value={task.assignee} onValueChange={(value) => setTask({...task, assignee: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={task.assigneeAvatar} />
                        <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee}</span>
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => setTask({...task, dueDate: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  {isEditing ? (
                    <Select value={task.status} onValueChange={(value: any) => setTask({...task, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getStatusColor(task.status)} mt-1`}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  {isEditing ? (
                    <Select value={task.priority} onValueChange={(value: any) => setTask({...task, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getPriorityColor(task.priority)} mt-1`}>
                      {task.priority}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;