// Parent Component: ProductCategoryRow <- ProductTable <- FilterableProductTable
var ProductItem = React.createClass({
  render: function(){
    return (
      <div className="productItem">
        <div className="col-lg-4">
          {this.props.product.name}
        </div>
      </div>
    )
  }
});

// Parent Component: ProductTable <- FilterableProductTable
var ProductCategoryRow = React.createClass({
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
            if(product.category == category && product.name.includes(this.props.query)){
              return <ProductItem product={product} key={product.id} />  
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
      <form className="addProduct navbar-form navbar-right" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Product Name" onChange={this.handleNameChange} value={this.state.name} />
          <input type="text" className="form-control" placeholder="Product Category" onChange={this.handleCategoryChange} value={this.state.category} />
          <input type="checkbox" onChange={this.handleStockChange} checked={this.state.stock} /> In Stock?
        </div>
        <input type="submit" className="btn btn-default" />
      </form>
    )
  }
})

// Parent Component: FilterableProductTable
var ProductTable = React.createClass({
  render: function(){
    var categories = this.props.products.map((product) =>
      product.category
    ).reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

    return (
      <div className="productTable">
        {categories.map((category, index) =>
          <ProductCategoryRow category={category} key={index} products={this.props.products} checked={this.props.checked} query={this.props.query} />
        )}
      </div>
    )
  }
});

// Parent Component: Navbar <- FilterableProductTable
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

// Parent Component: Navbar <- FilterableProductTable
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

// Parent Component: FilterableProductTable
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
              <AddProductForm addProduct={this.handleSubmit}/><br/>
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
    })
  },
  render: function(){
    return (
      <div className="filterableProductTable">
        <NavBar onClick={this.searchSubmit} onCheckboxClick={this.showInStock} checked={this.state.checked} addProduct={this.addProduct}/>
        <ProductTable products={this.state.data} checked={this.state.checked} query={this.state.query} />
      </div>
    )
  }
});

ReactDOM.render(
  <FilterableProductTable url="/data" poll={2000} />,
  document.getElementById('content')
)