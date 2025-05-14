import { View, Text, StyleSheet, Pressable, TextInput, Alert, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { useState, useEffect } from "react";    
import io from "socket.io-client";                               
import  axios  from "axios";                                                   //axios for make HTTP requests


export default function MyApp() {

    const [title, setTitle] = useState('');                                      //state variable declaration for title
    const [description, setDescription] = useState('');                         //state variable declaration for description
    const [tasks, setTasks] = useState([]);                                     //state variable declaration for tasks
    const [editId, setEditId] = useState(null);                                 //state variable declaration for editId

    const api = axios.create({                                                  //create instance for axios 'api'
        baseURL: 'http://192.168.81.68:4000/tasks'                              //
    });

    const socket = io("http://192.168.81.68:4000");

    const fetchTasks = async () => {                                            //defining function and it's asynchromous 
        try {
            const response = await api.get('/');                                //sends get request to backend and waits for results and store it in response variable
            setTasks(response.data);                                            //set data list to tasks
        } catch (error) {                                                       
            Alert.alert("Error", error.message);                                //catch the error and show it in alert box on UI
        }
    };

    const addTask = async (title, description) => {                             //defines an asynchronous function

        if (title.trim() === '') {                                              //checks title input is empty
            Alert.alert("Validation Error", "Title must not be empty!");        //if input empty then show message in alert box
            return;
        }
        try {
            const response = await api.post('/', { title, description });       //sends post requests to backend and title, description on request body
            Alert.alert("Success!", "Data uploaded to MongoDB");                //alert box for response
            return response.data;                                               
        } 
        catch (error) {
            Alert.alert(error.message);
        }
    };

    const handleAddTask = async () => {
        await addTask(title.trim(), description.trim());                        //calling addTask function with arguments
        setTitle('');                                                           //set title empty
        setDescription('');                                                     //set description empty
        fetchTasks();                                                           //calling a function
    };

    //function for delete a specific data
    const deleteTask = async (id) => {                                          
        try {
            await api.delete(`/${id}`);                                         //sends delete requests with specific id
            Alert.alert("Success!", "Task deleted.");
            fetchTasks();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    //function for update data
    const updateTask = async () => {
        if (title.trim() === '') {                                                      //checks title input is empty
            Alert.alert("Validation Error", "Title must not be empty!");                
            return;
        }
    
        try {
            if (editId) {                                                               //checks editId valid or not
                await api.patch(`/${editId}`, { title, description });                  //sends patch request for specific id with arguments
                Alert.alert("Success!", "Task updated.");                               
                setEditId(null);                                                        //set editId empty
                setTitle('');                                                           //set title empty
                setDescription('');                                                     //set description empty
                fetchTasks();                                                           //calling a fuunction
            } else {
                Alert.alert("Error", "No task selected for update.");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };
        
    
    //function for insert data to title and description from db
    const handleEdit = (task) => {                                                      
        setTitle(task.title);                               //set title from item title
        setDescription(task.description);                   //set description from item description
        setEditId(task._id);                                //set id from item id
    };

    useEffect(() => {
        fetchTasks(); // initial fetch
    
        // Listen for backend DB changes
        socket.on("taskChanged", ( ) => {
            fetchTasks();                                       //fetch again updated list
        });
    
        // Clean up on unmount
        return () => {
            socket.off("taskChanged");
        };
    }, []);

    return(
        <View style = {styles.Container}>
            
            <ThemedText type="title" style = {styles.headingContainer}>Welcome to My first Mobile App</ThemedText>


            <View style = {{height: 20}}/>


            <Text style = {styles.titleContainer}>Title</Text>
            <TextInput
                placeholder="Enter title"
                value={title}
                onChangeText={setTitle}
                style = {styles.input}
            />


            <View style = {{height: 20}}/>


            <Text style = {styles.titleContainer}>Description</Text>
            <TextInput
                placeholder="Enter the description"
                value={description}
                onChangeText={setDescription}
                style = {styles.input}
            />
            <View style = {styles.threeButton}>
                <Pressable onPress={handleAddTask}>
                    <Text style = {styles.buttonContainer}>ADD</Text>
                </Pressable>

                <Pressable onPress={updateTask}> 
                    <Text style = {styles.crudPressable}>Update</Text>
                </Pressable>
            </View>    

            <View style = {{height: 30}}></View>


            <View style={styles.crudTable}>
            <ThemedText type ="subtitle" style={styles.headingContainer }>CRUD Operations</ThemedText>

                <View style={styles.modalViewContainer}>
                    <View style={styles.headItemContainer}>
                        <View style={styles.column}>
                            <Text style={styles.columnText}>Title</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.columnText}>Description</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.columnText}>CRUD</Text>
                        </View>
                    </View>


                    <FlatList
                        style={styles.scroll}
                        data={tasks}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (

                            <View style={styles.headItemContainer}>
                                <View style={styles.column}>
                                    <Text>{item.title}</Text>
                                </View>
                                <View style={styles.column}>
                                    <Text>{item.description}</Text>
                                </View>
                                <View style={styles.column}>
                                    <View style={styles.actionButtons}>
                                        <Pressable onPress={() => handleEdit(item)} style={styles.editButton}>
                                            <Text style={styles.buttonText}>Edit</Text>
                                        </Pressable>
                                        <Pressable onPress={() => deleteTask(item._id)} style={styles.deleteButton}>
                                            <Text style={styles.buttonText}>Delete</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </View>

            
                <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: 'white'

    },

    headingContainer: {
        color: 'dark',
        textAlign: 'center',
        paddingTop: 10
    },

    headText: {
        color: "ash",
        fontSize: 30,
        paddingTop: 10,
        textAlign: 'center'
    },

    modalContainer: {
        
    },

    modalViewContainer: {
        marginLeft: 10,
        marginTop: 20,
        marginRight: 10,
        width: 365,

    },

    titleContainer: {
        padding: 10,
        color: 'black',
        fontWeight: "bold"
        
    },

    threeButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        

    },

    crudPressable: {
         padding: 10,
         borderWidth: 1,
         color: 'white',
         backgroundColor: "#2196F3",
         borderRadius: 10,
         width: 100,
         textAlign: 'center',
         borderColor: 'white'
    },

    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 6,
        width: 365,
        marginLeft: 10,
        backgroundColor: 'white'

    },

    buttonContainer: {
         padding: 10,
         borderWidth: 1,
         
         color: 'white',
         backgroundColor: "#4CAF50",
         borderRadius: 10,
         width: 100,
        
         textAlign: 'center',
         borderColor: 'white'
    },

    scroll: {
        maxHeight: 270
    },

    headItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 10,
        borderWidth: 1,
        borderColor: '#cfcfcf',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 5,
        textAlign: 'justify'
    },

    actionButtons: {
       flexDirection: 'row',
        gap: 10,
        
    },
    editButton: {
        backgroundColor: 'orange',
        padding: 5,
        borderRadius: 3,
        
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 3,
    },

    buttonText: {
       color: 'white' 
    },

    crudTable: {
        borderWidth: 1,
        margin: 2,
        flex: 1,
        marginBottom: 2,
        borderColor: 'gray',
        borderRadius: 10
    },
    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnText: {
        fontWeight: 'bold',
    }
})