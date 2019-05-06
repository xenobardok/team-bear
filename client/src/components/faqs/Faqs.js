import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq
} from "../../actions/faqsActions";
import "./faqs.css";
import Spinner from "../../common/Spinner";
import isEmpty from "../../validation/isEmpty";
import AccordionItem from "./AccordionItem";

class Faqs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNew: false
    };
  }
  componentDidMount() {
    this.props.getFaqs();
  }

  cancelAddNew = () => {
    this.setState({
      addNew: false
    });
  };
  render() {
    let { loading, allFaqs } = this.props.faqs;
    let faqList,
      addNewButton = null;
    if (loading) {
      faqList = <Spinner />;
    } else if (isEmpty(allFaqs)) {
      faqList = <p>There are no faqs yet!</p>;
    } else {
      faqList = allFaqs.map(faq => (
        <li {...{ className: "accordion-list__item" }}>
          <AccordionItem
            {...faq}
            updateFaq={this.props.updateFaq}
            deleteFaq={this.props.deleteFaq}
            isSuperUser={this.props.auth.user.isSuperUser}
          />
        </li>
      ));
    }

    if (this.props.auth.user.isSuperUser === "true") {
      addNewButton = (
        <li
          className="accordion-list__item create-new-faq"
          onClick={() => this.setState({ addNew: true })}
        >
          <h5>Create New FAQ</h5>
        </li>
      );
    }

    return (
      <div>
        <h3 className="text-center">Popular FAQs</h3>
        <br />
        <div {...{ className: "wrapper" }}>
          <ul {...{ className: "accordion-list" }}>
            {this.state.addNew ? (
              <li {...{ className: "accordion-list__item" }}>
                <AccordionItem
                  opened={true}
                  edit={true}
                  create={true}
                  cancelAddNew={this.cancelAddNew}
                  createFaq={this.props.createFaq}
                />
              </li>
            ) : (
              addNewButton
            )}

            {faqList}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  faqs: state.faqs
});

export default connect(
  mapStateToProps,
  { getFaqs, createFaq, updateFaq, deleteFaq }
)(Faqs);
