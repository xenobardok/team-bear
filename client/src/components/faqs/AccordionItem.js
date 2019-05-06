import React, { Component } from "react";
import {
  OverlayTrigger,
  Tooltip,
  Form,
  ButtonGroup,
  Button
} from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";
library.add(faPlus, faEdit);
class AccordionItem extends Component {
  state = {
    opened: this.props.opened,
    edit: this.props.edit,
    Question: this.props.Question,
    Answer: this.props.Answer
  };

  editHandler = () => {
    this.setState({ edit: !this.state.edit, opened: !this.state.opened });
  };

  cancelHandler = () => {
    this.setState({
      Question: this.props.Question,
      Answer: this.props.Answer,
      edit: false
    });
  };

  createNewFaq = () => {
    if (this.state.Question && this.state.Answer) {
      this.props.createFaq(this.state.Question, this.state.Answer);
      this.setState({
        Answer: "",
        Question: ""
      });
      this.props.cancelAddNew();
    } else {
      toastr.error("Error", "Question or Answer cannot be empty!");
    }
  };

  updateFaq = () => {
    if (this.state.Question && this.state.Answer) {
      this.props.updateFaq(
        this.props.FAQ_ID,
        this.state.Question,
        this.state.Answer
      );
      this.setState({
        edit: false
      });
    } else {
      toastr.error("Error", "Question or Answer cannot be empty!");
    }
  };

  deleteButtonHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.props.deleteFaq(this.props.FAQ_ID);
        this.editHandler();
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  render() {
    const { Question, Answer, edit } = this.state;
    const { opened } = this.state;
    return (
      <div
        {...{
          className: `accordion-item, ${opened && "accordion-item--opened"}`
        }}
      >
        <div {...{ className: "accordion-item__line" }}>
          <div className="accordion-item__title">
            {this.state.edit ? (
              <Form.Control
                type="text"
                placeholder="Question"
                value={Question}
                onChange={e => this.setState({ Question: e.target.value })}
              />
            ) : (
              <h5
                onClick={() => {
                  this.setState({ opened: !opened });
                }}
              >
                {Question}
              </h5>
            )}
          </div>
          {edit ? null : (
            <>
              {this.props.isSuperUser === "true" ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Edit</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon="edit"
                    className="edit"
                    onClick={() =>
                      this.setState({ edit: !this.state.edit, opened: true })
                    }
                  />
                </OverlayTrigger>
              ) : null}
            </>
          )}

          <span {...{ className: "accordion-item__icon" }} />
        </div>
        <div {...{ className: "accordion-item__inner" }}>
          <div {...{ className: "accordion-item__content" }}>
            {this.state.edit ? (
              <Form className="text-center">
                <Form.Control
                  as="textarea"
                  rows="2"
                  placeholder="Answer"
                  value={Answer}
                  onChange={e => this.setState({ Answer: e.target.value })}
                />
                <ButtonGroup size="md" className="mt-3 mb-1">
                  {this.props.create ? (
                    <Button variant="primary" onClick={this.createNewFaq}>
                      Create
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={this.updateFaq}>
                      Update
                    </Button>
                  )}
                  {this.props.create ? (
                    <Button
                      variant="secondary"
                      onClick={this.props.cancelAddNew}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={this.cancelHandler}>
                      Cancel
                    </Button>
                  )}
                  {this.props.create ? null : (
                    <Button
                      variant="outline-danger"
                      onClick={this.deleteButtonHandler}
                    >
                      Delete
                    </Button>
                  )}
                </ButtonGroup>
              </Form>
            ) : (
              <p {...{ className: "accordion-item__paragraph" }}>{Answer}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AccordionItem;
