import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';

type Task = {
  id: bigint;
  title: string;
  lead: string;
  project: string;
  dueDate: string | null;
  completed: boolean | null;
};

type Category = {
  name: string;
  icon: string;
};

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await backend.getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const result = await backend.getTasks('');
      setTasks(result.map(task => ({
        ...task,
        id: Number(task.id),
        completed: task.completed[0] ?? null,
        dueDate: task.dueDate[0] ?? null
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await backend.addTask(selectedCategory, {
        ...data,
        id: BigInt(0),
        dueDate: [data.dueDate],
        completed: [false]
      });
      fetchTasks();
      setModalIsOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskStatus = async (taskId: bigint, completed: boolean) => {
    try {
      await backend.updateTaskStatus(taskId, completed);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <Box className="container mx-auto p-4">
      <Typography variant="h4" className="mb-4">Task Manager</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {categories.map((category) => (
            <Box key={category.name} className="mb-6">
              <Typography variant="h5" className="flex items-center mb-2">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Typography>
              <Box className="space-y-2">
                {tasks
                  .filter((task) => task.project === category.name)
                  .map((task) => (
                    <Box key={Number(task.id)} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <Box>
                        <Typography>{task.title}</Typography>
                        <Box className="flex space-x-2 mt-1">
                          <span className="task-lead">{task.lead}</span>
                          <span className="project">{task.project}</span>
                          {task.dueDate && <span className="due-date">{task.dueDate}</span>}
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        color={task.completed ? 'primary' : 'secondary'}
                        onClick={() => updateTaskStatus(BigInt(task.id), !task.completed)}
                      >
                        {task.completed ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </Box>
                  ))}
              </Box>
              <Button
                variant="outlined"
                className="mt-2"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setModalIsOpen(true);
                }}
              >
                Add Task
              </Button>
            </Box>
          ))}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="modal"
            overlayClassName="overlay"
          >
            <Typography variant="h6" className="mb-4">Add New Task</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label="Title" fullWidth />}
              />
              <Controller
                name="lead"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => <TextField {...field} label="Lead" fullWidth />}
              />
              <Controller
                name="dueDate"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />}
              />
              <Button type="submit" variant="contained" color="primary">Add Task</Button>
            </form>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default App;
