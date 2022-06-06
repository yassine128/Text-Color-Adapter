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


const input = tf.tensor2d([[1, 1, 1]]); 

let results = model.predict(input); // Prediciton of the model
const value = guess(results.dataSync()[0])

console.log(value);