import React, { Component } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { variables } from './Variables.js';

export class Employee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            departments: [],
            employees: [],
            modalTitle: "",
            EmployeeId: 0,
            EmployeeName: "",
            Department: "",
            DateOfJoining: "",
            PhotoFileName: "anonymous.png",
            PhotoPath: variables.PHOTO_URL,
            addModalShow: false
        };
    }

    refreshList() {
        fetch(variables.API_URL + 'employee')
            .then(response => response.json())
            .then(data => {
                this.setState({ employees: data });
            });

        fetch(variables.API_URL + 'department')
            .then(response => response.json())
            .then(data => {
                this.setState({ departments: data });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    changeEmployeeName = (e) => {
        this.setState({ EmployeeName: e.target.value });
    }

    changeDepartment = (e) => {
        this.setState({ Department: e.target.value });
    }

    changeDateOfJoining = (e) => {
        this.setState({ DateOfJoining: e.target.value });
    }

    addClick = () => {
        this.setState({
            modalTitle: "Add Employee",
            EmployeeId: 0,
            EmployeeName: "",
            Department: "",
            DateOfJoining: "",
            PhotoFileName: "anonymous.png",
            addModalShow: true
        });
    }

    editClick = (emp) => {
        this.setState({
            modalTitle: "Edit Employee",
            EmployeeId: emp.EmployeeId,
            EmployeeName: emp.EmployeeName,
            Department: emp.Department,
            DateOfJoining: emp.DateOfJoining,
            PhotoFileName: emp.PhotoFileName,
            addModalShow: true
        });
    }

    createClick = () => {
        fetch(variables.API_URL + 'employee', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeName: this.state.EmployeeName,
                Department: this.state.Department,
                DateOfJoining: this.state.DateOfJoining,
                PhotoFileName: this.state.PhotoFileName
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            });
        
        this.setState({ addModalShow: false });
    }

    updateClick = () => {
        fetch(variables.API_URL + 'employee', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeId: this.state.EmployeeId,
                EmployeeName: this.state.EmployeeName,
                Department: this.state.Department,
                DateOfJoining: this.state.DateOfJoining,
                PhotoFileName: this.state.PhotoFileName
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.refreshList();
            }, (error) => {
                alert('Failed');
            });

        this.setState({ addModalShow: false });
    }

    deleteClick = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.API_URL + 'employee/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then((result) => {
                    alert(result);
                    this.refreshList();
                }, (error) => {
                    alert('Failed');
                });
        }
    }

    imageUpload = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);

        fetch(variables.API_URL + 'employee/savefile', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ PhotoFileName: data });
            });
    }

    render() {
        const {
            departments,
            employees,
            modalTitle,
            EmployeeId,
            EmployeeName,
            Department,
            DateOfJoining,
            PhotoPath,
            PhotoFileName,
            addModalShow
        } = this.state;

        return (
            <div>
                <Button
                    variant="primary"
                    className="m-2 float-end"
                    onClick={() => this.addClick()}
                >
                    Add Employee
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>EmployeeId</th>
                            <th>EmployeeName</th>
                            <th>Department</th>
                            <th>DOJ</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp =>
                            <tr key={emp.EmployeeId}>
                                <td>{emp.EmployeeId}</td>
                                <td>{emp.EmployeeName}</td>
                                <td>{emp.Department}</td>
                                <td>{emp.DateOfJoining}</td>
                                <td>
                                    <Button
                                        variant="light"
                                        className="mr-1"
                                        onClick={() => this.editClick(emp)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="light"
                                        onClick={() => this.deleteClick(emp.EmployeeId)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Modal
                    show={addModalShow}
                    onHide={() => this.setState({ addModalShow: false })}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="EmployeeName">
                                <Form.Label>Employee Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={EmployeeName}
                                    onChange={this.changeEmployeeName}
                                />
                            </Form.Group>

                            <Form.Group controlId="Department">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={Department}
                                    onChange={this.changeDepartment}
                                >
                                    {departments.map(dep => (
                                        <option key={dep.DepartmentId} value={dep.DepartmentName}>
                                            {dep.DepartmentName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="DateOfJoining">
                                <Form.Label>Date of Joining</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={DateOfJoining}
                                    onChange={this.changeDateOfJoining}
                                />
                            </Form.Group>

                            <Form.Group controlId="Photo">
                                <Form.Label>Photo</Form.Label>
                                <Form.Control type="file" onChange={this.imageUpload} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {EmployeeId === 0 ?
                            <Button variant="primary" onClick={() => this.createClick()}>Create</Button>
                            : null}
                        {EmployeeId !== 0 ?
                            <Button variant="primary" onClick={() => this.updateClick()}>Update</Button>
                            : null}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
