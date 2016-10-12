var NavBarForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    console.log(this);
    this.props.onClick()
  },
  render: function(){
    return (
      <form className="navBarForm navbar-form navbar-left" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control search-bar" placeholder="Search" />
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
    console.log("Search Query: ");
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

ReactDOM.render(
  <NavBar />,
  document.getElementById('navbar')
)