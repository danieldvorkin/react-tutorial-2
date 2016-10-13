// Parent Component: ProductCategoryRow <- ProductTable <- FilterableProductTable
var ProductItem = React.createClass({
  render: function(){
    return (
      <div className="product">
        {this.props.product.name}
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
        <h1>{this.props.category}</h1>
        {products.map((product) => {
          if(product.category == category && product.name.includes(this.props.query)){
            return <ProductItem product={product} key={product.id} />  
          }
        })}
      </div>
    )
  }
});

var AddProduct = React.createClass({
  render: function(){
    return (
      <form className="addProduct form-inline">
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Product Name" />
          <input type="text" className="form-control" placeholder="Product Category" />
          <input type="checkbox" /> In Stock?
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
        <AddProduct /><br/>
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
  render: function(){
    return (
      <div className="navBar">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <NavBarBrand/>       
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <NavBarForm onClick={this.searchSubmit} onCheckbox={this.showInStock} checked={this.props.checked} />
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
  render: function(){
    return (
      <div className="filterableProductTable">
        <NavBar onClick={this.searchSubmit} onCheckboxClick={this.showInStock} checked={this.state.checked} />
        <ProductTable products={this.state.data} checked={this.state.checked} query={this.state.query} />
      </div>
    )
  }
});

ReactDOM.render(
  <FilterableProductTable url="/api/data" poll={2000} />,
  document.getElementById('content')
)