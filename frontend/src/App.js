import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import axios from 'axios';
import Modal from './components/Modal';

// const todoItems = [
//   {
//     id: 1,
//     title: "Byteboard Assessment",
//     description: "2 hour, 2 part exam",
//     completed: false,
//   },
//   {
//     id: 2,
//     title: "Tutorial Apps",
//     description: "use tutorials as a springboard for making new apps",
//     completed: false,
//   },
//   {
//     id: 3,
//     title: "Leetcode",
//     description: "practice Leetcode problems",
//     completed: false,
//   },
//   {
//     id: 4,
//     title: "Cracking the Coding Interview",
//     description: "study solutions",
//     completed: false,
//   },
//   {
//     id: 5,
//     title: "Python Tutorial",
//     description: "improving Python skills",
//     completed: false,
//   },
// ];
// create *class* component for App
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios.get('/api/todos/').then((res) => this.setState({ todoList: res.data })).catch((err) => console.log(err))
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
// alert fires here? Something wrong with editItem?
  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      axios.put(`/api/todos/${item.id}/`, item).then((res) => this.refreshList());
      return;
    }
    axios.post(`/api/todos/`, item).then((res) => this.refreshList());
    // alert("save" + JSON.stringify(item));
  };

  handleDelete = (item) => {
    // alert("delete" + JSON.stringify(item));
    axios.delete(`/api/todos/${item.id}/`, item).then((res) => this.refreshList())
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  }

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span className={this.state.viewCompleted ? "nav-link active" : "nav-link"} onClick={() => this.displayCompleted(true)}>Complete</span>
        <span className={this.state.viewCompleted ? "nav-link" : "nav-link active"} onClick={() => this.displayCompleted(false)}>Incomplete</span>
      </div>
    )
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter((item) => item.completed === viewCompleted);

    return newItems.map((item) => (
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title={item.description}>{item.title}</span>
        <span>
          <button className="btn btn-secondary mr-2" onClick={() => this.editItem(item)}>Edit</button>
          <button className="btn btn-danger" onClick={() => this.handleDelete(item)}>Delete</button>
        </span>
      </li>
    ));
  };

  render() {
    return(
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-dm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-primary" onClick={this.createItem}>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
      </main>
    )
  }
}

export default App;
