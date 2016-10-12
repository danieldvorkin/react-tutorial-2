var ProductCategoryRow = React.createClass({
  render: function(){
    return (
      <div className="productCategoryRow">
        {{this.props.category}}
      </div>
    )
  }
});

var ProductTable = React.createClass({
  render: function(){
    var categories = this.props.products.map(function(product){
      return (
        <ProductCategoryRow category={product.category}/>
      )
    });
    return (
      <div className="productTable">
       {categories}
      </div>
    )
  }
});

var NavBarForm = React.createClass({
  getInitialState: function(){
    return { query: '' };
  },
  handleQueryChange: function(e){
    this.setState({query: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();

    this.props.onClick({query: this.state.query.toString()})
    this.setState({query: ''})
  },
  render: function(){
    return (
      <form className="navBarForm navbar-form navbar-left" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control search-bar" placeholder="Search" value={this.state.query} onChange={this.handleQueryChange}/>
        </div>
        <button type="submit" className="btn btn-default submit-btn">Submit</button>
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
  searchSubmit: function(){
    this.props.onClick();
  },
  render: function(){
    return (
      <div className="navBar">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <NavBarBrand/>       
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <NavBarForm onClick={this.searchSubmit}/>
            </div>
          </div>
        </nav>
      </div>
    )
  }
});

var FilterableProductTable = React.createClass({
  searchSubmit: function(){
    console.log("Oh Shiiiitt")
  },
  render: function(){
    return (
      <div className="filterableProductTable">
        <NavBar onClick={this.searchSubmit}/>
        <ProductTable products={this.props.products}/>
      </div>
    )
  }
});

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS}/>,
  document.getElementById('content')
)