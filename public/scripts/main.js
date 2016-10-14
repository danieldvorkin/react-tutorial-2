var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

var AddProductModal = React.createClass({
  getInitialState() {
    return { showModal: false };
  },
  close() {
    this.setState({ showModal: false });
  },
  open() {
    this.setState({ showModal: true });
  },
  addProduct: function(data){
    this.props.addProduct(data)
    this.close();
  },
  render() {
    return (
      <div>
        <Button bsStyle="default" bsSize="small" onClick={this.open}> Add New Product </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddProductForm addProduct={this.addProduct}/>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});

var EditProduct = React.createClass({
  getInitialState: function(){
    return ({ name: this.props.product.name })
  },
  handleChange: function(e){
    this.setState({ name: e.target.value })
  },
  editProduct: function(){
    this.props.editProduct({name: this.state.name, display: "inline-flex", id: this.props.product.id })
  },
  render: function(){
    return (
      <div className="editProduct">
        <input type="text" value={this.state.name} key={this.props.product.id} className="edit-form" onChange={this.handleChange} />
        <input type="submit" onClick={this.editProduct} />
      </div>
    )
  }
});
var ProductItem = React.createClass({
  getInitialState: function(){
    return { editProduct: false, display: 'inline-flex', name: this.props.product.name }
  },
  handleEditReq: function(){
    this.setState({ editProduct: true, display: 'none'})
  },
  handleDeleteReq: function(e){
    this.props.handleDelete({id: e.target.id})
  },
  sendEditReq: function(obj){
    this.setState({ display: obj.display, editProduct: false, name: obj.name })
    this.props.editProduct({ id: obj.id, name: obj.name })
  },
  render: function(){
    var visibility = { display: this.state.display }
    return (
      <div className="productItem">
        <div className="col-lg-4">
          {!this.state.editProduct ? this.state.name + " - ": null}
          { this.state.editProduct ? <EditProduct product={this.props.product} editProduct={this.sendEditReq}/> : null }
          <a href="#" onClick={this.handleEditReq} id={this.props.product.id} style={visibility}>EDIT </a>
          <a href="#" onClick={this.handleDeleteReq} id={this.props.product.id} style={visibility}>&nbsp;DELETE</a>
        </div>
      </div>
    )
  }
});
var ProductCategoryRow = React.createClass({
  deleteRequest: function(id){
    this.props.handleDelete(id)
  },
  editProduct: function(obj){
    this.props.editProduct(obj)
  },
  render: function(){
    var products = this.props.products
    if(this.props.checked){
      products = products.filter(function(value){
        return value.stocked
      });
    }
    var category = this.props.category
    return (
      <div className="productCategoryRow">
        <h1>{category}</h1>
        <div className="row">
          {products.map((product) => {
            if(product.category == category && product.name.toLowerCase().includes(this.props.query.toLowerCase())){
              return <ProductItem product={product} key={product.id} handleDelete={this.deleteRequest} editProduct={this.editProduct} />  
            }
          })}
        </div>
      </div>
    )
  }
});
var AddProductForm = React.createClass({
  getInitialState: function(){
    return { name: '', category: '', stock: ''};
  },
  handleNameChange: function(e){
    this.setState({name: e.target.value});
  },
  handleCategoryChange: function(e) {
    this.setState({category: e.target.value});
  },
  handleStockChange: function(e){
    debugger;
    this.setState({stock: e.target.checked})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var category = this.state.category.trim();
    var stock = this.state.stock;

    if(!name || !category) {
      return;
    }
    if(!stock){
      stock = false;
    }

    this.props.addProduct({name: name, category: category, stock: stock});
    this.setState({name: '', category: '', stock: ''})
  },
  render: function(){
    return (
      <form className="addProduct" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Product Name" onChange={this.handleNameChange} value={this.state.name} />
          <br/>
          <input type="text" className="form-control" placeholder="Product Category" onChange={this.handleCategoryChange} value={this.state.category} />
          <br/>
          <input type="checkbox" onChange={this.handleStockChange} checked={this.state.stock} /> In Stock?
        </div>
        <input type="submit" className="btn btn-default" />
      </form>
    )
  }
})
var ProductTable = React.createClass({
  handleDelete: function(id){
    this.props.deleteProduct(id)
  },
  editProduct: function(obj){
    this.props.editProduct(obj);
  },
  render: function(){
    var categories = this.props.products.map((product) =>
      product.category
    ).reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

    return (
      <div className="productTable">
        {categories.map((category, index) =>
          <ProductCategoryRow 
            category={category} 
            key={index} 
            products={this.props.products} 
            checked={this.props.checked} 
            query={this.props.query} 
            handleDelete={this.handleDelete} 
            editProduct={this.editProduct} 
          />
        )}
      </div>
    )
  }
});
var NavBarForm = React.createClass({
  getInitialState: function(){
    return { query: '', checked: false };
  },
  handleQueryChange: function(e){
    this.setState({query: e.target.value}, function(){ this.props.onClick(this.state.query) });
  },
  toggleCheckboxChange: function(){
    this.props.onCheckbox()
  },
  render: function(){
    return (
      <form className="navBarForm navbar-form navbar-left">
        <div className="form-group">
          <input type="text" className="form-control search-bar" placeholder="Search" onChange={this.handleQueryChange} />
        </div>
        <input type="checkbox" id="inStock" checked={this.props.checked} onChange={this.toggleCheckboxChange} /> Show in stock only
      </form>
    )
  }
});
var NavBarBrand = React.createClass({
  render: function(){
    return (
      <div className="navBarBrand navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" href="#">Locker Search</a>
      </div>
    )
  }
});
var NavBar = React.createClass({
  searchSubmit: function(query){
    this.props.onClick(query);
  },
  showInStock: function(){
    this.props.onCheckboxClick();
  },
  handleSubmit: function(data){
    this.props.addProduct(data);
  },
  render: function(){
    return (
      <div className="navBar">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <NavBarBrand/>       
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <NavBarForm onClick={this.searchSubmit} onCheckbox={this.showInStock} checked={this.props.checked} />
              <AddProductModal addProduct={this.handleSubmit} />
            </div>
          </div>
        </nav>
      </div>
    )
  }
});
var FilterableProductTable = React.createClass({
  loadData: function(){
    $.ajax ({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err){
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return {data: [], query: '', checked: false};
  },
  componentDidMount: function(){
    this.loadData();
    setInterval(this.loadData, this.props.poll);
  },
  searchSubmit: function(query){
    this.setState({ query: query });
  },
  showInStock: function(){
    this.setState({ checked: !this.state.checked });
  },
  addProduct: function(newProduct){
    var products = this.state.data;
    newProduct.id = this.state.data.length + 1;
    var newData = products.concat([newProduct])
    this.setState({data: newData});

    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: newProduct,
      success: function(data){
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err){
        console.log(xhr, status, err.toString());
      }.bind(this)
    });
  },
  deleteProduct: function(product){
    $.ajax({
      url: this.props.url + "/" + product.id,
      type: 'DELETE',
      data: product,
      success: function(data){
        this.componentDidMount()
      }.bind(this),
      error: function(xhr, status, err){
        console.log(xhr, status, err.toString())
      }.bind(this)
    });
  },
  editProduct: function(product){
    var position = this.state.data.map(function(x) {return x.id; }).indexOf(product.id);
    this.state.data[position].name = product.name
    var data = this.state.data[position]

    $.ajax({
      url: this.props.url + "/" + product.id,
      type: 'PATCH',
      data: data,
      success: function(data){
        console.log(data)
        this.componentDidMount()
      }.bind(this),
      error: function(xhr, status, err){
        console.log(xhr, status, err.toString());
      }.bind(this)
    })
  },
  render: function(){
    return (
      <div className="filterableProductTable">
        <NavBar onClick={this.searchSubmit} onCheckboxClick={this.showInStock} checked={this.state.checked} addProduct={this.addProduct}/>
        <ProductTable products={this.state.data} checked={this.state.checked} query={this.state.query} deleteProduct={this.deleteProduct} editProduct={this.editProduct} />
      </div>
    )
  }
});

ReactDOM.render(
  <FilterableProductTable url="/data" poll={2000} />,
  document.getElementById('content')
)