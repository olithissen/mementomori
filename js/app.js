import { data } from "./config.js";

let birthday = data.birthday;

dayjs.extend(dayjs_plugin_isoWeek);
dayjs.extend(dayjs_plugin_isSameOrBefore);

let canvas = $("<div/>");

for (let i = 0; i < data.numberOfYears; i++) {
  const currentYear = dayjs(birthday).add(i, "years").startOf("isoWeek");
  const nextYear = dayjs(birthday)
    .add(i + 1, "years")
    .startOf("isoWeek");

  let current = currentYear;

  let year = $("<div/>").addClass("year");
  while (current.isBefore(nextYear)) {
    let week = $("<span/>")
      .attr("id", current.format("YYYY-MM-DD"))
      .attr("title", current.format("YYYY-MM-DD"))
      .html("◻")
    year.append(week);

    if (current.isSameOrBefore(dayjs(), "isoWeek")) {
      week.text("◼");
    }
    current = current.add(1, "week");
  }

  $(canvas).append(year);
  year = $("<div/>").addClass("year");
}

$("#cal").append(canvas);

let currentWeek = $("#" + dayjs().startOf("isoWeek").format("YYYY-MM-DD"));
currentWeek.addClass("currentWeek");

data.specialDates.forEach((date) => {
  console.log(date);
  let element = $("#" + dayjs(date[0]).startOf("isoWeek").format("YYYY-MM-DD"));
  let currentTitle = element.attr("title");
  element
    .css("color", date[2])
    .attr("title", currentTitle + "\n\t" + date[0] + ": " + date[1]);
});
