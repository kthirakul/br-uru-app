export const editBookFromList = (history, keepMyBook, datebook) => {
  history.push({ pathname: "/", state: { keepMyBook, datebook } });
};
