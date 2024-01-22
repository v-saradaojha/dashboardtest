export function getDateFromIsoString(dateString: string) {
    const date = dateString.split("T")[0];
    const date_components = date.split("-");
    const day = Number(date_components[2]);
    const month = Number(date_components[1]);
    const year = Number(date_components[0]);
    return `${month}/${day}/${year}`;
  }
  