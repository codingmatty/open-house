import React, { Component } from 'react';
import autobind from 'react-autobind';
import db from './helpers/db';
import { serializeForm, resetForm } from './helpers/form';
import { getRandomId } from './helpers/utils';
import ContactsList from './components/contacts-list';
import Toast from './components/toast';
import './app.css';


class App extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const contact = serializeForm(form);

    db.put({
      _id: getRandomId(),
      ...contact
    }).then(() => {
      resetForm(form, { 'more-info': 'no' });
      this.contactsList.updateContacts();
      this.setState({ success: true }, () => {
        setTimeout(() => {
          this.setState({ success: false });
        }, 1500);
      })
    });
  }

  handleNotesSubmit(e) {
    e.preventDefault();
    const { editNotes } = this.state || {};

    const form = e.currentTarget;

    const { notes } = serializeForm(form);

    db.put({
      ...editNotes,
      notes
    }).then(() => {
      this.setState({ editNotes: null });
      this.contactsList.updateContacts();
    });
  }

  render() {
    const { success, editNotes } = this.state || {};

    return (
      <div className="app" ref={(r) => { this.app = r; }}>
        <div className="logo">
          <img src="./logo.png" alt="Logo" />
        </div>
        <ContactsList ref={(r) => { this.contactsList = r; }} onOpenNotes={(contact) => this.setState({ editNotes: contact })} />
        <div className="image-container" />
        <div className="form-container">
          { editNotes
            ? <form className="form notes" autoComplete="off" onSubmit={this.handleNotesSubmit}>
              <h1>Notes</h1>
              <div className="input-group">
                <label htmlFor="notes">Notes:</label>
                <textarea id="notes" rows="10" autoFocus defaultValue={editNotes.notes} />
              </div>
              <div className="button-group">
                <button type="button" onClick={() => this.setState({ editNotes: null })}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
            </form>
            : <form className="form sign-in" ref={(r) => { this.form = r; } } autoComplete="off" onSubmit={this.handleSubmit}>
              <h1>Sign In</h1>
              <div className="input-group">
                <label htmlFor="name">Name:</label>
                <input id="name" type="text" autoFocus required />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input id="email" type="email" required />
              </div>
              <div className="input-group">
                <label htmlFor="number">Phone Number:</label>
                <input id="number" type="text" />
              </div>
              <div className="input-group">
                <label >Would you like information on similar homes in the area?</label>
                <label className="styled-radio-button">
                  <input name="more-info" type="radio" value="yes" />
                  <span className="styled" />
                  Yes
                </label>
                <label className="styled-radio-button">
                  <input name="more-info" type="radio" value="no" defaultChecked />
                  <span className="styled" />
                  No
                </label>
              </div>
              <div className="button-group">
                <button type="button" onClick={() => resetForm(this.form, { 'more-info': 'no' })}>Reset</button>
                <button type="submit">Submit</button>
              </div>
            </form>
          }
        </div>
        <Toast open={success} message="Success!" />
      </div>
    );
  }
}

export default App;
