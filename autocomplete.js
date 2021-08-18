//autocomplete function
//takes in an object that will destructured
const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

  //need to add a listener to our input
  const input = root.querySelector("input");
  //need to toggle between display block or none
  const dropdown = root.querySelector(".dropdown");
  //append all our movie results in here
  const resultsWraper = root.querySelector(".results");

  //turn it into async function and wait for the movies it will get
  const onInput = async (event) => {
    //this will hold all movie info we are fetching
    const items = await fetchData(event.target.value);

    //If there are no movie results then close dropdown
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    //clear the movie list before rendering new movies
    resultsWraper.innerHTML = "";
    //add is-active class from bulma to make it a drop down when you start searching
    dropdown.classList.add("is-active");
    //go through every movie in the list of movies
    for (let item of items) {
      // creates an anchor tag for every movie
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      //use our renderOption function we passed in
      option.innerHTML = renderOption(item);

      //closes drobdown menu and puts title on input when movie is clicked
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      //appends the results to the resultswrapper div
      resultsWraper.appendChild(option);
    }
  };

  // when we type on search, we call onInput that is inside debounce
  input.addEventListener("input", debounce(onInput));

  //closes dropdown menu when clicked outside
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
