const model = await tf.loadLayersModel('saved_model/modeljs/model.json'); // Load the js model

/**
 * This function will transform the float guessed by the model into an integer.
 * @param {*} value value guesse by the model
 * @returns integer 1 or 0
 */
function guess(value) {
    if (value < 0.5) {
        return 0
    } 
    else{
        return 1
    }
}

/**
 * function that gives the rgb value of the HEX color
 * @param {*} hex Hex code of the color
 * @returns the rgb value
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

/**
 * Function that will predict the value of the text
 */
function modelPredict(r, g, b) {
    const input = tf.tensor2d([[r/255, g/255, b/255]]); 

    let results = model.predict(input); // Prediciton of the model
    const value = guess(results.dataSync()[0])

    return value;
}


document.getElementById('colorPicked').addEventListener('input', function() {
    var rgbVal = hexToRgb(this.value);
    var valueText = modelPredict(rgbVal.r, rgbVal.g, rgbVal.b);

    document.getElementById('display').style.backgroundColor = this.value; // Changes the color of the background
    document.getElementById('textCol').style.color = 'rgb(' + valueText*255 + ',' + valueText*255 + ',' + valueText*255 + ')';
})