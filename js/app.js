import { data as defaultData } from "./config.js";

dayjs.extend(dayjs_plugin_isoWeek);
dayjs.extend(dayjs_plugin_isSameOrBefore);

let data = "";

function refresh() {
  let birthday = data.birthday;
  let years = "";

  for (let i = 0; i < data.numberOfYears; i++) {
    const currentYear = dayjs(birthday).add(i, "years").startOf("isoWeek");
    const nextYear = dayjs(birthday)
      .add(i + 1, "years")
      .startOf("isoWeek");

    let current = currentYear;

    let weeks = "";
    while (current.isBefore(nextYear)) {
      let currentFormatted = current.format("YYYY-MM-DD");
      let symbol = current.isSameOrBefore(dayjs(), "isoWeek") ? "◼" : "◻";
      let week = `<span id=${currentFormatted} title=${currentFormatted}>${symbol}</span>`;
      weeks += week;
      current = current.add(1, "week");
    }
    let year = `<div class='year'>${weeks}</div>`;
    years += year;
  }

  $("#cal").html(years);

  let currentWeek = $("#" + dayjs().startOf("isoWeek").format("YYYY-MM-DD"));
  currentWeek.addClass("currentWeek");

  if ("specialDates" in data) {
    data.specialDates.forEach((date) => {
      let element = $(
        "#" + dayjs(date[0]).startOf("isoWeek").format("YYYY-MM-DD")
      );
      let currentTitle = element.attr("title");
      element
        .css("color", date[2])
        .attr("title", currentTitle + "\n\t" + date[0] + ": " + date[1]);
    });
  }
}

loadFromLocalStorage();
refresh();

$("#refresh").click(updateAndRefresh());
$("#input_dob").change(updateAndRefresh());
$("#input_years").change(updateAndRefresh());

$("#save").click(saveToLocalStorage);
$("#load").click(loadFromLocalStorage);

function updateAndRefresh() {
  return function () {
    data.birthday = $("#input_dob").val();
    data.numberOfYears = $("#input_years").val();
    refresh();
  };
}

function loadFromLocalStorage() {
  data = JSON.parse(localStorage.getItem("MementoMori"));
  if (data == null) {
    data = defaultData;
  }
  $("#input_dob").val(data.birthday)
  $("#input_years").val(data.numberOfYears)
  refresh();
}

function saveToLocalStorage() {
  localStorage.setItem("MementoMori", JSON.stringify(data));
}
