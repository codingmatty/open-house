import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'react-autobind';
import db from '../../helpers/db';
import { serializeForm } from '../../helpers/form';
import { launchIntoFullscreen, exitFullscreen } from '../../helpers/utils';
import './contacts-list.css';


export default class ContactsList extends Component {
  static propTypes = {
    onOpenNotes: PropTypes.func.isRequired
  }

  state = { error: '', locked: true, contacts: [], open: false }

  constructor(props) {
    super(props);
    autobind(this);
  }

  updateContacts() {
    return db.allDocs({ include_docs: true }).then((results) => {
      const contacts = results.rows.map(({ doc }) => doc);
      this.setState({
        contacts
      });
    });
  }

  handleToggle() {
    const { open } = this.state;

    if (open) {
      this.setState({ error: '', locked: true, open: false });
    } else {
      this.setState({ error: '', locked: true, open: true });
    }
  }

  handleUnlock(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const { password } = serializeForm(form);

    if (password === 'mypassword') {
      this.updateContacts().then(() => {
        this.setState({ error: '', locked: false });
      });
    } else {
      this.setState({ error: 'Incorrect Password' });
    }
  }

  handleFullScreen() {
    const { fullScreen } = this.state;

    if (fullScreen) {
      // Cancel fullscreen for browsers that support it!
      exitFullscreen();
    } else {
      // Launch fullscreen for browsers that support it!
      launchIntoFullscreen(document.documentElement); // the whole page
    }

    this.setState({ fullScreen: !fullScreen });
  }

  handleReset() {
    const { contacts } = this.state;
    // eslint-disable-next-line
    if (confirm('Are you sure you would like to clear the list of contacts that you have accumulated?!')) {
      Promise.all(contacts.map((contact) => db.remove(contact))).then(() => {
        this.setState({ open: false, contacts: [] });
      });
    }
  }

  handleExport() {
    const { contacts } = this.state;

    if (!contacts || contacts.length === 0) {
      alert('You have no contacts to export!');
      return;
    }

    let mailString = `mailto:${'hello@mattjdev.com'}`;
    mailString += `?subject=${'Open House Contact'}`;

    let mailBody = 'Here are the contacts that you gathered from your open house:\n';
    contacts.forEach((contact) => {
      mailBody += `\nName: ${contact.name}\nEmail: ${contact.email}`;
      if (contact.phone) {
        mailBody += `\nPhone: ${contact.phone}`;
      }
      if (contact['more-info']) {
        mailBody += `\nMore Info: ${contact['more-info']}`;
      }
      if (contact.notes) {
        mailBody += `\nNotes: ${contact.notes}`;
      }
      mailBody += '\n';
    });

    mailString += `&body=${encodeURIComponent(mailBody)}`;
    window.open(mailString, '_self');
  }

  render() {
    const { onOpenNotes } = this.props;
    const { error, locked, contacts, open } = this.state;

    let className = 'contacts-list';
    if (open) {
      className += ' open';
    }

    if (locked) {
      return (
        <div className={className}>
          <button className="toggle-visibility" onClick={this.handleToggle} />
          {open &&
            <form className="contacts-locked-form" autoComplete="off" onSubmit={this.handleUnlock}>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" autoFocus required />
                <div className="error">{error}</div>
              </div>
              <div className="button-group">
                <button type="button" onClick={this.handleToggle}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
            </form>
          }
        </div>
      );
    }

    return (
      <div className={className}>
        <button className="toggle-visibility" onClick={this.handleToggle} />
        <div className="button-group">
          {/*<button className="full-screen" onClick={this.handleFullScreen}>Full Screen</button>*/}
          <button className="reset" onClick={this.handleReset}>Reset</button>
          <button className="export" onClick={this.handleExport}>Export</button>
        </div>
        <div className="contacts-container">
          <ul className="contacts">
            {contacts.length === 0 &&
              <li>No Contacts to Display</li>
            }
            {contacts.map((contact) => (
              <li className="contact">
                <div className="contact-data">
                  <div className="contact-data-point">
                    <span>Name:</span>
                    <span className="value">{contact.name}</span>
                  </div>
                  <div className="contact-data-point">
                    <span>Email:</span>
                    <span className="value">{contact.email}</span>
                  </div>
                  <div className="contact-data-point">
                    <span>Number:</span>
                    <span className="value">{contact.number}</span>
                  </div>
                  <div className="contact-data-point">
                    <span>More Info:</span>
                    <span className="value">{contact['more-info']}</span>
                  </div>
                  {contact.notes &&
                    <div>
                      <div>Notes:</div>
                      <p>{contact.notes}</p>
                    </div>
                  }
                </div>
                <div className="contact-notes">
                  <button className="edit-notes" onClick={() => onOpenNotes(contact)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
