import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  ListGroup,
  Pagination,
  Modal,
} from "react-bootstrap";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../lib/taskService";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", deadline: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  useEffect(() => {
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline || !form.description) return;

    if (editingTaskId) {
      setPendingUpdate({ ...form });
      setShowUpdateConfirm(true);
    } else {
      const res = await createTask(form);
      setTasks([...tasks, res.data]);
    }

    setForm({ title: "", description: "", deadline: "" });
    setShowForm(false);
  };

  const confirmUpdate = async () => {
    if (editingTaskId && pendingUpdate) {
      await updateTask(editingTaskId, pendingUpdate);
      const updatedTasks = tasks.map((t) =>
        t._id === editingTaskId ? { ...t, ...pendingUpdate } : t
      );
      setTasks(updatedTasks);
  
      // Cleanup
      setPendingUpdate(null);
      setEditingTaskId(null);
      setForm({ title: "", description: "", deadline: "" });
      setShowForm(false);
      setShowUpdateConfirm(false);
    }
  };
  const createTaskAndRefresh = async () => {
    const newTask = await createTask(form); // Your API function
    setTasks([...tasks, newTask]);
    setForm({ title: "", description: "", deadline: "" });
    setShowForm(false);
  };
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
      setTasks(tasks.filter((t) => t._id !== taskToDelete._id));
      setTaskToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline.slice(0, 16),
    });
    setEditingTaskId(task._id);
    setShowForm(true);
  };

  const toggleCompleted = async (task) => {
    const res = await updateTask(task._id, { completed: !task.completed });
    setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
  };

  const now = new Date();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
  
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold">📝 Task Manager</h1>
            <button
              className="btn btn-primary"
              onClick={() => {
                setForm({ title: "", description: "", deadline: "" });
                setEditingTaskId(null);
                setShowForm(true);
              }}
            >
              + Create Task
            </button>
          </div>
  
          {/* Task List or Empty State */}
          {tasks.length === 0 ? (
            <div className="text-center mt-5">
              <p className="text-muted fs-5">No tasks available</p>
              <button
                className="btn btn-outline-primary mt-3"
                onClick={() => {
                  setForm({ title: "", description: "", deadline: "" });
                  setEditingTaskId(null);
                  setShowForm(true);
                }}
              >
                🚀 Create Your First Task
              </button>
            </div>
          ) : (
            <>
              <div className="list-group mb-5">
                {tasks.map((task) => {
                  const isOverdue = new Date(task.deadline) < now;
                  const isFading = task.completed && isOverdue;
                  return (
                    <div
                      key={task._id}
                      className={`list-group-item list-group-item-action mb-3 p-4 shadow-sm rounded ${
                        isFading ? "opacity-50" : ""
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h5
                            className={`mb-1 fw-semibold ${
                              task.completed ? "text-decoration-line-through text-secondary" : ""
                            }`}
                          >
                            {task.title}
                          </h5>
                          <p className="mb-1 text-muted">{task.description}</p>
                          <small className="text-muted">
                            📅 Deadline:{" "}
                            <strong>{new Date(task.deadline).toLocaleString()}</strong>
                          </small>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2 ms-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleCompleted(task)}
                            className="form-check-input"
                            title="Mark as completed"
                          />
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(task)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDeleteClick(task)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
  
              {/* Pagination Placeholder */}
              <nav>
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <button className="page-link">Previous</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">2</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </nav>
            </>
          )}
          <Modal show={showUpdateConfirm} onHide={() => setShowUpdateConfirm(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Update</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to update the task:{" "}
    <strong>{pendingUpdate?.title}</strong>?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUpdateConfirm(false)}>
      Cancel
    </Button>
    <Button variant="success" onClick={confirmUpdate}>
      Yes, Update
    </Button>
  </Modal.Footer>
</Modal>

  <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete{" "}
    <strong>{taskToDelete?.title}</strong>?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={confirmDelete}>
      Yes, Delete
    </Button>
  </Modal.Footer>
</Modal>

          {/* Task Form */}
          {showForm && (
            <div className="card shadow-sm mb-5">
              <div className="card-body">
                <h4 className="card-title mb-4">
                  {editingTaskId ? "Edit Task" : "Add a New Task"}
                </h4>
                {/* Task Form Modal */}
<Modal show={showForm} onHide={() => {
  setShowForm(false);
  setEditingTaskId(null);
  setForm({ title: "", description: "", deadline: "" });
}} centered>
  <Modal.Header closeButton>
    <Modal.Title>{editingTaskId ? "Edit Task" : "Add a New Task"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="Enter task title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          placeholder="Enter task description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Deadline</Form.Label>
        <Form.Control
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button type="submit" variant="success">
          {editingTaskId ? "Update Task" : "Add Task"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setShowForm(false);
            setEditingTaskId(null);
            setForm({ title: "", description: "", deadline: "" });
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
  
};

export default TaskManager;
