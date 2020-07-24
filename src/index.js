// React
import React from 'react';
import ReactDOM from 'react-dom';
// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
// Packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const endpoint = 'https://localhost:5001/api/';
const productRoute = 'product/';
const brandRoute = 'brand/';

// Components

function Title() {
    return (
        <div>
            <div className="row">
                <div className="col"></div>
                <div className="col-10 app-title">
                    <h2>Learning React</h2>
                </div>
                <div className="col"></div>
            </div>
            <hr />
        </div>
    )
}

// Main

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: [],
            data: [],
            modalOpen: false,
            deleteWarning: false,
            itsCreateModal: true,
            form: {
                id: undefined,
                name: '',
                cost: undefined,
                price: undefined,
                brandid: undefined
            }
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getData();
        this.getBrands();
    }

    async handleChange(event) {
        await this.setState({
            form: {
                ...this.state.form,
                [event.target.name]: event.target.value
            }
        });
    }

    modifyProduct(product) {
        this.selectProduct(product);
        this.toggleModal();
    }

    deleteProduct(product) {
        this.selectProduct(product);
        this.toggleDeleteWarning();
    }

    selectProduct(product) {
        this.setState({
            itsCreateModal: false,
            form: {
                id: product.id,
                name: product.name,
                cost: product.cost,
                price: product.price,
                brandid: product.brand.id
            }
        });
    }

    toggleModal() {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    }

    toggleDeleteWarning() {
        this.setState({
            deleteWarning: !this.state.deleteWarning
        })
    }

    openCreateModal() {
        this.setState({
            itsCreateModal: true
        })
        this.toggleModal();
    }

    // Data functions
    getData() {
        fetch(endpoint + productRoute)
            .then(res => res.json())
            .then(responseData => this.setState({
                data: responseData
            }));
    }

    postData() {
        this.toggleModal();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'name': this.state.form.name,
                'cost': parseFloat(this.state.form.cost),
                'price': parseFloat(this.state.form.price),
                'brandid': parseFloat(this.state.form.brandid),
            })
        }

        fetch(endpoint + productRoute, requestOptions).then(() => {
            this.getData();
            toast.success('✅ ¡Producto añadido con éxito!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
    }

    putData() {
        this.toggleModal();
        const id = this.state.form.id;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'name': this.state.form.name,
                'cost': parseFloat(this.state.form.cost),
                'price': parseFloat(this.state.form.price),
                'brandid': parseFloat(this.state.form.brandid),
            })
        }

        fetch(endpoint + productRoute + id, requestOptions).then(() => {
            this.getData();
            toast.info('🔁 ¡Producto modificado con éxito!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
    }

    deleteData() {
        this.toggleDeleteWarning();
        const id = this.state.form.id;
        const requestOptions = {
            method: 'DELETE'
        }

        fetch(endpoint + productRoute + id, requestOptions).then(() => {
            this.getData();
            toast.error('❌ Producto eliminado', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
    }

    getBrands() {
        fetch(endpoint + brandRoute)
            .then(res => res.json())
            .then(responseData => this.setState({
                brands: responseData
            }));
    }

    render() {
        return (

            <div className="app">
                <div className="container">
                    <Title />
                    <div className="row">
                        <div className="col"></div>
                        <div className="col-6 app-add-bar">
                            <button className="btn btn-success w-100" onClick={() => this.openCreateModal()}>Agregar producto</button>
                        </div>
                        <div className="col"></div>
                    </div>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Costo</th>
                                <th>Precio</th>
                                <th>Marca</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data.map(prod => {
                                    return (
                                        <tr key={prod.id.toString()}>
                                            <td>{prod.id}</td>
                                            <td>{prod.name}</td>
                                            <td>{prod.cost}</td>
                                            <td>{prod.price}</td>
                                            <td>{prod.brand.name}</td>
                                            <td>
                                                <div className="btn-group">
                                                    <button className="btn btn-info" onClick={() => this.modifyProduct(prod)}><FontAwesomeIcon icon={faEdit} /></button>
                                                    <button className="btn btn-danger" onClick={() => this.deleteProduct(prod)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={this.state.modalOpen} className="app-modal-dark">
                    <ModalHeader>
                        {
                            this.state.itsCreateModal
                                ?
                                <div className="app-modal-title">Agregar producto</div>
                                :
                                <div className="app-modal-title">Modificar producto</div>
                        }
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={this.state.itsCreateModal ? undefined : this.state.form.id} />
                            <br />

                            <label htmlFor="name">Nombre</label>
                            <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={this.state.itsCreateModal ? undefined : this.state.form.name} />
                            <br />

                            <label htmlFor="cost">Costo</label>
                            <input className="form-control" type="number" name="cost" id="cost" onChange={this.handleChange} value={this.state.itsCreateModal ? undefined : this.state.form.cost} />
                            <br />

                            <label htmlFor="price">Precio</label>
                            <input className="form-control" type="number" name="price" id="price" onChange={this.handleChange} value={this.state.itsCreateModal ? undefined : this.state.form.price} />
                            <br />

                            <label htmlFor="brandid">Marca</label>
                            <select className="form-control" name="brandid" id="brandid" onChange={this.handleChange} value={this.state.itsCreateModal ? undefined : this.state.form.brandid}>
                                {
                                    this.state.brands.map(brand => {
                                        return (
                                            <option key={brand.id.toString()} value={brand.id}>{brand.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.itsCreateModal
                                ?
                                <button className="btn btn-success" onClick={() => this.postData()}>Agregar</button>
                                :
                                <button className="btn btn-primary" onClick={() => this.putData()}>Modificar</button>
                        }
                        <button className="btn btn-secondary" onClick={() => this.toggleModal()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.deleteWarning} className="app-modal-dark">
                    <ModalBody className="ta-c">
                        ¿Estás seguro que querés eliminar el producto {this.state.form.name ? this.state.form.name : ''}?
                    </ModalBody>
                    <ModalFooter>
                        <div className="btn-group w-100">
                            <button className="btn btn-danger" onClick={() => this.deleteData()}>Si</button>
                            <button className="btn btn-secondary" onClick={() => this.toggleDeleteWarning()}>No</button>
                        </div>
                    </ModalFooter>
                </Modal>

                <ToastContainer />

            </div>

        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <Main />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));