/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
// import firebase from '../../firebase';
import { onSnapshot, collection, serverTimestamp, query, where } from 'firebase/firestore';
// import { useState } from 'react';
import Card from '../../components/card/Card';
import { db } from '../../firebase';
// import { app, db, analytics } from '../../firebase';



import { addDoc, doc, updateDoc, deleteDoc, } from 'firebase/firestore';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        completed: false,
        dueDate: '',
        collaborators: [],
    });

    const [selectedCollaborators, setSelectedCollaborators] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'completed', or 'incomplete'


    const [isModalOpen, setIsModalOpen] = useState(false);


    // const { logout } = useAuth()
    const navigate = useNavigate();

    const { logout, currentUser } = useAuth();

    useEffect(() => {

        if (!currentUser) {
            // Handle the case when the user is not logged in
            return;
        }

        const unsubscribe = onSnapshot(
            query(collection(db, "tasks"), where('userId', '==', currentUser.uid)),
            (snapshot) => {
                const taskList = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    // Check if the 'dueDate' field is defined in the Firestore document
                    const dueDate = data.dueDate && data.dueDate.toDate ? data.dueDate.toDate() : null;
                    // Format the dueDate as a string (you can adjust the formatting as needed)
                    const formattedDueDate = dueDate ? dueDate.toLocaleDateString() : "N/A"; // Provide a default if 'dueDate' is not defined
                    return {
                        ...data,
                        id: doc.id,
                        dueDate: formattedDueDate, // Replace 'dueDate' with the formatted string
                    };

                });
                setTasks(taskList);
                console.log("fromatted data", formattedDueDate);
                console.log(" current users id", currentUser.uid)
            });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, [currentUser]);



    const fetchUsers = async () => {
        // Query Firestore to get a list of available users (excluding the current user)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        return usersList.filter((user) => user.id !== currentUser.uid);
    };

    const handleCollaboratorChange = (userId) => {
        // Function to handle the selection of collaborators
        if (selectedCollaborators.includes(userId)) {
            setSelectedCollaborators(selectedCollaborators.filter((id) => id !== userId));
        } else {
            setSelectedCollaborators([...selectedCollaborators, userId]);
        }
    };

    const addTask = async () => {
        const user = currentUser;
        if (!user) {
            // Handle the case when the user is not logged in
            return;
        }
        const newTaskData = {
            title: newTask.title,
            description: newTask.description,
            completed: newTask.completed,
            dueDate: newTask.dueDate || serverTimestamp(),
            userId: user.uid,
            collaborators: selectedCollaborators, // Include selected collaborators here

        };

        try {
            await addDoc(collection(db, 'tasks'), newTaskData); // Use the 'db' instance
            setNewTask({
                title: '',
                description: '',
                completed: false,
                dueDate: serverTimestamp(),
            });
            setSelectedCollaborators([]); // Clear selected collaborators
            setIsModalOpen(false)
            unsubscribe(); // Refresh the task list
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleTask = async (id, completed) => {
        try {
            await updateDoc(doc(db, 'tasks', id), { completed: !completed }); // Use the 'db' instance
            unsubscribe(); // Refresh the task list
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const deleteTask = async id => {
        try {
            await deleteDoc(doc(db, 'tasks', id)); // Use the 'db' instance
            unsubscribe(); // Refresh the task list
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });



    console.log(tasks)

    const openModal = () => {
        setIsModalOpen(true);
        console.log("clicked")
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    async function handleLogout() {

        try {
            await logout()
            navigate('/');
        } catch {
            console.log("error occured while logging out")
        }

    }

    return (
        <div>
            <div className="logout">
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="modal">
                <button onClick={openModal}>Add Task</button>

            </div>
            <div className="div">
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onAddTask={addTask}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    fetchUsers={fetchUsers} // Pass the fetchUsers function to the Modal
                    collaborators={selectedCollaborators} // Pass the selected collaborators to the Modal
                    onCollaboratorChange={handleCollaboratorChange} // Pass the collaborator change handler
                />

            </div>




            <div>
                Filter:
                <select onChange={e => setFilter(e.target.value)} value={filter}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </div>
            <ul>
                {filteredTasks.map(task => (
                    <li key={tasks.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id, task.completed)}
                        />
                        <Card
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            dueDate={task.dueDate}
                            completed={task.completed}
                            toggleTask={toggleTask}
                            deleteTask={deleteTask} />
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>


        </div>
    );
};

export default Task;
