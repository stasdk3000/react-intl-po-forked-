import { defineMessages } from "react-intl";

const strings = defineMessages({
  todoListTitle: {
    id: "todoListTitle",
    defaultMessage: "Todo List"
  },
  todoListTabNameAllTasks: {
    id: "todoListTabNameAllTasks",
    defaultMessage: "All Tasks"
  },
  todoListTabNameCompleted: {
    id: "todoListTabNameCompleted",
    defaultMessage: "Completed"
  },
  todoListTabNameActive: {
    id: "todoListTabNameActive",
    defaultMessage: "Active"
  },
  addButton: {
    id: "addButton",
    defaultMessage: "Add"
  },
  inputBoxPlaceholder: {
    id: "inputBoxPlaceholder",
    defaultMessage: "Add a task..."
  },
  fetchingTasksLabel: {
    id: "fetchingTasksLabel",
    defaultMessage: "Fetching your tasks..."
  },
  todoItemAriaLabelCheckedState: {
    id: "todoItemAriaLabelCheckedState",
    defaultMessage: "This item is completed."
  },
  todoItemAriaLabelUncheckedState: {
    id: "todoItemAriaLabelUncheckedState",
    defaultMessage: "This item is active."
  },
  todoItemAriaLabelTitle: {
    id: "todoItemAriaLabelTitle",
    defaultMessage: "The title is"
  },
  deleteItemTitle: {
    id: "deleteItemTitle",
    defaultMessage: "Delete this item."
  },
  deleteItemAriaLabel: {
    id: "deleteItemAriaLabel",
    defaultMessage: "Delete"
  },
  workingOnSpinnerLabel: {
    id: "workingOnSpinnerLabel",
    defaultMessage: "Working on..."
  },
  titleEmptyErrorMessage: {
    id: "titleEmptyErrorMessage",
    defaultMessage: "You can not leave this blank."
  }
});

export default strings;
