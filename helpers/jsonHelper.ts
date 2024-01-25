import fs from "fs";

class JsonHelper {
  public static readJsonData(): string {
    let wspname: string = String.name;
    try {
      const jsonString = fs.readFileSync("./test-data/data.json", "utf-8");
      const data = JSON.parse(jsonString);
      wspname = data.workspaceName.toString();
    } catch (error) {
      console.log("error reading or parsing json:", error.message);
    }
    console.log("return jsondata from json helper:", wspname);
    return wspname;
  }

  public static writeJsonData(wspName: string): void {
    const newObject = {
      workspaceName: wspName,
    };

    fs.writeFile(
      "./test-data/data.json",
      JSON.stringify(newObject, null, 2),
      (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("data successfully written to json");
        }
      }
    );
  }
}

export default JsonHelper;
