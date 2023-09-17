/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Modal.js

import { Timestamp } from "firebase/firestore";
import "./Modal.scss";

import { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, onAddTask, newTask, setNewTask, fetchUsers, collaborators, onCollaboratorChange }) => {

    const [localNewTask, setLocalNewTask] = useState(newTask);
    const [availableUsers, setAvailableUsers] = useState([]);

    useEffect(() => {
        // Ensure that the dueDate in newTask is formatted correctly
        const formattedDueDate = newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : '';
        setLocalNewTask({
            ...newTask,
            dueDate: formattedDueDate,
        });
    }, [newTask]);


    useEffect(() => {
        // Fetch available users when the modal opens
        if (isOpen) {
            fetchUsers().then((users) => {
                setAvailableUsers(users);
            });
        }
    }, [isOpen, fetchUsers]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Use the appropriate value based on the input type
        let inputValue = type === 'checkbox' ? checked : value;

        if (name === 'dueDate') {
            // Ensure the date is in the correct format (e.g., yyyy-mm-dd)
            const formattedDate = new Date(value).toISOString().split('T')[0];
            const firestoreTimestamp = Timestamp.fromDate(new Date(formattedDate));
            inputValue = firestoreTimestamp;
        } else if (type === 'checkbox') {
            inputValue = checked;
        }

        setLocalNewTask({
            ...localNewTask,
            [name]: inputValue,
        });
    };

    const handleCollaboratorChange = (userId) => {
        // Handle collaborator selection
        const updatedCollaborators = collaborators.includes(userId)
            ? collaborators.filter((id) => id !== userId)
            : [...collaborators, userId];

        onCollaboratorChange(updatedCollaborators);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTask(localNewTask);
        setLocalNewTask({
            title: '',
            description: '',
            completed: false,
            dueDate: '',
        });
        onClose();
    };

    console.log("isopen value", isOpen)

    return (
        <div className={`modal1 ${isOpen ? "open" : ""}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>Add Task</h2>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={localNewTask.title}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Description:
                    <input
                        type="text"
                        name="description"
                        value={localNewTask.description}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Completed:
                    <input
                        type="checkbox"
                        name="completed"
                        checked={localNewTask.completed}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Due Date:
                    <input
                        type="date"
                        name="dueDate"
                        value={localNewTask.dueDate}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Collaborators:
                    <select
                        multiple
                        name="collaborators"
                        value={collaborators}
                        onChange={(e) => onCollaboratorChange(Array.from(e.target.selectedOptions, (option) => option.value))}
                    >
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.displayName}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleSubmit}>Add Task</button>
            </div>
        </div>
    );
};

export default Modal;
