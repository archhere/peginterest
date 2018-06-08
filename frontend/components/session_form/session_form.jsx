import React from 'react';
import { withRouter } from 'react-router-dom';
import { login } from '../../actions/session_actions';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.demoLogin = this.demoLogin.bind(this);
  }


  update(field) {
    return e => this.setState({
      [field]: e.target.value
    });
    
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.processForm(user).then(()=>this.props.history.push('/'));

    }

  demoLogin(e){
    e.preventDefault();
      let password = "password";
      const newdemo = () => {
        setTimeout(() => {
          if (password.length>0){
            this.setState({
                email:"frodo@shire.com",
                password: this.state.password.concat(password[0])
            });
            password = password.slice(1);
            newdemo();
          }
          else{
            dispatch(login(this.state))
            .then(()=>this.props.history.push('/'));
          }
        }, 100);

      };
      newdemo();

}

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    let placeholder_val;
    if (this.props.formType === 'signup') placeholder_val = "Create a password"
    else placeholder_val = "Password"
    return (
      <div className="login-form-container">
        <form onSubmit={this.handleSubmit} className="login-form-box">
          <img src={window.logo} className="logo"/>
          <p> Welcome to Peginterest <br/>
          <span>Explore new ideas</span></p>

          <div className="login-form">

              <input type="text"
                value={this.state.email}
                onChange={this.update('email')}
                className="login-input"
                placeholder="Email"
              />
            <br/>
              <input type="password"
                value={this.state.password}
                onChange={this.update('password')}
                className="login-input"
                placeholder={placeholder_val}
              />
            <br/>
            <input className="session-submit" type="submit" value="Continue" />
            <br/>
          </div>
           <input className="demo-submit" onClick={(e)=>this.demoLogin(e)} type="submit" value="Demo"/>
           <br/>
         <div className='fromtype-button'>{this.props.navLink}</div>
        </form>
        <div className="errors">{this.renderErrors()}</div>
      </div>
    );
  }
}

export default withRouter(SessionForm);
