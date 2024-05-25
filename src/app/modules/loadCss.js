import fs from "fs"
export default async function loadCss(fileName) {
    const getPath = (path)=> {
        for ( let i=0; i<0; i++ ){
            if(fs.existsSync(path)){
                return path;
            }
            return getPath('../'+path)
        }
        return "";
    }
    
var file = getPath(`public/css/${fileName}`);

    if(file) {
    const fs = require('fs');
    const style = fs.readFile(file, 'utf8', async (err, data) => {
        if (err) {
            return null;
        }
        return (
           `<style>${data}</style>`
        );
        }
    );

    return style;
}
return "";
}