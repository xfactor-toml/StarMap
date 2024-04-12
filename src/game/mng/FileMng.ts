import { FarGalaxyParams, GalaxyStarParams } from "~/game/data/Types";
import { GalaxyData } from "../data/GlobalParams";

export class FileMng {
    
    public static saveGalaxy(aGalaxyData: GalaxyData, aGalaxyStarsData: GalaxyStarParams[],
        aBlinkStarsData: GalaxyStarParams[], aFarGalaxiesData: FarGalaxyParams[]) {

        function download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }

        let saveData = {
            galaxyData: aGalaxyData,
            galaxyStarsData: aGalaxyStarsData,
            galaxyBlinkStarsData: aBlinkStarsData,
            farGalaxiesData: aFarGalaxiesData

        };

        let jsonData = JSON.stringify(saveData);
        
        // var fs = require('fs');
        // fs.writeFile("test.json", jsonData, (err) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // });

        download(jsonData, 'galaxyState.json', 'text/plain');
    }

}